<?php

/**
 * WAB. — Tests du filtre anti-spam (barème et jeton de page)
 * Lancement : php tests/antispam.php
 * Sort en code 1 si un cas régresse, pour un usage en intégration.
 * Le scénario d'ordre entre couches est dans antispam-e2e.sh.
 */

declare(strict_types=1);

require __DIR__ . '/../spam-filter.php';

$echecs = 0;

function cas(string $titre, string $attendu, array $champs, ?int $age, array $server = []): void
{
    global $echecs;

    $_SERVER = array_merge(['REMOTE_ADDR' => '203.0.113.7'], $server);
    $analyse = spam_score($champs, $age);
    $obtenu  = $analyse['score'] >= SPAM_BLOCK_SCORE ? 'bloqué' : 'passe';
    $ok      = $obtenu === $attendu;

    if (!$ok) {
        $echecs++;
    }

    printf("%s  %-7s %2d/%d  %s\n", $ok ? '  ok  ' : ' ÉCHEC', $obtenu, $analyse['score'], SPAM_BLOCK_SCORE, $titre);
    if (!$ok) {
        echo "         attendu « {$attendu} » — " . (implode(' ; ', $analyse['raisons']) ?: 'aucun signal') . "\n";
    }
}

/* ── Le jeton doit se calculer à l'identique en PHP et en JavaScript ──
   Valeur de référence produite par l'algorithme de contact-form.js.
   Si elle change, les deux implémentations ont divergé et tous les
   envois du site seraient traités comme dépourvus de jeton. */

$reference = '1gjqtby';
$obtenu = spam_stamp_hash(SPAM_STAMP_SALT . ':1756600000');
if ($obtenu !== $reference) {
    $echecs++;
    echo " ÉCHEC  jeton : PHP produit « {$obtenu} », le JavaScript produit « {$reference} »\n";
} else {
    echo "  ok    jeton : PHP et JavaScript concordent\n";
}

$horodatage = time() - 60;
$jeton = $horodatage . '.' . spam_stamp_hash(SPAM_STAMP_SALT . ':' . $horodatage);
if (spam_stamp_age($jeton) === null) {
    $echecs++;
    echo " ÉCHEC  jeton : un jeton valide est rejeté\n";
} else {
    echo "  ok    jeton : un jeton valide est accepté\n";
}
if (spam_stamp_age($horodatage . '.zzzzzz') !== null) {
    $echecs++;
    echo " ÉCHEC  jeton : une somme de contrôle falsifiée est acceptée\n";
} else {
    echo "  ok    jeton : une somme de contrôle falsifiée est rejetée\n";
}

$dSite = ['HTTP_ORIGIN' => 'https://' . SPAM_SITE_HOST];

echo "\n── Doivent être bloqués ──\n";

// Message réellement reçu le 31.08.2026 sur contact@wearebrothers.ch
cas('« Larrynes », robot postant directement sur le PHP', 'bloqué', [
    'nom' => 'Larrynes', 'email' => 'stefff.b@web.de', 'budget' => '114144',
    'message' => 'Get ready to win with a $25,000 promo code https://cut.gl/NoSNR',
], null);

cas('le même, en exécutant le JavaScript', 'bloqué', [
    'nom' => 'Larrynes', 'email' => 'stefff.b@web.de', 'budget' => '114144',
    'message' => 'Get ready to win with a $25,000 promo code https://cut.gl/NoSNR',
], 2, $dSite);

cas('démarchage SEO / backlinks', 'bloqué', [
    'nom' => 'Rahul', 'email' => 'r@seo-agency.top', 'budget' => '',
    'message' => 'We offer SEO services and quality backlinks to rank higher. Visit seopro.top for details.',
], 1);

cas('crypto en cyrillique', 'bloqué', [
    'nom' => 'Иван', 'email' => 'x@mail.ru', 'budget' => '',
    'message' => 'Заработок на crypto! bit.ly/abc123 Привет',
], 45);

cas('posté depuis un autre domaine', 'bloqué', [
    'nom' => 'Bot', 'email' => 'a@b.com', 'budget' => '',
    'message' => 'Bonjour, un projet de site vitrine pour notre atelier.',
], 60, ['HTTP_ORIGIN' => 'https://spam-farm.xyz']);

// Un lien dans le champ nom vaut 5 points : c'est délibérément sous le
// seuil, comme tout signal isolé. Un robot en cumule toujours d'autres —
// ici l'absence de jeton, puisqu'il n'affiche jamais la page.
cas('lien dans le champ nom, robot sans jeton', 'bloqué', [
    'nom' => 'visitez promo.top', 'email' => 'a@b.com', 'budget' => '',
    'message' => 'Bonjour, nous aimerions discuter dun projet avec votre studio.',
], null, $dSite);

echo "\n── Doivent passer ──\n";

cas('demande de devis classique', 'passe', [
    'nom' => 'Marie Rochat', 'email' => 'marie@atelier-rochat.ch', 'budget' => '15-20k',
    'message' => "Bonjour, nous cherchons une agence pour refaire l'identité et le site de notre atelier à Lausanne. Auriez-vous des disponibilités en septembre ?",
], 95, $dSite);

cas('prospect qui donne l’adresse de son site', 'passe', [
    'nom' => 'Julien Favre', 'email' => 'j.favre@boulangerie-favre.ch', 'budget' => 'à discuter',
    'message' => "Bonjour, notre site actuel est https://boulangerie-favre.ch et il date de 2015. On aimerait une refonte complète, plus du SEO local. Merci !",
], 120, $dSite);

cas('message court mais réel', 'passe', [
    'nom' => 'Léa Dubois', 'email' => 'lea@studio-nord.ch', 'budget' => '',
    'message' => 'Bonjour, on peut se voir cette semaine ?',
], 40, $dSite);

cas('client étranger, en anglais', 'passe', [
    'nom' => 'Sarah Lindqvist', 'email' => 'sarah@northlight.se', 'budget' => '40k',
    'message' => "Hi, we saw your work on wearebrothers.ch and our current site is northlight.se. We would like to discuss a full rebrand for Q4.",
], 200, $dSite);

cas('envoi sans JavaScript, avec un lien', 'passe', [
    'nom' => 'Paul Meier', 'email' => 'paul@meier-sa.ch', 'budget' => '',
    'message' => "Bonjour, voici notre site https://meier-sa.ch — nous voulons un logiciel de gestion sur mesure. Merci de nous rappeler.",
], null, ['HTTP_REFERER' => 'https://' . SPAM_SITE_HOST . '/contact']);

// La vitesse seule ne bloque jamais : le remplissage automatique du
// navigateur, ou un message collé depuis le presse-papier, va vite.
cas('rempli en 1 s, mais sans aucun autre signal', 'passe', [
    'nom' => 'Nicolas Perret', 'email' => 'n.perret@perret-sa.ch', 'budget' => '',
    'message' => 'Bonjour, nous souhaitons un devis pour la refonte de notre site vitrine.',
], 1, $dSite);

echo "\n";
if ($echecs > 0) {
    echo "{$echecs} cas en échec.\n";
    exit(1);
}
echo "Tous les cas passent.\n";
