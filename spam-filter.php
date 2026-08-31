<?php

/**
 * WAB. — Filtre anti-spam du formulaire de contact
 * Couches de défense appliquées avant l'envoi de l'email :
 *   1. deux pièges invisibles (honeypots) ;
 *   2. jeton de temps généré par le JavaScript de la page
 *      (un robot qui poste directement sur send-message.php ne
 *      l'a pas, et un humain met plus de trois secondes) ;
 *   3. score de contenu (liens, raccourcisseurs, mots-clés,
 *      alphabets exotiques) ;
 *   4. limite de fréquence par adresse IP + anti-doublon ;
 *   5. Cloudflare Turnstile, optionnel (voir README).
 * Les messages bloqués ne sont jamais envoyés mais toujours
 * journalisés, pour pouvoir vérifier les faux positifs.
 */

declare(strict_types=1);

/** Score à partir duquel le message est considéré comme du spam. */
const SPAM_BLOCK_SCORE = 7;

/** Sel du jeton de temps — doit rester identique à celui de contact-form.js. */
const SPAM_STAMP_SALT = 'wab-contact-v1';

/** Délai minimum, en secondes, entre l'affichage de la page et l'envoi. */
const SPAM_MIN_SECONDS = 3;

/** Durée de validité du jeton de temps (un onglet peut rester ouvert longtemps). */
const SPAM_MAX_SECONDS = 43200; // 12 h

/** Limites de fréquence par adresse IP. */
const SPAM_MAX_PER_HOUR = 3;
const SPAM_MAX_PER_DAY  = 10;

/** Raccourcisseurs d'URL : quasi jamais utilisés par un vrai prospect. */
const SPAM_SHORTENERS = [
    'cut.gl', 'cutt.ly', 'bit.ly', 'bit.do', 'tinyurl.com', 'tiny.cc', 't.co',
    'goo.gl', 'is.gd', 'v.gd', 'buff.ly', 'ow.ly', 'rb.gy', 'rebrand.ly',
    'shorturl.at', 's.id', 'lnkd.in', 'clck.ru', 'vk.cc', 'u.to', 'qps.ru',
    'gg.gg', 'tny.im', 'surl.li', 't.ly', 'short.gy', 'shrtco.de', 'urlz.fr',
];

/** Extensions de domaine massivement utilisées par les robots. */
const SPAM_BAD_TLDS = ['xyz', 'top', 'icu', 'club', 'work', 'loan', 'gq', 'cf', 'tk', 'ml'];

/** Formules typiques du spam de formulaire (jamais bloquantes à elles seules). */
const SPAM_KEYWORDS = [
    'promo code', 'promocode', 'bonus code', 'casino', 'gambling', 'betting',
    'bitcoin', 'crypto', 'cryptocurrency', 'forex', 'binary option', 'trading signal',
    'airdrop', 'viagra', 'cialis', 'payday', 'quick loan', 'make money',
    'earn money', 'earn extra', 'work from home', 'passive income',
    'seo services', 'seo service', 'backlink', 'link building', 'guest post',
    'buy followers', 'instagram followers', 'increase your traffic',
    'first page of google', 'rank higher', 'you have won', 'you won',
    'claim your', 'get ready to win', 'free gift', 'gift card',
    'dear sir or madam', 'hire dedicated', 'offshore development',
];

/* ────────────────────────────────────────────────────────────────
   Stockage (compteurs de fréquence, doublons, journal)
   ──────────────────────────────────────────────────────────────── */

/** Répertoire de travail, protégé des accès web. Null si rien n'est inscriptible. */
function spam_storage_dir(): ?string
{
    static $dir = false;
    if ($dir !== false) {
        return $dir;
    }

    foreach ([__DIR__ . '/.wab-data', sys_get_temp_dir() . '/wab-data'] as $candidate) {
        if (!is_dir($candidate) && !@mkdir($candidate, 0700, true) && !is_dir($candidate)) {
            continue;
        }
        if (!is_writable($candidate)) {
            continue;
        }
        $guard = $candidate . '/.htaccess';
        if (!is_file($guard)) {
            @file_put_contents($guard, "Require all denied\n<IfModule !mod_authz_core.c>\nDeny from all\n</IfModule>\n");
        }
        return $dir = $candidate;
    }

    return $dir = null;
}

