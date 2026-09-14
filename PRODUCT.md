# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Dirigeants de PME et indépendants de l'arc lémanique (Lausanne, Morges, Nyon, Vevey, Genève) et de Suisse romande, qui cherchent un studio pour créer ou refondre leur site, ou pour développer un outil de gestion interne.

Ils arrivent le plus souvent sans culture technique, avec un site existant daté ou absent, ou avec des process métier qui vivent dans un tableur partagé. Leur travail sur le site : juger en quelques secondes si ce studio est sérieux, comprendre ce qu'il sait faire, et décider d'engager un premier échange sans risque.

Second public, plus rare mais réel : des clients créatifs (DJ, architecte, artisan joaillier) qui viennent chercher un objet visuel fort plutôt qu'un site standard.

## Product Purpose

Le site est l'outil commercial principal de WeAreBrothers Studio (WAB.), studio digital fondé à Lausanne par deux frères. Il présente le studio, son travail et ses services — création de sites sur-mesure, refonte, web design, branding, motion design, e-commerce, SEO, et développement d'applications de gestion sur mesure.

Succès = un visiteur qualifié qui envoie le formulaire de contact ou écrit à contact@wearebrothers.ch, avec suffisamment de confiance déjà installée pour que le premier échange porte sur le projet, pas sur la crédibilité du studio.

## Positioning

Deux frères, design et développement sous le même toit, en relation directe avec le client — sans intermédiaire, sans chef de projet, sans production à la chaîne. C'est la promesse qu'une agence classique ne peut pas copier sincèrement.

Second différenciateur, en montée : WAB ne s'arrête pas au site vitrine. Le studio développe aussi des applications de gestion sur mesure, dessinées à partir du métier réel de l'entreprise. Peu de studios de cette taille couvrent les deux.

Priorité commerciale actuelle : les sites web restent le cœur de l'activité ; les logiciels métier sont l'axe de croissance à faire monter progressivement. Le site doit servir les deux sans que la seconde offre écrase la première.

## Operating Context

- Zone d'intervention : arc lémanique et Suisse romande. Studio basé à **Lausanne** (jamais Genève).
- Contact direct par email et formulaire, réponse annoncée sous 24 h ouvrées, sans engagement.
- Déroulé d'un projet site : un café ou un appel, une proposition, puis design et développement avec points réguliers, puis maintenance et évolutions après la mise en ligne.
- Déroulé d'un projet logiciel : phase d'observation du métier, puis livraison module par module, chaque module utilisable en production dès qu'il est terminé, reprise des données existantes par import.
- Délai type d'un site vitrine : 3 à 6 semaines. Davantage pour du sur-mesure.
- Tarification au périmètre, définie après le premier échange, paiement en plusieurs mensualités possible. Aucun prix public n'est affiché.

## Capabilities and Constraints

**Pages en ligne** : Accueil (`/`), Réalisations (`/realisations`), About (`/studio`), plus deux pages atteintes par des liens internes et non par le menu — Création de site internet à Lausanne (`/creation-site-internet-lausanne`, page de service dédiée à la requête « création site internet Lausanne ») et Applications sur mesure (`/applications`, fiche détaillée du logiciel de gestion, ouverte depuis la page Réalisations). Les deux sont reliées depuis la ligne du bas des pages de texte — jamais depuis l'accueil, qui n'est pas un chemin vers elles. La page Création de site internet est une page d'atterrissage : elle existe pour les recherches Google, pas pour le parcours des visiteurs du site ; elle doit rester atteignable par un lien visible, sans quoi Google la traiterait comme une page satellite.

**Contrainte durable — About ne montre que l'équipe.** La page s'ouvre sur un seul grand titre de marque, « On fait les choses sérieusement sans se prendre au sérieux », puis les trois portraits en grand, chacun suivi de son rôle et de sa description — pas de liste d'outils ni de savoir-faire affichée (ils restent dans le JSON-LD). Aucune étiquette, aucun texte d'introduction, aucun manifeste, aucune liste de valeurs. La fin du titre principal (« studio digital fondé par deux frères à Lausanne ») reste dans le document pour les moteurs et la navigation vocale, sans être affichée. Aucune page n'affiche plus de petite étiquette au-dessus de son titre.

**Contrainte durable — les listes tiennent sur deux colonnes.** Questions fréquentes et listes de points se rangent deux par deux au-dessus de mille pixels, sur toute la largeur de l'écran. Les cellules d'un même rang gardent la même hauteur, pour que leurs filets de séparation restent alignés quand une réponse se déplie. Sur les pages Applications et Création de site, le titre de bande occupe une colonne à gauche et reste en place pendant le défilement.

