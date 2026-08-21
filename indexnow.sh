#!/bin/sh
# ── IndexNow — signale les pages à Bing / Yandex (et donc à Edge) ──
# Bing met parfois des mois à explorer un domaine récent ; cet appel place
# les URLs directement dans sa file d'attente. À relancer après chaque
# mise en ligne. Un seul ping suffit : les moteurs partenaires se le partagent.
#
#   sh indexnow.sh                      → soumet les 4 pages du site
#   sh indexnow.sh /realisations        → soumet uniquement cette page
#
# La clé est publiée en clair sur https://wearebrothers.ch/0515e9f961a495712d522e48173e1a6f.txt :
# c'est le mécanisme de vérification prévu par le protocole, pas un secret.

set -e
HOST="wearebrothers.ch"
KEY="0515e9f961a495712d522e48173e1a6f"

if [ "$#" -gt 0 ]; then
    SET=$*
else
    SET="/ /realisations /studio /contact"
fi

LIST=$(for p in $SET; do printf '"https://%s%s",' "$HOST" "$p"; done | sed 's/,$//')

printf 'Soumission à IndexNow : %s\n' "$SET"
curl -sS -X POST "https://api.indexnow.org/indexnow" \
     -H "Content-Type: application/json; charset=utf-8" \
     -w '\nRéponse HTTP : %{http_code}\n' \
     -d "{\"host\":\"$HOST\",\"key\":\"$KEY\",\"keyLocation\":\"https://$HOST/$KEY.txt\",\"urlList\":[$LIST]}"

echo "  200 = accepté · 202 = accepté, clé en cours de validation · 403 = clé introuvable à la racine"