/** Lit un fichier JSON du répertoire de travail. */
function spam_read_json(string $name): array
{
    $dir = spam_storage_dir();
    if ($dir === null || !is_file($dir . '/' . $name)) {
        return [];
    }
    $data = json_decode((string) @file_get_contents($dir . '/' . $name), true);
    return is_array($data) ? $data : [];
}

/** Écrit un fichier JSON du répertoire de travail (verrou compris). */
function spam_write_json(string $name, array $data): void
{
    $dir = spam_storage_dir();
    if ($dir === null) {
        return;
    }
    @file_put_contents($dir . '/' . $name, json_encode($data, JSON_UNESCAPED_UNICODE), LOCK_EX);
}

/* ────────────────────────────────────────────────────────────────
   Outils
   ──────────────────────────────────────────────────────────────── */

/** Équivalent de str_ends_with, disponible aussi en PHP 7.4. */
function spam_ends_with(string $sujet, string $fin): bool
{
    $len = strlen($fin);
    return $len === 0 || (strlen($sujet) >= $len && substr_compare($sujet, $fin, -$len) === 0);
}

/** Adresse IP de l'expéditeur (en tenant compte d'un éventuel proxy). */
function spam_client_ip(): string
{
    $remote = (string) ($_SERVER['REMOTE_ADDR'] ?? '');
    $isPrivate = $remote !== '' && !filter_var(
        $remote,
        FILTER_VALIDATE_IP,
        FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE
    );

    if ($isPrivate && !empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $first = trim(explode(',', (string) $_SERVER['HTTP_X_FORWARDED_FOR'])[0]);
        if (filter_var($first, FILTER_VALIDATE_IP)) {
            return $first;
        }
    }

    return $remote !== '' ? $remote : 'inconnue';
}

/**
 * Somme de contrôle du jeton de temps.
 * Reproduit exactement l'algorithme de contact-form.js
 * (hachage 31 sur 32 bits, rendu en base 36).
 */
function spam_stamp_hash(string $value): string
{
    $hash = 0;
    $length = strlen($value);
    for ($i = 0; $i < $length; $i++) {
        $hash = ($hash * 31 + ord($value[$i])) & 0xFFFFFFFF;
    }
    return base_convert((string) $hash, 10, 36);
}

/**
 * Âge du formulaire, en secondes, d'après le jeton posé par le
 * JavaScript. Retourne null si le jeton est absent ou falsifié.
 */
function spam_stamp_age(string $token): ?int
{
    if (!preg_match('/^(\d{9,11})\.([0-9a-z]{1,7})$/', $token, $m)) {
        return null;
    }
    if (!hash_equals(spam_stamp_hash(SPAM_STAMP_SALT . ':' . $m[1]), $m[2])) {
        return null;
    }
    return time() - (int) $m[1];
}

/**
 * Liste les domaines distincts vers lesquels un texte renvoie
 * (adresses email et liens vers notre propre site exclus).
 * On raisonne en domaines plutôt qu'en URL brutes : deux écritures
 * du même lien — « https://cut.gl/x » et « cut.gl/x » — ne comptent
 * ainsi qu'une seule fois.
 */
function spam_find_urls(string $text): array
{
    $text = preg_replace('/[\w.+-]+@[\w.-]+\.[a-z]{2,}/iu', ' ', $text) ?? $text;

    $bruts = [];
    if (preg_match_all('~(?:https?://|www\.)[^\s<>"\'\)\]]+~i', $text, $m)) {
        $bruts = $m[0];
    }
    // Domaines écrits sans « http » : « cut.gl/xxx », « promo.top »
    $tlds = implode('|', array_merge(SPAM_BAD_TLDS, ['com', 'net', 'org', 'ru', 'online', 'site', 'shop', 'link', 'gl', 'ly', 'cc', 'info', 'biz']));
    if (preg_match_all('~\b[a-z0-9][a-z0-9-]*\.(?:' . $tlds . ')(?:/\S*)?~i', $text, $m)) {
        $bruts = array_merge($bruts, $m[0]);
    }

    $hotes = [];
    foreach ($bruts as $url) {
        $hote = preg_replace('~^(?:https?://)?(?:www\.)?~i', '', strtolower($url));
        $hote = rtrim(explode('/', $hote)[0], '.,;:!?');
        if ($hote !== '' && $hote !== 'wearebrothers.ch') {
            $hotes[$hote] = true;
        }
    }

    return array_keys($hotes);
}

