# Prompt à donner à Claude Code sur un dépôt client

Copiez tout ce qui suit la ligne, tel quel, dans une session Claude Code
ouverte sur le dépôt du site client. Rien à modifier : l'agent retrouve
le domaine du site tout seul dans le dépôt.

L'implémentation de référence est dans le dépôt `Mouknardine/WAB` :
`spam-filter.php`, `send-message.php`, `contact-form.js`, `ANTISPAM.md`.
Le prompt est écrit pour être autonome, mais si la session a accès à WAB,
demandez-lui de s'en inspirer plutôt que de repartir de zéro.

---

Le formulaire de contact de ce site reçoit du spam automatisé, ou risque
d'en recevoir. Commence par retrouver le domaine du site dans le dépôt
(fichier `CNAME`, workflow de déploiement, balises `canonical`,
`sitemap.xml`) — tu en auras besoin plus bas — et dis-moi lequel tu as
retenu. Voici un message réel reçu sur un autre site que nous gérons,
qui servira d'échantillon de test :

    Nom     : Larrynes
    Email   : stefff.b@web.de
    Budget  : 114144
    Message : Get ready to win with a $25,000 promo code https://cut.gl/NoSNR

Le robot n'a jamais affiché la page : il a envoyé une requête POST
directement sur le script d'envoi. C'est pour ça qu'un simple champ piège
(honeypot) ne suffit pas — le piège est dans le HTML, que le robot ne
charge jamais.

## Étape 1 — Audit, avant toute modification

Explore le dépôt et **rapporte-moi** ce que tu trouves, sans encore rien
changer :

1. Y a-t-il un formulaire de contact ? Où poste-t-il (script PHP maison,
   Formspree, Netlify Forms, WordPress, autre) ?
2. **L'adresse destinataire est-elle en dur dans le code, ou vient-elle
   d'un champ du formulaire ?** Si elle vient du formulaire, c'est un
   relais ouvert : un robot peut envoyer du spam à des tiers depuis le
   domaine du client. C'est la priorité absolue, avant tout le reste.
3. Les champs réinjectés dans les en-têtes de l'email (expéditeur,
   Reply-To, objet) sont-ils nettoyés des retours à la ligne `\r` et
   `\n` ? Sinon, injection d'en-têtes possible.
4. Y a-t-il des identifiants SMTP, clés d'API ou mots de passe commités
   dans le dépôt ? Si oui, signale-le, ne les affiche pas en clair.
5. Quelles protections existent déjà (honeypot, captcha, limite
   d'envois) ?
6. Quelle version de PHP tourne sur l'hébergement, si c'est trouvable
   (workflow de déploiement, `.htaccess`, doc) ? Vise une compatibilité
   PHP 7.4 dans le doute.

Arrête-toi là et donne-moi ce rapport. Si le site n'utilise pas un script
PHP maison (Formspree, Netlify, WordPress…), **ne force pas** la solution
ci-dessous : dis-moi ce que tu as trouvé et propose l'équivalent adapté à
cette plateforme.

## Étape 2 — Les cinq couches à mettre en place

Une fois le rapport validé, implémente une défense en cinq couches, dans
un fichier séparé (`spam-filter.php`) inclus par le script d'envoi. Le
principe directeur : **ne jamais perdre un vrai message**. En cas de
doute, on laisse passer.

1. **Deux champs pièges** invisibles à l'écran, dont un nommé `website` —
   les robots remplissent systématiquement un champ portant ce nom. Le
   formulaire doit répondre « envoyé » sans rien envoyer si l'un est
   rempli.

2. **Un jeton de page.** Le JavaScript de la page écrit dans un champ
   caché, à l'ouverture, un horodatage suivi d'une somme de contrôle. Le
   PHP la recalcule à l'identique. Un robot qui poste directement sans
   exécuter le JavaScript ne peut pas le produire, et le serveur en
   déduit le temps de remplissage : moins de 3 secondes = robot.

   Les deux implémentations doivent donner exactement le même résultat.
   Hachage 31 sur 32 bits, rendu en base 36 :

   ```js
   // JavaScript
   const SALT = 'antispam-v1';
   const seconds = Math.floor(Date.now() / 1000);
   const source  = SALT + ':' + seconds;
   let hash = 0;
   for (let i = 0; i < source.length; i++) {
       hash = (hash * 31 + source.charCodeAt(i)) >>> 0;
   }
   champCache.value = seconds + '.' + hash.toString(36);
   ```

   ```php
   // PHP — doit produire la même chaîne
   $hash = 0;
   for ($i = 0; $i < strlen($source); $i++) {
       $hash = ($hash * 31 + ord($source[$i])) & 0xFFFFFFFF;
   }
   $attendu = base_convert((string) $hash, 10, 36);
   ```

   Vérifie l'équivalence par un test avant d'aller plus loin : un
   horodatage fixe doit donner la même chaîne côté Node et côté PHP.

3. **Un score de contenu.** Chaque signal ajoute des points ; au-delà
   d'un seuil, le message est écarté :

   - liens dans le message : 1 lien = 3 pts, 2 liens = 5 pts, 3+ =
     bloquant. Compte les **domaines distincts**, pas les URL brutes,
     sinon `https://cut.gl/x` et `cut.gl/x` comptent double. Ignore les
     adresses email et les liens vers le domaine du client lui-même ;
   - raccourcisseur d'URL (`cut.gl`, `bit.ly`, `tinyurl.com`, `t.co`,
     `cutt.ly`, `is.gd`, `rb.gy`…) ou extension à risque (`.xyz`,
     `.top`, `.icu`, `.club`, `.loan`, `.tk`…) : 5 pts ;
   - balise de lien BBCode ou HTML (`[url]`, `<a href`) : 5 pts ;
   - lien dans le champ nom ou dans un champ court : 5 pts ;
   - formules de spam (« promo code », « casino », « crypto »,
     « backlinks », « seo services », « you have won »…) : 3 pts par
     formule, **plafonnées à 6** ;
   - caractères cyrilliques ou asiatiques, si la clientèle du site est
     exclusivement francophone : 3 pts ;
   - jeton de page absent : 3 pts. Rempli en moins de 3 secondes : 4 pts ;
   - aucune provenance annoncée (`Origin` / `Referer` vides) : 2 pts ;
   - formulaire posté depuis un autre domaine : bloquant d'office ;
   - message de moins de 20 caractères : 2 pts.

   **Seuil de blocage : 7 points.** Le plafond de 6 sur les mots-clés est
   volontaire : les formules seules ne doivent jamais suffire à bloquer,
   il faut toujours un second signal. Un vrai prospect qui donne
   l'adresse de son site actuel obtient 3 points et passe.

