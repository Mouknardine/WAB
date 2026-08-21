<?php

/**
 * WAB. — Envoi du formulaire de contact
 * Reçoit le POST du formulaire (AJAX ou classique), valide les
 * champs, neutralise les tentatives d'injection, puis envoie
 * l'email via le SMTP authentifié d'Infomaniak (smtp-mailer.php).
 * Répond en JSON pour l'AJAX, ou redirige vers contact.html
 * pour un envoi sans JavaScript.
 */

declare(strict_types=1);

require __DIR__ . '/smtp-mailer.php';

const RECIPIENT = 'contact@wearebrothers.ch';

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
$budget  = clean((string) ($_POST['Budget'] ?? ''), 200);
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

// Identifiants SMTP : fichier généré au déploiement depuis les
// secrets GitHub (SMTP_USER / SMTP_PASSWORD), absent du dépôt.
$configFile = __DIR__ . '/mail-config.php';
if (!is_file($configFile)) {
    respond(false, 'Configuration email manquante sur le serveur');
}
require $configFile;

$smtpUser = base64_decode(SMTP_USER_B64, true) ?: '';
$smtpPass = base64_decode(SMTP_PASS_B64, true) ?: '';
if ($smtpUser === '' || $smtpPass === '') {
    respond(false, 'Configuration email incomplète sur le serveur');
}

$erreur = smtp_send(
    $smtpUser,
    $smtpPass,
    $smtpUser, // l'expéditeur doit être l'adresse authentifiée
    RECIPIENT,
    "Nouveau message de {$nom} — wearebrothers.ch",
    $corps,
    $email
);

respond($erreur === null, $erreur === null ? '' : "L'envoi a échoué : {$erreur}");