/** Vrai si l'un des domaines est un raccourcisseur ou une extension à risque. */
function spam_has_bad_domain(array $hotes): bool
{
    foreach ($hotes as $hote) {
        foreach (SPAM_SHORTENERS as $shortener) {
            if ($hote === $shortener || spam_ends_with($hote, '.' . $shortener)) {
                return true;
            }
        }
        foreach (SPAM_BAD_TLDS as $tld) {
            if (spam_ends_with($hote, '.' . $tld)) {
                return true;
            }
        }
    }
    return false;
}

/* ────────────────────────────────────────────────────────────────
   Score de contenu
   ──────────────────────────────────────────────────────────────── */

/**
 * Note le message. Plus le score est élevé, plus c'est du spam.
 * Retourne ['score' => int, 'raisons' => string[]].
 *
 * @param array    $champs ['nom' => …, 'email' => …, 'budget' => …, 'message' => …]
 * @param int|null $age    Âge du formulaire en secondes, null si jeton absent/falsifié.
 */
function spam_score(array $champs, ?int $age): array
{
    $score = 0;
    $raisons = [];

    $add = static function (int $points, string $raison) use (&$score, &$raisons): void {
        $score += $points;
        $raisons[] = $raison . " (+{$points})";
    };

    $message = (string) ($champs['message'] ?? '');
    $nom     = (string) ($champs['nom'] ?? '');
    $budget  = (string) ($champs['budget'] ?? '');

    /* ── Jeton de temps ── */
    if ($age === null) {
        $add(3, 'jeton de page absent ou falsifié (envoi sans JavaScript)');
    } elseif ($age < SPAM_MIN_SECONDS) {
        $add(4, "formulaire rempli en {$age}s");
    } elseif ($age > SPAM_MAX_SECONDS) {
        $add(1, 'page ouverte depuis plus de 12 h');
    }

    /* ── Provenance ── */
    $origine = (string) ($_SERVER['HTTP_ORIGIN'] ?? $_SERVER['HTTP_REFERER'] ?? '');
    if ($origine === '') {
        $add(2, 'aucune provenance annoncée');
    } else {
        $hote = strtolower((string) parse_url($origine, PHP_URL_HOST));
        if ($hote !== '' && $hote !== 'wearebrothers.ch' && $hote !== 'www.wearebrothers.ch') {
            $add(SPAM_BLOCK_SCORE, "envoyé depuis un autre site ({$hote})");
        }
    }

    /* ── Liens ── */
    $urls = spam_find_urls($message);
    $nb = count($urls);
    if ($nb === 1) {
        $add(3, '1 lien dans le message');
    } elseif ($nb === 2) {
        $add(5, '2 liens dans le message');
    } elseif ($nb > 2) {
        $add(SPAM_BLOCK_SCORE, "{$nb} liens dans le message");
    }
    if (spam_has_bad_domain($urls)) {
        $add(5, 'lien raccourci ou domaine à risque');
    }
    if (preg_match('~\[url|<a\s+href|\[link~i', $message)) {
        $add(5, 'balise de lien (BBCode / HTML) dans le message');
    }
    if (spam_find_urls($nom) !== [] || spam_find_urls($budget) !== []) {
        $add(5, 'lien dans le champ nom ou budget');
    }

    /* ── Formules typiques ── */
    $minuscule = mb_strtolower($message . ' ' . $nom, 'UTF-8');
    $motsTrouves = [];
    foreach (SPAM_KEYWORDS as $mot) {
        if (strpos($minuscule, $mot) !== false) {
            $motsTrouves[] = $mot;
        }
    }
    if ($motsTrouves !== []) {
        $add(min(6, 3 * count($motsTrouves)), 'formules de spam : ' . implode(', ', array_slice($motsTrouves, 0, 4)));
    }

    /* ── Alphabets sans rapport avec notre clientèle ── */
    if (preg_match('/\p{Cyrillic}/u', $message . $nom)) {
        $add(3, 'caractères cyrilliques');
    }
    if (preg_match('/\p{Han}|\p{Hiragana}|\p{Hangul}/u', $message . $nom)) {
        $add(3, 'caractères asiatiques');
    }

    /* ── Signaux faibles ── */
    if (mb_strlen($message, 'UTF-8') < 20) {
        $add(2, 'message très court');
    }
    if (preg_match('/^[A-Za-z]+\d{2,}$/', $nom)) {
        $add(2, 'nom généré automatiquement');
    }

    return ['score' => $score, 'raisons' => $raisons];
}

/* ────────────────────────────────────────────────────────────────
   Fréquence et doublons
   ──────────────────────────────────────────────────────────────── */