4. **Une limite de fréquence** par adresse IP : 3 envois par heure, 10
   par 24 h. Stockage dans un fichier JSON, avec verrou.

5. **Un anti-doublon** : le même message renvoyé dans les 24 h est
   ignoré (empreinte sur email + message normalisé).

Prévois aussi, **sans l'activer**, un branchement Cloudflare Turnstile :
la vérification ne s'exécute que si une clé secrète est définie côté
serveur, et laisse passer si Cloudflare est injoignable.

## Contraintes impératives

- **Un message écarté reçoit exactement la même réponse qu'un message
  accepté.** Le robot ne doit pas pouvoir déduire ce qui l'a fait échouer,
  sinon il adapte son message.
- **Journalise toutes les décisions** (date, verdict, score, raisons, IP,
  message tronqué) dans un fichier hors du web, pour vérifier les faux
  positifs. Ajoute le score et l'IP en pied des emails qui passent.
- **Ne touche pas au design.** Aucun encadré, aucun captcha visible,
  aucun champ visible en plus. Vérifie que les champs cachés ajoutés ne
  cassent pas les sélecteurs CSS existants (attention aux sélecteurs de
  voisinage `+` et `~`).
- **Garde l'envoi sans JavaScript fonctionnel** s'il l'est aujourd'hui :
  l'absence de jeton pénalise le score, elle ne bloque pas à elle seule.
- **Si le stockage n'est pas inscriptible**, la limite de fréquence et
  l'anti-doublon se désactivent d'eux-mêmes plutôt que de bloquer les
  envois légitimes.
- **Interdis l'accès web** aux fichiers inclus et au dossier de travail
  (`.htaccess`), et vérifie que le déploiement ne l'efface pas à chaque
  mise en ligne — beaucoup d'actions FTP synchronisent en supprimant ce
  qui n'est pas dans le dépôt. Ajoute-le aux exclusions et au
  `.gitignore`.
- **Le domaine du site doit être une constante** en haut du fichier, pas
  écrit en dur dans les fonctions.
- Commentaires en français, dans le style du dépôt.

## Étape 3 — Vérification obligatoire avant de committer

Écris un script de test qui fait passer le filtre sur des cas réels et
**montre-moi le tableau des résultats**. Au minimum :

*Doivent être bloqués* : le message « Larrynes » ci-dessus, avec et sans
jeton de page ; du spam SEO / backlinks ; du spam avec un raccourcisseur
d'URL ; un formulaire posté depuis un autre domaine.

*Doivent passer* : une demande de devis classique en français ; un
prospect qui donne l'adresse de son site actuel (« notre site est
https://… , on aimerait une refonte ») ; un message court mais réel
(« Bonjour, on peut se voir cette semaine ? ») ; un message en anglais
d'un client étranger ; un envoi sans JavaScript contenant un lien.

Si un seul cas légitime est bloqué, ajuste le score et recommence : un
faux positif coûte un client, un faux négatif coûte une seconde de
suppression.

Teste ensuite le parcours complet de bout en bout (`php -S` + `curl`) :
message légitime, honeypot rempli, message identique renvoyé, dépassement
de la limite horaire. Vérifie enfin la syntaxe de tout ce que tu as
touché (`php -l`, `node --check`).

## Étape 4 — Livraison

Travaille sur une branche dédiée, committe avec un message qui explique
le pourquoi et pas seulement le quoi, et pousse. N'ouvre pas de pull
request sans me le demander.

Termine par un récapitulatif court :
- ce que l'audit a révélé, en particulier tout problème de sécurité
  trouvé à l'étape 1 ;
- les scores obtenus sur les cas de test ;
- ce qui reste à faire côté hébergeur ou côté client.
