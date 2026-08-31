# Anti-spam du formulaire de contact

## Ce qui bloque quoi

Deux sources de spam très différentes arrivent sur `contact@wearebrothers.ch` :

| Source | Exemple | Ce qui la traite |
|---|---|---|
| **Le formulaire du site** | « Nouveau message de Larrynes — wearebrothers.ch », `$25,000 promo code https://cut.gl/…` | Le code de ce dépôt (ci-dessous) |
| **Un email envoyé directement à la boîte** | Callaway Golf, Anastasia Panova | Les filtres de la boîte Infomaniak (voir plus bas) — le formulaire n'y peut rien |

On reconnaît un message venu du formulaire à son objet : « Nouveau message de … — wearebrothers.ch ».

## Les cinq couches côté site

Tout se joue dans `spam-filter.php`, appelé par `send-message.php`.
Un message écarté n'est **jamais** envoyé, mais le robot reçoit la même
réponse qu'un vrai visiteur : il ne peut pas deviner ce qui l'a fait échouer.

1. **Deux champs pièges** (`_honey`, `website`) invisibles à l'écran. Un
   robot qui remplit tout le formulaire se trahit immédiatement.
2. **Jeton de page** (`_ts`) : `contact-form.js` l'écrit à l'ouverture de
   la page, signé par une somme de contrôle que `spam-filter.php`
   recalcule. Un robot qui poste directement sur `send-message.php`
   sans exécuter le JavaScript ne peut pas le fournir. Le jeton donne
   aussi le temps de remplissage : moins de 3 secondes = robot.
3. **Score de contenu** — liens (surtout les raccourcisseurs type
   `cut.gl`, `bit.ly`), extensions à risque (`.xyz`, `.top`…), formules
   de spam (« promo code », « backlinks », « casino »…), alphabets sans
   rapport avec notre clientèle, lien dans le champ nom ou budget,
   envoi depuis un autre domaine. À partir de **7 points**, le message
   est écarté.
4. **Limite de fréquence** : 3 envois par heure et 10 par 24 h depuis la
   même adresse IP.
5. **Anti-doublon** : le même message renvoyé dans les 24 h est ignoré.

### Réglages

En haut de `spam-filter.php` :

- `SPAM_BLOCK_SCORE` (7) — plus bas = plus sévère, plus haut = plus permissif ;
- `SPAM_MIN_SECONDS`, `SPAM_MAX_PER_HOUR`, `SPAM_MAX_PER_DAY` ;
- `SPAM_SHORTENERS`, `SPAM_BAD_TLDS`, `SPAM_KEYWORDS` — listes à compléter
  au fil des messages reçus.

Le score est volontairement construit pour que **les mots-clés seuls ne
suffisent jamais** à bloquer (6 points maximum) : il faut toujours un
second signal, un lien ou un envoi automatisé. Un vrai prospect qui
donne l'adresse de son site actuel obtient 3 points et passe.

### Tests

```bash
php tests/antispam.php      # barème et concordance du jeton PHP / JavaScript
tests/antispam-e2e.sh       # parcours complet, ordre des couches
```

Le second verrouille un défaut réel : tant que l'anti-doublon est
vérifié **avant** la limite de fréquence, un visiteur qui reclique sur
un envoi qui semble lent ne voit pas ses messages suivants écartés en
silence. Inverser les deux fait échouer le test.

À lancer après toute retouche du barème : un faux positif ne se voit
nulle part ailleurs, puisque l'expéditeur reçoit la même réponse dans
les deux cas.

### Vérifier les faux positifs

Chaque décision est consignée dans `.wab-data/spam.log` sur le serveur
(un objet JSON par ligne : date, verdict, score, raisons, IP, message
tronqué). Le dossier n'est pas accessible depuis le web et n'est pas
effacé par les déploiements. Les emails qui passent portent en pied de
message leur score et l'IP de l'expéditeur, ce qui aide à ajuster les
réglages.

## Option : Cloudflare Turnstile

Le code est prêt, il suffit d'activer. C'est la couche à ajouter si le
spam persiste malgré tout — gratuit, sans image à déchiffrer, et
conforme au RGPD (pas de traçage publicitaire).

1. Créer un site sur https://dash.cloudflare.com → Turnstile ; on obtient
   une **clé de site** (publique) et une **clé secrète**.
2. Ajouter la clé secrète dans les secrets GitHub du dépôt sous
   `TURNSTILE_SECRET`, puis l'écrire dans `mail-config.php` en ajoutant
   cette ligne à l'étape « Générer la configuration email » de
   `.github/workflows/deploy.yml` :

   ```bash
   echo "const TURNSTILE_SECRET = '${TURNSTILE_SECRET}';"
   ```

   (et `TURNSTILE_SECRET: ${{ secrets.TURNSTILE_SECRET }}` dans le bloc `env:`)
3. Dans `contact.html`, avant la fermeture du `<form>` :

   ```html
   <div class="cf-turnstile" data-sitekey="CLÉ_DE_SITE" data-theme="dark"></div>
   <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
   ```

Tant que `TURNSTILE_SECRET` n'est pas défini, la vérification est
simplement ignorée : rien à changer d'autre.

## Les emails envoyés directement à la boîte

Callaway Golf et Anastasia Panova n'ont jamais touché le formulaire :
ils ont écrit à `contact@wearebrothers.ch`, adresse publique sur le site.
Aucune modification du code ne les arrêtera. À faire côté Infomaniak
(Mail Service → la boîte → Filtres / Règles) :

- activer le filtre anti-spam d'Infomaniak au niveau **élevé** et
  s'assurer que les messages classés partent bien dans « Spam » ;
- marquer systématiquement ces messages comme indésirables plutôt que
  de les supprimer : le filtre apprend ;
- créer une règle qui déplace vers Spam les messages contenant
  « unsubscribe », « Google Ads partnership », « I'm reaching out » ou
  « List-Unsubscribe » dans les en-têtes ;
- ne jamais cliquer sur « Se désabonner » d'un expéditeur inconnu :
  cela confirme que l'adresse est lue.

Sur le site, l'adresse apparaît en clair dans `contact.html` et dans le
bouton « Copier » — c'est ce qui la rend récoltable par les robots
d'aspiration. Si le volume devient gênant, l'étape suivante serait de
retirer l'adresse en clair des pages et de ne laisser que le formulaire.