/**
 * Vérifie les limites d'envoi pour une IP et enregistre la tentative.
 * Retourne null si l'envoi est autorisé, sinon la raison du refus.
 */
function spam_rate_limit(string $ip): ?string
{
    if (spam_storage_dir() === null) {
        return null; // pas de stockage : on n'empêche pas les envois légitimes
    }

    $now = time();
    $cle = substr(hash('sha256', $ip), 0, 16);
    $journal = spam_read_json('rate.json');

    // On oublie tout ce qui a plus de 24 h.
    foreach ($journal as $k => $horodatages) {
        $journal[$k] = array_values(array_filter((array) $horodatages, static fn ($t) => $now - (int) $t < 86400));
        if ($journal[$k] === []) {
            unset($journal[$k]);
        }
    }

    $miens = $journal[$cle] ?? [];
    $dansLHeure = count(array_filter($miens, static fn ($t) => $now - (int) $t < 3600));

    $refus = null;
    if ($dansLHeure >= SPAM_MAX_PER_HOUR) {
        $refus = 'plus de ' . SPAM_MAX_PER_HOUR . ' envois en une heure';
    } elseif (count($miens) >= SPAM_MAX_PER_DAY) {
        $refus = 'plus de ' . SPAM_MAX_PER_DAY . ' envois en 24 h';
    }

    $miens[] = $now;
    $journal[$cle] = $miens;
    spam_write_json('rate.json', $journal);

    return $refus;
}

/**
 * Vrai si le même message a déjà été reçu dans les 24 h.
 * Enregistre l'empreinte au passage.
 */
function spam_is_duplicate(string $email, string $message): bool
{
    if (spam_storage_dir() === null) {
        return false;
    }

    $now = time();
    $empreinte = hash('sha256', mb_strtolower($email . '|' . preg_replace('/\s+/u', ' ', $message)));
    $vus = spam_read_json('seen.json');

    foreach ($vus as $k => $t) {
        if ($now - (int) $t >= 86400) {
            unset($vus[$k]);
        }
    }

    $dejaVu = isset($vus[$empreinte]);
    $vus[$empreinte] = $now;
    spam_write_json('seen.json', $vus);

    return $dejaVu;
}

/* ────────────────────────────────────────────────────────────────
   Journal
   ──────────────────────────────────────────────────────────────── */

/** Consigne une décision (bloqué ou envoyé) pour pouvoir la relire. */
function spam_log(string $verdict, array $champs, int $score, array $raisons, string $ip): void
{
    $dir = spam_storage_dir();
    if ($dir === null) {
        return;
    }

    $fichier = $dir . '/spam.log';
    if (is_file($fichier) && filesize($fichier) > 262144) {
        @unlink($fichier); // on repart à zéro plutôt que de laisser gonfler
    }

    $ligne = json_encode([
        'date'    => date('c'),
        'verdict' => $verdict,
        'score'   => $score,
        'raisons' => $raisons,
        'ip'      => $ip,
        'nom'     => mb_substr((string) ($champs['nom'] ?? ''), 0, 80),
        'email'   => mb_substr((string) ($champs['email'] ?? ''), 0, 120),
        'message' => mb_substr((string) ($champs['message'] ?? ''), 0, 400),
    ], JSON_UNESCAPED_UNICODE);

    @file_put_contents($fichier, $ligne . "\n", FILE_APPEND | LOCK_EX);
}

/* ────────────────────────────────────────────────────────────────
   Cloudflare Turnstile (optionnel — voir README)
   ──────────────────────────────────────────────────────────────── */

/** Valide le jeton Turnstile auprès de Cloudflare. */
function spam_turnstile_ok(string $secret, string $token, string $ip): bool
{
    if ($token === '') {
        return false;
    }

    $contexte = stream_context_create([
        'http' => [
            'method'        => 'POST',
            'header'        => "Content-Type: application/x-www-form-urlencoded\r\n",
            'content'       => http_build_query(['secret' => $secret, 'response' => $token, 'remoteip' => $ip]),
            'timeout'       => 8,
            'ignore_errors' => true,
        ],
    ]);

    $reponse = @file_get_contents('https://challenges.cloudflare.com/turnstile/v0/siteverify', false, $contexte);
    if ($reponse === false) {
        return true; // Cloudflare injoignable : on ne bloque pas un vrai visiteur
    }

    $data = json_decode($reponse, true);
    return is_array($data) && ($data['success'] ?? false) === true;
}
