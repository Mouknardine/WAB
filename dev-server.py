#!/usr/bin/env python3
"""
WAB. — Serveur de prévisualisation locale

Reproduit les réécritures du .htaccess (URLs propres sans .html) pour
que la navigation interne fonctionne en local exactement comme sur
l'hébergement Infomaniak. Aucune dépendance : Python 3 seul.

    python3 dev-server.py            → http://localhost:8000/
    python3 dev-server.py 3000       → autre port

Le fichier est exclu du déploiement (voir .github/workflows/deploy.yml).
"""
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

# Même table que le .htaccess : adresse propre → fichier réel.
ROUTES = {
    '/': 'index.html',
    '/realisations': 'work.html',
    '/studio': 'about.html',
    '/contact': 'contact.html',
    '/applications': 'applications.html',
    '/creation-site-internet-lausanne': 'creation-site-internet-lausanne.html',
}


class Handler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        clean, sep, query = path.partition('?')
        if clean != '/' and clean.endswith('/'):
            clean = clean.rstrip('/')
        target = ROUTES.get(clean)
        if target:
            path = '/' + target + sep + query
        return super().translate_path(path)

    def log_message(self, fmt, *args):
        sys.stderr.write('%s  %s\n' % (self.log_date_time_string(), fmt % args))


if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    print(f'WAB. en local : http://localhost:{port}/  (Ctrl+C pour arrêter)')
    ThreadingHTTPServer(('', port), Handler).serve_forever()
