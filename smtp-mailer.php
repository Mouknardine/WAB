<?php

/**
 * WAB. — Mini client SMTP (Infomaniak)
 * Envoie un email via mail.infomaniak.com en SSL avec
 * authentification, sans dépendance externe. Utilisé par
 * send-message.php ; les identifiants viennent de
 * mail-config.php, généré au déploiement depuis les
 * secrets GitHub (jamais dans le dépôt).
 */

declare(strict_types=1);

/**
 * Envoie le message. Retourne null si tout s'est bien passé,
 * sinon un court texte d'erreur (réponse SMTP fautive).
 */
function smtp_send(string $user, string $pass, string $from, string $to, string $subject, string $body, string $replyTo): ?string
{
    $fp = @stream_socket_client('ssl://mail.infomaniak.com:465', $errno, $errstr, 15);
    if ($fp === false) {
        return "connexion impossible ({$errstr})";
    }
    stream_set_timeout($fp, 15);

    $read = static function () use ($fp): string {
        $resp = '';
        while (($line = fgets($fp, 515)) !== false) {
            $resp .= $line;
            if (strlen($line) < 4 || $line[3] !== '-') {
                break; // fin d'une réponse (gère le multiligne « 250- »)
            }
        }
        return $resp;
    };

    $exchange = static function (string $cmd, array $expected) use ($fp, $read): ?string {
        if ($cmd !== '') {
            fwrite($fp, $cmd . "\r\n");
        }
        $resp = $read();
        $code = (int) substr($resp, 0, 3);
        return in_array($code, $expected, true) ? null : trim($resp);
    };

    $headers = implode("\r\n", [
        'From: WAB. Site <' . $from . '>',
        'To: <' . $to . '>',
        'Reply-To: ' . $replyTo,
        'Subject: =?UTF-8?B?' . base64_encode($subject) . '?=',
        'Date: ' . date('r'),
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
    ]);

    // Corps en CRLF ; les lignes commençant par « . » sont échappées (RFC 5321)
    $data = $headers . "\r\n\r\n" . preg_replace('/^\./m', '..', str_replace(["\r\n", "\r", "\n"], "\r\n", $body));

    $steps = [
        ['', [220]],
        ['EHLO wearebrothers.ch', [250]],
        ['AUTH LOGIN', [334]],
        [base64_encode($user), [334]],
        [base64_encode($pass), [235]],
        ['MAIL FROM:<' . $from . '>', [250]],
        ['RCPT TO:<' . $to . '>', [250, 251]],
        ['DATA', [354]],
        [$data . "\r\n.", [250]],
    ];

    foreach ($steps as [$cmd, $expected]) {
        $error = $exchange($cmd, $expected);
        if ($error !== null) {
            fclose($fp);
            return $error;
        }
    }

    fwrite($fp, "QUIT\r\n");
    fclose($fp);
    return null;
}
