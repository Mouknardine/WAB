<?php

/**
 * WAB. — Envoi du formulaire de contact
 * Reçoit le POST du formulaire (AJAX ou classique), valide les
 * champs, neutralise les tentatives d'injection, puis envoie
 * l'email via le serveur Infomaniak. Répond en JSON pour l'AJAX,
 * ou redirige vers contact.html pour un envoi sans JavaScript.
 */

declare(strict_types=1);

const RECIPIENT = 'contact@wearebrothers.ch';
const SENDER    = 'no-reply@wearebrothers.ch';

function respond(bool $ok, string $error = ''): void
{
    $wantsJson = strpos($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json') !== false;
    if ($wantsJson) {
        header('Content-Type: application/json; charset=utf-8');
        http_response_code($ok ? 200 : 400);
        echo json_encode(['success' => $ok, 'error' => $error], JSON_UNESCAPED_UNICODE);
    } else {
        header('Location: contact.html?sent=' . ($ok ? '1' : '0'));
    }
    exit;
}

/** Nettoie une valeur destinée au corps ou aux en-têtes de l'email. */
function clean(string $value, int $max): string
{
    $value = str_replace(["\r", "\n", '%0a', '%0d', '%0A', '%0D'], ' ', trim($value));
    return mb_substr($value, 0, $max);
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(false, 'Méthode non autorisée');
}

// Piège anti-spam : un robot a rempli le champ invisible →
// on répond « succès » sans rien envoyer.
if (!empty($_POST['_honey'])) {
    respond(true);
}

$nom     = clean((string) ($_POST['Nom'] ?? ''), 120);
$email   = clean((string) ($_POST['Email'] ?? ''), 200);
$budget  = clean((string) ($_POST['Budget'] ?? ''), 60);
$message = trim((string) ($_POST['Message'] ?? ''));

$besoins = $_POST['Besoin'] ?? [];
$besoinsTexte = is_array($besoins)
    ? implode(', ', array_map(static fn ($b) => clean((string) $b, 40), array_slice($besoins, 0, 6)))
    : clean((string) $besoins, 200);

if ($nom === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, 'Champs manquants ou email invalide');
}

$message = mb_substr($message, 0, 5000);

$corps = "Nouveau message depuis wearebrothers.ch\n"
    . "----------------------------------------\n\n"
    . "Nom     : {$nom}\n"
    . "Email   : {$email}\n"
    . ($besoinsTexte !== '' ? "Besoin  : {$besoinsTexte}\n" : '')
    . ($budget !== '' ? "Budget  : {$budget}\n" : '')
    . "\nMessage :\n{$message}\n";

$sujet = '=?UTF-8?B?' . base64_encode("Nouveau message de {$nom} — wearebrothers.ch") . '?=';

$entetes = implode("\r\n", [
    'From: WAB. Site <' . SENDER . '>',
    'Reply-To: ' . $email,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
]);

$envoye = mail(RECIPIENT, $sujet, $corps, $entetes, '-f' . SENDER);

respond($envoye, $envoye ? '' : "L'envoi a échoué côté serveur");
