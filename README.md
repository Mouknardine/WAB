# WAB. — site de WeAreBrothers Studio

Le site de [wearebrothers.ch](https://wearebrothers.ch), studio de design et de développement à Lausanne. HTML, CSS et JavaScript statiques écrits à la main : **aucun framework, aucune dépendance, aucune étape de build.** Un seul fichier PHP envoie le formulaire de contact.

## Lancer le site en local

```sh
python3 dev-server.py          # http://localhost:8000/
python3 dev-server.py 3000     # sur un autre port
```

`dev-server.py` reproduit les réécritures du `.htaccess` (adresses propres comme `/realisations`) ; un simple serveur de fichiers casserait les liens internes. Python 3 suffit.

Le PHP ne tourne pas en local : le formulaire de contact ne peut être testé qu'en ligne.

## Mettre en ligne

Un `git push` sur `main` déclenche `.github/workflows/deploy.yml` (GitHub Actions) :

1. génère `mail-config.php` à partir des secrets `SMTP_USER` / `SMTP_PASSWORD` ;
2. envoie le site en FTPS chez Infomaniak (`/sites/wearebrothers.ch/`, secrets `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`) ;
3. signale les pages à IndexNow (Bing, Yandex…).

Suivre le déploiement : `gh run watch`. Si un mot de passe FTP ou email change chez Infomaniak, le reporter dans les secrets GitHub, sinon le déploiement échoue (`530 Login incorrect`) et le site reste figé.

Ne sont **pas** envoyés sur le serveur : `.git*`, `.github/`, `.claude/`, `.impeccable/`, les documents `.md` listés dans `deploy.yml`, `indexnow.sh`, `dev-server.py`. **Tout nouveau fichier de travail à la racine est mis en ligne** s'il n'est pas ajouté à cette liste.

Le dépôt est partagé (Matt pousse aussi sur `main`) : `git fetch` et fusionner avant de pousser.

Après une modification d'un CSS ou d'un JS, **relever son numéro `?v=`** partout où il est appelé — procédure dans `OS-COMPONENTS.md`, section 12.

## Structure

| Emplacement | Contenu |
|---|---|
| `index.html`, `work.html`, `services.html`, `about.html`, `creation-site-internet-lausanne.html`, `applications.html`, `404.html` | les sept pages ; adresses publiques `/`, `/realisations`, `/services`, `/studio`, `/creation-site-internet-lausanne`, `/applications` |
| `.htaccess` | HTTPS sans www, adresses propres, redirections des anciennes adresses, page 404, cache (CSS un mois, JS revalidé), en-têtes de sécurité |
| `css/os-*.css`, `key-btn.css`, `sym.css`, `base*.css`, `nav-panel.css`, `contact-*.css`, `desk-keys.css`, `desk-margins.css` | le socle partagé (jetons, six teintes, barre, fenêtres, dock, pied de page, touches) |
| `css/desk-*.css`, `css/home-*.css` | l'accueil |
| `css/page-<page>-*.css` | une page (`work`, `services`, `about`, `seo` = Création de site, `apps`, `404`) |
| `js/os/` | le système partagé : lumière de l'heure, ⌘K, terminal, clic droit, fenêtres à la demande, dock-sommaire, bruit des touches |
| `js/desk/` | l'accueil (nom brouillé, pixels du premier écran) et les motifs de pixels des marges (toutes les pages) |
| `js/page-<page>/` | le module propre à une page |
| `js/contact/` | la fenêtre de contact et l'oiseau qui emporte le message |
| `js/birds/` | le dessin de cet oiseau (seul reste des anciens oiseaux) |
| `js/nav.js`, `js/reveal.js`, `nav-clock.js` | menu du téléphone, apparitions au défilement, heure de Lausanne |
| `send-message.php`, `smtp-mailer.php` | envoi du formulaire par SMTP Infomaniak (`mail-config.php` n'existe qu'en ligne) |
| `assets/fonts/` | Instrument Sans et Sligoil (licences OFL jointes) |
| `assets/images/` | captures des projets (`shot-*`), portraits (`team-*`), écrans de l'application (`app-agenda-*`) |
| `assets/icons/` | symboles au trait (`sym-*`) et icônes d'app (`app-*`) |
| `assets/og-image.jpg`, `favicon.*`, `apple-touch-icon.png`, `site.webmanifest` | image de partage et icônes (la touche rose « B ») |
| `sitemap.xml`, `robots.txt`, `llms.txt`, `0515e9f9….txt` | référencement ; le `.txt` est la clé IndexNow, à laisser en ligne |
| `indexnow.sh`, `.github/workflows/submit-urls.yml` | signaler les pages aux moteurs à la demande |

## Documentation

| Document | Quand le lire |
|---|---|
| `DESIGN-SYSTEM.md` | l'aspect : couleurs et six teintes, typographie, matières, règles du propriétaire, directions déjà rejetées |
| `OS-COMPONENTS.md` | construire ou modifier une page : balisage des composants, chargement, numéros de version |
| `PRODUCT.md` | le fond : public, offres et prix, équipe, ton, ce qu'il ne faut jamais inventer |
| `DIRECTION-ARTISTIQUE.md`, `FINITION-PRO.md` | historiques (voir l'encadré en tête de chacun) |

Règles du propriétaire, en bref : français ; studio à **Lausanne** ; ton de grande agence ; rien de penché ; sobriété ; aucun contenu inventé ; `&nbsp;` avant `? ! : ;` ; mobile d'abord ; fichiers de moins de 200 lignes ; zéro `console.log`.