**Contrainte durable — la page Création de site internet est une page d'atterrissage complète.** Elle s'ouvre sur le plus grand titre des pages de texte (« Création de site internet à Lausanne », sur trois lignes), une phrase, deux boutons (démarrer un projet, voir des exemples) et trois faits en capitales séparés par des filets : site vitrine en 3 à 6 semaines, hébergement suisse inclus, réponse sous 24 h ouvrées — la seule promesse chiffrée de la page, dite une fois. Puis, dans cet ordre : la preuve avant l'explication — quatre captures pleine largeur, hors de la colonne de lecture, comme sur Réalisations ; ce que comprend un site (six points, deux colonnes) ; les quatre formats (site vitrine, site d'entreprise, portfolio créatif, boutique en ligne, deux par deux) ; le déroulé en quatre étapes sur une seule ligne au-dessus de mille pixels, avec un grand chiffre par étape — la seule numérotation du site ; le studio en prose (les deux frères, le café à Lausanne, les communes de l'arc lémanique, deux liens vers About et Réalisations, un vers Applications) ; la passerelle noire vers la refonte ; douze questions dépliantes dont les réponses sont reprises mot pour mot dans le bloc FAQPage ; la conclusion. Environ 1 700 mots : c'est la page la plus longue du site, et c'est voulu. Les captures y sont servies en deux tailles (720 et 1200 px) pour le téléphone.

**Contrainte durable — trois nœuds de navigation.** Le menu ne porte que Work (page `/realisations`), About et Contact, en haut à droite, avec le sigle WAB. en haut à gauche. Toute nouvelle page se rattache à l'un de ces trois nœuds plutôt que d'en ouvrir un quatrième. La barre est collée en haut de l'écran et court d'un bord à l'autre, fermée par un filet d'un pixel. Le pied de page lui répond : une seule ligne tout en bas, même marge et même filet, avec l'adresse email à gauche et à droite les deux pages que le menu ne porte pas — création de site internet et applications — puis le lieu et l'heure. Ces deux liens sont le seul chemin vers ces pages depuis une page de texte : ils ne peuvent pas disparaître. Le sigle va chercher le bord gauche, les liens le bord droit : la barre encadre la page au lieu d'en occuper une colonne, et la grille des réalisations prend la même marge, si bien que le bord des captures tombe exactement sous le sigle. En petit écran, un bouton de quatre carrés ouvre un panneau qui se déroule juste en dessous — il pivote d'un quart de tour pour signaler l'ouverture.

**Contrainte durable — l'accueil ne défile pas.** La page d'accueil tient en un écran, sur téléphone comme sur ordinateur : la barre de navigation, une plaque de verre en bas à gauche portant une phrase rose et un court paragraphe noir, une ligne de bas de page pleine largeur avec l'email et l'heure locale — sans lien vers les deux pages de service, par choix : l'accueil n'est pas le chemin vers elles, et Google les atteint par le pied des pages de texte. Derrière, un ciel dense d'oiseaux en pixel art traverse l'écran en continu. Les trois plaques sont en `position: fixed`, ce qui les exclut du relevé de zones des oiseaux : ceux-ci passent derrière le verre, floutés, au lieu de s'effacer. Rien d'autre n'entre sur cette page — le contenu commercial vit sur les autres.

**Stack du site** : HTML / CSS / JavaScript statiques, écrits à la main, sans framework ni étape de build. Un socle commun (`base.css`, `nav.css`, `page.css`, `footer.css`) plus une feuille par page ou par famille de pages (`landing.css` pour l'accueil, `work.css`, `sections.css`, `studio.css`, `apps.css`), et `contact-modal.css` et `contact-form.css` chargées partout avec la fenêtre de contact (`js/contact/`). Les oiseaux vivent dans `js/birds/` : densité déclarée par page via `data-birds="dense"` sur le `body`, dense sur l'accueil et plus discrète ailleurs. Devant une ligne de texte posée à même le fond, l'oiseau ne disparaît pas — il se voile à trois dixièmes de son opacité, le temps de la franchir. Le ciel n'est jamais vide.

**Contrainte durable — une seule langue visuelle.** Un fond en dégradé pâle sur tout le site, posé par une couche fixe sous les oiseaux. Sa teinte va et vient entre le rose et le bleu, aller-retour en vingt-quatre secondes, sans jamais passer par le vert ni le jaune : cent degrés de rotation, pas davantage. Seule la teinte bouge — la pente et la clarté du dégradé restent fixes, et l'encre reste conforme AA aux deux extrémités. Aucune carte, aucune ombre portée dans le contenu : les blocs sont séparés par des filets d'un pixel. La barre du haut et la ligne du bas de l'accueil sont pleine largeur et posées à plat sur du verre translucide ; la plaque de l'accueil et la fenêtre de contact sont les seuls objets qui flottent encore, et ce sont les seules exceptions assumées. Tout part du même bord gauche : la gouttière de l'écran. Le sigle de la barre, le texte des pages, les captures des réalisations et les portraits tombent sur cette verticale. Seule la longueur des lignes est bornée, à 940 px — la colonne n'est jamais centrée. Les seuls aplats sont le noir des boutons pleins et du bloc qui renvoie vers les applications métier.

**Contrainte durable — la page Réalisations est une grille de captures.** Elle n'a ni en-tête affiché ni réglage : elle s'ouvre directement sur les images, toutes montrées ensemble, sites et application mêlés. Son titre principal existe toujours dans le document, réservé aux lecteurs d'écran et aux moteurs. Les projets occupent de grandes captures posées presque bord à bord, sur deux colonnes, hors de la colonne de 940 px. Au survol, une plaque de couleur monte dans l'angle de l'image : le nom du projet et les disciplines en capitales. Chaque projet a la sienne, prise dans la même gamme que le fond — neuf pas du rose au bleu, dans l'ordre de la grille. La clarté est ajustée teinte par teinte pour que la luminance reste constante : le noir posé dessus garde le même contraste sur les neuf, y compris sur les violets qui s'assombrissent naturellement. En dessous de 760 px, et partout où le survol n'existe pas, la plaque devient un bandeau plein sous la capture, avec le nom d'un côté et une flèche dans un galet noir de l'autre — les disciplines y sont retirées faute de place. La mise en page change de forme, jamais de contenu utile. Une tuile fait exception : celle de l'application de gestion, qui ne mène pas à un site mais à la page Applications. Une pastille blanche « Découvrir le projet → » est posée en permanence sur sa capture, et sa flèche pointe vers la droite là où celles des sites partent en diagonale : rester sur le site et le quitter ne se dessinent pas pareil. Déploiement par GitHub Actions vers Infomaniak en FTPS à chaque push sur `main`.

**Contrainte durable — 100 % statique.** Tout travail futur doit tenir en fichiers plats servis par FTP. Pas de framework, pas de bundler, pas d'étape de build. Les liens internes visent les adresses propres (`/realisations`, `/studio`, `/applications`), identiques aux canoniques : en local, `python3 dev-server.py` reproduit les réécritures du `.htaccess` (le script n'est pas déployé).

**Contrainte durable — le site est la démonstration.** Le site est lui-même la première preuve commerciale du niveau de craft vendu aux clients. Un défaut visible sur le site coûte plus qu'ailleurs.

**Contrainte durable — SEO local prioritaire.** Le référencement Lausanne / arc lémanique passe avant les autres arbitrages : JSON-LD complet sur chaque page (Organization, Person, WebPage, FAQPage, BreadcrumbList), `sitemap.xml` avec images légendées, `llms.txt`, `robots.txt`, ping IndexNow (`indexnow.sh`, et le workflow `submit-urls.yml` lançable à la demande depuis l'onglet Actions, qui appelle aussi l'API Bing Webmaster si le secret `BING_WEBMASTER_API_KEY` existe). À maintenir à jour à chaque ajout de page ou d'image. Requêtes cibles : « agence web Lausanne » et « site internet Lausanne » — les deux expressions doivent rester présentes dans le titre, la description et le H1 de l'accueil. Les dix questions fréquentes vivent toutes sur `/creation-site-internet-lausanne` ; les réponses affichées et celles du bloc FAQPage y sont identiques mot pour mot. C'est aussi cette page qui porte l'essentiel du texte de référencement du site.

**Langue** : français (`fr-CH`) uniquement aujourd'hui. Une version anglaise est envisagée : les nouvelles pages doivent être structurées pour l'accueillir sans refonte (pas de texte codé en dur dans des chemins, structure de contenu séparable).

**Contrainte durable — pas de page Contact.** Le lien « Contact » (menu, boutons d'appel) ouvre une fenêtre par-dessus la page en cours : carte blanche centrée, page floutée derrière, bouton « Fermer » au-dessus du titre. Quatre champs seulement — nom, email, entreprise (facultatif), message — puis un bouton noir pleine largeur. C'est la seule carte ombrée du site, exception assumée : elle flotte réellement au-dessus de la page. Les liens sont des `mailto:` marqués `data-contact` : sans JavaScript, ils ouvrent la messagerie. L'ancienne adresse `/contact` redirige en 301 vers `/#ecrire`, qui ouvre la fenêtre à l'arrivée.

**Formulaire de contact** : dans la fenêtre, même grammaire que le reste — une clé en petites capitales (à l'encre sur le blanc), puis une ligne à remplir fermée par un filet. Techniquement : `send-message.php` + `smtp-mailer.php`, SMTP authentifié Infomaniak (la fonction PHP `mail()` est désactivée chez l'hébergeur). Identifiants injectés au déploiement depuis les secrets GitHub, en base64, dans un `mail-config.php` qui n'existe jamais dans le dépôt. Implémentation actuelle, non figée comme engagement produit.

**Typographie française** : jamais de `?` ou `!` isolé en début de ligne — espace insécable systématique, à vérifier jusqu'à 320 px de large.

**Non décidé** : rien n'est arrêté sur une éventuelle page tarifs ou un blog. Une seule page de service existe (création de site internet) ; les autres prestations restent sur l'accueil.

## Brand Commitments

- Nom : **WeAreBrothers Studio**, affiché **WAB.** dans l'interface. Variantes reconnues : WeAreBrothers, WAB Studio.
- Slogan : « Des expériences qui restent dans la mémoire ».
- Équipe nommée publiquement : **Eliott Pina** (lead designer / direction artistique — Figma, Motion Design, Branding, GSAP, Three.js, After Effects), **Matt Pina** (lead développeur full-stack — Next.js, TypeScript, Node.js, Supabase, PostgreSQL, GSAP), **Ivan Jakovlevski** (commercial et relation client, également en R&D chez VEG Consulting, fiduciaire à Lausanne).
- Quatre valeurs de référence, dans cet ordre : Proximité, Craft, Performance, Transparence. Elles ne sont plus affichées sur le site depuis que la page About se limite aux portraits ; elles restent la grille de lecture interne des arbitrages.
- Voix : française, directe, concrète, sans jargon. Tutoiement jamais employé ; le client est vouvoyé. Les formules commerciales creuses sont évitées au profit d'affirmations vérifiables.
- Email public unique : contact@wearebrothers.ch. Domaine : wearebrothers.ch.

## Evidence on Hand

**Réalisations réelles, en ligne, présentées avec captures** (`assets/images/project-*.png`) :

- Zinéma — cinéma d'art et essai, rue du Maupas à Lausanne — https://www.zinema.ch/
- Le P'tit Central — café-restaurant de quartier, rue Centrale à Lausanne — https://le-p-tit-central.vercel.app/
- Amarte Studio — centre de yoga et de Pilates à Épalinges (Lausanne) — https://amarte.ch/
- La Slack — portfolio créatif en bureau virtuel — https://la-slack.com/
- Nadège Mouine — site personnel, architecte en formation à l'EPFL — https://nadegemouine.ch
- Commissione Entretien — entreprise familiale d'entretien à Bavois (VD) — https://commissione-entretien.ch/
- LAZIZZE DJ — portfolio immersif, DJ house lausannois — https://lazizze.com/
- Maison Alliani — vitrine haute joaillerie, grillz sur mesure — https://maison-alliani.com/
- Géotechnologie — bureau d'études géotechniques à Morzine

**Application de gestion réelle**, conçue et développée pour une agence : projets, tâches, temps passé, clients, documents, facturation. Trois écrans documentés sur `/applications`, page ouverte depuis la carte de la grille des réalisations, (`app-agenda-aujourdhui`, `app-agenda-taches`, `app-agenda-finances`), **avec données de démonstration** — la mention doit rester visible.

**Absences à ne jamais combler par invention** : aucun témoignage client, aucun logo de client, aucun chiffre d'affaires, aucun nombre de projets livrés, aucun prix, aucune certification, aucune récompense. Le nom de l'agence cliente de l'application n'est pas public. Si un futur travail a besoin de preuve sociale, elle doit être demandée, pas fabriquée.

## Product Principles

1. **La preuve avant la promesse.** Le studio n'a ni témoignages ni chiffres : sa crédibilité vient du travail montré et de la qualité du site lui-même. Toute page doit démontrer plus qu'elle n'affirme.
2. **La relation directe est le produit.** Deux frères joignables, sans intermédiaire, réponse sous 24 h. Tout ce qui met de la distance entre le visiteur et les fondateurs travaille contre l'offre.
3. **Rien qui ne serve un client réel.** Vaut pour les fonctionnalités d'un logiciel comme pour les sections d'une page : ce qui n'a pas d'usage identifié n'entre pas.
4. **Local d'abord.** Lausanne et l'arc lémanique sont le marché ; la visibilité locale conditionne l'arrivée des clients avant toute autre considération.
5. **Deux offres, une seule maison.** Sites et logiciels métier doivent cohabiter sans se diluer : un visiteur venu pour un site ne doit jamais se sentir sur le mauvais site, et inversement.

## Accessibility & Inclusion

Aucun standard formel n'a été établi comme obligation contractuelle. Contrainte d'usage confirmée pour les applications métier : consultation depuis le téléphone, debout, entre deux rendez-vous — interface dessinée pour le petit écran d'abord.
