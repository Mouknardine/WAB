#!/usr/bin/env bash
#
# WAB. — Test de bout en bout du formulaire de contact
# Vérifie l'ordre des couches : un renvoi identique ne doit jamais
# consommer le quota horaire du visiteur, sans quoi ses messages
# suivants — bien réels — partiraient au silence.
# Les réponses HTTP étant volontairement identiques dans tous les cas,
# c'est le journal qui donne le verdict.
#
# Lancement : tests/antispam-e2e.sh

set -u
racine="$(cd "$(dirname "$0")/.." && pwd)"
port=8791
donnees="$racine/.wab-data"

if [ -e "$donnees" ]; then
    echo "Le dossier $donnees existe déjà — écartez-le avant de lancer le test."
    exit 1
fi

php -S "127.0.0.1:$port" -t "$racine" >/dev/null 2>&1 &
serveur=$!
trap 'kill $serveur 2>/dev/null; rm -rf "$donnees"' EXIT
sleep 2

jeton=$(node -e "
const S='wab-contact-v1', t=Math.floor(Date.now()/1000)-30, s=S+':'+t;
let h=0; for (let i=0;i<s.length;i++) h=(h*31+s.charCodeAt(i))>>>0;
console.log(t+'.'+h.toString(36));
")

envoi() {
    curl -s -o /dev/null -X POST "http://127.0.0.1:$port/send-message.php" \
        -H 'Accept: application/json' -H 'Origin: https://wearebrothers.ch' \
        -d "_ts=$jeton" -d 'Nom=Marie Rochat' -d 'Email=marie@atelier-rochat.ch' \
        --data-urlencode "Message=$1"
}

# Elle envoie, croit son envoi perdu, reclique deux fois,
# puis écrit deux messages différents.
identique="Bonjour, nous cherchons une agence pour refaire le site de notre atelier."
envoi "$identique"
envoi "$identique"
envoi "$identique"
envoi "Rebonjour, j'ajoute que notre delai serait plutot septembre."
envoi "Une derniere question : travaillez-vous aussi le motion design ?"

# Le quota horaire est maintenant atteint (3 messages distincts comptés).
# Ce quatrième message, distinct lui aussi, doit être écarté — et pour la
# bonne raison : un test de quota qui renverrait un message identique
# vérifierait l'anti-doublon sans s'en apercevoir.
envoi "Et un dernier point sur le calendrier de production."

attendu="envoyé bloqué bloqué envoyé envoyé bloqué"

journal() {
    python3 -c "
import json, io
lignes = [json.loads(l) for l in io.open('$donnees/spam.log', encoding='utf-8')]
$1
" 2>/dev/null
}

obtenu=$(journal "print(' '.join(d['verdict'] for d in lignes))")
motif=$(journal "print(' ; '.join(lignes[-1]['raisons']) if lignes else '')")

echo "attendu : $attendu"
echo "obtenu  : $obtenu"

if [ "$obtenu" != "$attendu" ]; then
    echo
    echo "ÉCHEC — l'anti-doublon doit être vérifié AVANT la limite de fréquence."
    journal "
for d in lignes:
    print(f\"  {d['verdict']:8} {' ; '.join(d['raisons']) or 'rien à signaler'}\")"
    exit 1
fi

case "$motif" in
    *"limite de fréquence"*) ;;
    *)
        echo
        echo "ÉCHEC — le dernier message devait être écarté par le quota horaire,"
        echo "        il l'a été pour : ${motif:-aucune raison}"
        exit 1
        ;;
esac

echo
echo "Les deux vrais messages passent : l'ordre des couches est correct."
echo "Le quatrième message distinct est bien écarté par le quota horaire."
