<?php

/**
 * WAB. — Envoi du formulaire de contact
 * Reçoit le POST du formulaire (AJAX ou classique), valide les
 * champs, neutralise les tentatives d'injection, puis envoie
 * l'email via le SMTP authentifié d'Infomaniak (smtp-mailer.php).
 * Répond en JSON pour la fenêtre de contact (js/contact/), ou
 * redirige vers l'accueil pour un envoi sans JavaScript.
 */

declare(strict_types=1);

require __DIR__ . '/smtp-mailer.php';

const RECIPIENT = 'contact@wearebrothers.ch';

// Les choix proposés par la fenêtre de contact (js/contact/markup.js).
// Toute valeur absente de ces listes est ignorée : le visiteur ne peut
// rien glisser d'autre dans l'email par ces champs.
const PROJETS = ['Site internet', 'Refonte', 'Branding', 'E-commerce', 'Application métier'];
const BUDGETS = ['Moins de 2k', '2k à 4k', '4k à 6k', '6k à 8k', '8k à 10k', 'À définir'];
const DELAIS  = ['Maintenant', "D'ici 3 mois", 'Plus tard'];

/**
 * Ne garde que les valeurs prévues, dans l'ordre des listes.
 * @param mixed $raw Valeur reçue : texte seul ou tableau de textes.
 * @param string[] $allowed
 * @return string[]
 */
function choices($raw, array $allowed): array
{
    $values = array_map('strval', array_filter(is_array($raw) ? $raw : [$raw], 'is_scalar'));
    return array_values(array_intersect($allowed, $values));
}

function respond(bool $ok, string $error = ''): void
{
    $wantsJson = strpos($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json') !== false;
    if ($wantsJson) {
        header('Content-Type: application/json; charset=utf-8');
        http_response_code($ok ? 200 : 400);
        echo json_encode(['success' => $ok, 'error' => $error], JSON_UNESCAPED_UNICODE);
    } else {
        // Envoi sans JavaScript : il n'y a plus de page Contact où
        // afficher le résultat, on revient à l'accueil.
        header('Location: /');
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

$nom        = clean((string) ($_POST['Nom'] ?? ''), 120);
$email      = clean((string) ($_POST['Email'] ?? ''), 200);
$entreprise = clean((string) ($_POST['Entreprise'] ?? ''), 160);
$message    = trim((string) ($_POST['Message'] ?? ''));

if ($nom === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, 'Champs manquants ou email invalide');
}

$message = mb_substr($message, 0, 5000);
$projets = choices($_POST['Projet'] ?? [], PROJETS);
$budget  = choices($_POST['Budget'] ?? '', BUDGETS)[0] ?? '';
$delai   = choices($_POST['Delai'] ?? '', DELAIS)[0] ?? '';

$corps = "Nouveau message depuis wearebrothers.ch\n"
    . "----------------------------------------\n\n"
    . "Nom        : {$nom}\n"
    . "Email      : {$email}\n"
    . ($entreprise !== '' ? "Entreprise : {$entreprise}\n" : '')
    . ($projets !== [] ? 'Projet     : ' . implode(', ', $projets) . "\n" : '')
    . ($budget !== '' ? "Budget     : {$budget} CHF\n" : '')
    . ($delai !== '' ? "Délai      : {$delai}\n" : '')
    . "\nMessage :\n{$message}\n";

// Le budget dans l'objet : la demande se trie dès la boîte de réception.
$objet = "Nouveau message de {$nom}" . ($budget !== '' ? " — budget {$budget}" : '') . ' — wearebrothers.ch';

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
    $objet,
    $corps,
    $email
);

respond($erreur === null, $erreur === null ? '' : "L'envoi a échoué : {$erreur}");
