> **Historique — ne décrit plus le site actuel, voir `DESIGN-SYSTEM.md`.** Proposition du 06.10.2026 (« bureau rangé », d'après eazyclick). Sa **structure d'accueil a été réalisée** et reste en ligne : cartes WAB à tuile, bulles, promesse et puces (Services) ; méthode en quatre étapes ; « Fait à Lausanne. » ; offres à prix affichés ; lettre du studio ; FAQ ; appel final. Le reste est dépassé depuis le 08.10.2026 :
> - la palette « un seul accent Klein » (§ 7, § 12.12) est remplacée par **six teintes** (`css/os-tints.css`) ;
> - l'ouverture (§ 5.1) est le nom « WeAreBrothers. » en touches, sans H1 visible en phrase, sans pastilles ni fenêtre Zinéma défilante ; la bande de preuves (§ 5.2) n'a pas été faite ;
> - le pied de page (§ 5.10) est une bande compacte blanche, sans défilant ni « WAB. » géant ; le dock est le sommaire de la page ;
> - plus aucun oiseau, y compris l'oiseau-logo (§ 11) ; seul reste celui qui emporte un message envoyé ;
> - les conflits listés au § 14 ont été résolus dans `PRODUCT.md` et `OS-COMPONENTS.md`.
>
> Les interdits du § 12 restent valables, sauf le n° 12 (un seul accent) et les « tuiles multicolores » du n° 5 : chaque carte prend désormais une des six teintes. L'autocollant « HELLO my name is », toujours droit, reste sur Work, Services et Applications.

# Direction artistique — « Le bureau rangé »

Version 1 — 6 octobre 2026. Document de travail, non déployé.
Source : étude de eazyclick.be/fr (captures écran par écran après l'écran de chargement, styles mesurés dans le navigateur, textes relevés mot pour mot) et du site actuel sur localhost:8765 (accueil en 1440 px et 390 px, Services, About, Work).

S'articule avec : `OS-COMPONENTS.md` (direction Klein du 03.10, qui reste la référence des composants), `PRODUCT.md` (public, positionnement), `DESIGN-SYSTEM.md` (historique des refus d'Eliott). Conflits signalés en fin de document.

---

## 0. Hypothèse sur la demande d'Eliott

Le site actuel **montre** le savoir-faire (fenêtres, touches, écrans bleus, oiseaux) mais **n'explique** pas assez ce que le client y gagne. Eazyclick fait l'inverse : chaque service est raconté en termes d'entreprise (« ce que ça change pour vous »), dans une carte pleine, au prix affiché. Eliott ne veut pas changer d'identité : il veut que le bureau WAB OS soit **rangé**, et que chaque objet posé dessus serve à convaincre.

Règle qui en découle : **tout élément visuel doit porter une information** (un projet réel, une interface réelle, un prix, un délai, une réponse). Ce qui est là « pour faire WAB » sans rien dire est retiré ou fondu dans un élément utile.

---

## 1. Concept

**Nom : Le bureau rangé.**
**Mots-clés : clair, solide, habité.**

On garde l'univers WAB OS — bleu Klein, Instrument Sans, fenêtres à barre de titre, touches de clavier, bulles de dialogue — mais on le range : grilles régulières, cartes de même hauteur, une seule chose animée à la fois. Le ton change plus que l'image : chaque section commence par ce que le client gagne, explique concrètement comment, et finit par un chiffre ou un prix. La personnalité vient des bulles de dialogue (la voix du client et la réponse du studio) et des aperçus d'interfaces réelles, plus des décors.

---

## 2. Leur façon d'écrire (eazyclick) et sa traduction WAB

### 2.1 La mécanique, partout la même

Chaque bloc de service suit exactement cette séquence :

1. **Titre-nom** court, en clair (« Site web de A à Z », « Visibilité sur Google & IA »).
2. **Phrase-promesse** en une ou deux lignes, imagée ou piquante, tournée vers le client (« Un beau site invisible, c'est un panneau publicitaire au fond d'une forêt. »). C'est la phrase qu'on retient.
3. **Paragraphe concret** de 3 à 4 lignes : comment ils s'y prennent, avec un fait vérifiable (« depuis 2012 », « on teste, on mesure, on ajuste »).
4. **Trois puces de bénéfices**, chacune une ligne, avec une icône au trait et un filet entre elles.
5. **Une phrase de chute**, courte, en gris (« Des pros du site web pour des pros d'autres choses. »).
6. **Un bouton** pleine largeur en bas de carte.

Ailleurs, les mêmes réflexes :
- **Les titres de section en deux temps** : une affirmation, puis sa raison (« Ce qu'on fait. Et pourquoi ça compte pour votre business. » ; « Nos clients vendent mieux. Les chiffres le prouvent. » ; « Des offres claires. Sans surprise. »).
- **Les prix affichés sur l'accueil**, avec un nom de pack et surtout un **objectif** (« Être visible », « Générer des opportunités », « Scaler intelligemment ») et une accroche (« Lancez-vous. Sérieusement. »).
- **La FAQ qui attaque l'objection** au lieu de l'esquiver : « La plupart des agences vous répondent « ça dépend » et referment la porte sur un devis flou, trois semaines plus tard. Chez Eazyclick, […] on les affiche directement sur notre site, dès la page d'accueil. » Réponses courtes, chiffrées (« Comptez 14 jours avec KickStarter, environ 1 mois avec GlowUp… »), qui commencent souvent par « Non. » ou « Oui. ».
- **Les preuves en chiffres** (« +4.2x — Croissance du chiffre d'affaires ») et les cas clients annoncés comme « le problème, la réponse, et l'impact réel ».
- **L'appel final qui dit ce qui se passe ensuite** : durée, contenu de l'appel, délai de réponse.

### 2.2 Ce qu'on prend, ce qu'on laisse

On prend la **mécanique** (bénéfice → explication → preuve → prix). On laisse le **registre familier** : « zéro bullshit », « c'est has been », « ton business », le mélange tu/vous. WAB vouvoie déjà partout (« Présentez-nous votre projet », « vous appartiennent ») : on garde le vouvoiement et un ton « grande agence de design », posé, précis, jamais racoleur.

Attention à ne pas reprendre leurs images : « panneau au fond d'une forêt », « budget imaginaire », « Lancez-vous. Sérieusement. » sont leurs signatures. Les réécritures ci-dessous gardent le principe, pas la formule.

### 2.3 Exemples : leur formulation → notre réécriture

| # | Eazyclick | Proposition WAB |
|---|---|---|
| 1 | **Hero** : « Un site qui attire vos clients et un outil pour les gérer » | « Des sites qui font venir vos clients. Des outils qui vous font gagner du temps. » — sous-titre : « Studio de design et de technologie à Lausanne. Votre site, votre marque et vos outils de gestion, conçus sous le même toit. » |
| 2 | **Titre de section** : « Ce qu'on fait. Et pourquoi ça compte pour votre business. » | « Ce que nous faisons. Et ce que cela change pour votre entreprise. » |
| 3 | **Phrase-promesse** : « Un beau site invisible, c'est un panneau publicitaire au fond d'une forêt. » / « Jongler entre dix outils, c'est has been. » | Sites : « Votre site est souvent le premier rendez-vous. Il doit convaincre avant même qu'on vous appelle. » — Applications : « Un tableur partagé n'est pas un outil de gestion. C'est un risque. » — Automatisation : « Chaque devis recopié à la main est une heure qui n'est pas facturée. » |
| 4 | **Chute** : « Des pros du site web pour des pros d'autres choses. » | « Votre métier, c'est le vôtre. Le site, c'est le nôtre. » |
| 5 | **Prix** : « Des offres claires. Sans surprise. Choisissez le pack qui correspond à vos objectifs. Pas à votre budget imaginaire. » | « Des prix affichés. Avant même le premier échange. » — sous-titre : « Trois niveaux d'accompagnement, chacun avec son périmètre, son délai et sa fourchette. Vous savez où vous allez avant de nous écrire. » |
| 6 | **FAQ prix** : « La plupart des agences vous répondent « ça dépend »… » | « Combien coûte un site internet chez WAB ? — Beaucoup d'agences répondent « cela dépend », puis envoient un devis trois semaines plus tard. Nous affichons nos fourchettes sur cette page : de 1'000 à 2'500 CHF pour un site vitrine, de 2'500 à 7'000 CHF avec outil de gestion ou boutique, dès 7'000 CHF pour une expérience sur mesure avec refonte de marque. Après un premier échange, vous recevez une proposition écrite sous 24 h ouvrées. Le paiement peut être échelonné. » |
| 7 | **Appel final** : « Réservez un appel avec un expert — 30 minutes, zéro bullshit. On audite votre présence, on identifie l'option la plus stratégique, et on vous dit exactement quoi faire ensuite. Réponse en moins de 24h. » | « Parlons de votre projet. » — « Un premier échange de 30 minutes, sans engagement. Nous regardons votre site actuel et vos objectifs, puis nous vous disons concrètement par où commencer. Proposition écrite sous 24 h ouvrées. » (durée de 30 minutes **à confirmer par Eliott**) |

---

## 3. Leurs cartes : anatomie exacte

Mesures relevées dans le navigateur (cartes « Ce qu'on fait » et packs de prix, 1440 px).

**Structure : une carte blanche qui contient une tuile colorée.**

| Élément | Valeur eazyclick |
|---|---|
| Carte | fond `#FFFFFF`, liseré 1 px `#E5E5E5`, rayon 12 px, **aucune ombre** |
| Marge entre carte et tuile | 5 px (la tuile est « posée » dans la carte) |
| Tuile d'aperçu | hauteur fixe ~180 px, rayon 6 px, aplat de couleur, padding 25 px |
| Dans la tuile | étiquette en capitales 11 px (« WEB », « SEO ») en haut à gauche ; titre 20 px en bas à gauche ; à droite une **mini-interface réaliste** qui déborde du bord (fenêtre de navigateur, tableau de factures, fiche avis Google, checklist + « +32 % ») |
| Corps | padding ~30 px |
| Phrase-promesse | 16 px, encre noire, graisse 400, 2 lignes |
| Paragraphe | 13–14 px, gris `#555555`, interligne 1,55 |
| Puces | 3 lignes, icône au trait 18 px + texte 14 px noir, séparées par un filet 1 px `#E5E5E5`, ~60 px de haut chacune |
| Chute | 13–14 px gris, une phrase |
| Bouton | pilule pleine largeur, gris clair `#F2F2F2` (noir pour la carte mise en avant), flèche dans un rond noir à droite |
| Grille | 3 colonnes égales, gouttière ~10 px, hauteurs égales, boutons alignés en bas |
| Titres de site | PolySans graisse 400 (jamais de gras), interlettrage serré −3 % |

**Pourquoi elles ne font pas vide sans faire gadget :**
1. **La tuile apporte la couleur et la preuve**, le corps apporte le sens. La carte blanche seule serait plate (c'est précisément ce qu'Eliott a reproché à la v4 « cartes nettes ») ; la tuile seule serait décorative.
2. **Les mini-interfaces sont crédibles** : vrais libellés, vrais montants (« 2 400 € », « Signé 12 622 € »), vrais états (« Payée », « Nouveau »). Ce n'est pas une illustration, c'est un aperçu du produit livré.
3. **La densité est régulière** : six niveaux de texte, toujours dans le même ordre, avec des filets. L'œil sait où chercher, la carte est pleine sans être chargée.
4. **Rien ne bouge, rien ne penche** : pas d'ombre portée, pas de rotation, pas de survol spectaculaire.
5. **Les packs suivent la même logique** : tuile colorée (nom, objectif, prix en très grand), puis « Ce qui est inclus » en liste à icônes.

Ce qu'on ne reprend pas : les tuiles multicolores (vert, violet, jaune, bordeaux, rose), les émojis 3D (mains, yeux, fusée), la mascotte Ziggy, les photos de stock.

---

## 4. Notre site aujourd'hui : verdict section par section (accueil)

| Section | Ce qu'on voit | Verdict | Pourquoi |
|---|---|---|---|
| Barre du haut (WAB., oiseau-logo, Rechercher ⌘K, thème, « Au studio », horloge, Contact) | Propre, fine | **Garder** | Identité OS assumée et discrète. Seul point : le menu Work/Services/About n'apparaît qu'au-delà d'une certaine largeur, vérifier qu'il est bien visible en 1440. |
| Hero : touches W A B . géantes + phrase + 2 boutons | Le sigle occupe la place du message | **Ajuster** | Le titre réel de la page est « WAB. » : il ne dit rien au client. Les touches restent (signature), mais plus petites, au-dessus d'un vrai titre-promesse. |
| Hero : fenêtres éparpillées, autocollant « HELLO my name is », kaomoji (^_^)/, icônes Corbeille et Work | Bureau en désordre | **Remplacer** | C'est le cœur du « gadget » : placement aléatoire (contraire aux grilles régulières), clins d'œil qui ne servent pas la vente. Les sites montrés le sont mieux plus bas, dans la grille Réalisations. |
| Fenêtre Zinéma en défilement (avec Pause) | Un vrai projet, en grand | **Garder** | Preuve concrète, bien cadrée. Remplacer le bord tramé en pixels par un liseré net. |
| Services : 3 grandes cartes en zigzag + bulles à côté | Cartes Klein à bruit ASCII (#, %, *) animé, beaucoup d'air entre elles | **Remplacer la mise en page, garder le contenu** | Le zigzag étire la section sur 2 écrans et isole les bulles du texte. Le bruit ASCII brouille les aperçus. Une grille de 3 cartes à la manière eazyclick, bulles intégrées, dit la même chose en un écran. |
| Bulles de dialogue (« Tout vit dans un tableur. » / « On en fait votre outil. ») | Excellentes | **Garder, renforcer** | C'est la meilleure idée du site et l'équivalent naturel de la phrase-promesse eazyclick. Elles deviennent le haut du corps de chaque carte. |
| Objets isométriques flottants (fenêtre, crayon, carte WAB., t-shirt) | Dessinés en biais | **Retirer** | Ils se lisent comme des objets penchés (règle « rien de travers ») et n'informent de rien. |
| Volée d'oiseaux en pixels autour de « Le studio » | Une dizaine d'oiseaux | **Retirer de l'accueil** | Le moment le plus gadget de la page, posé pile sur le texte le plus sérieux (la lettre). L'oiseau-logo de la barre suffit. |
| Le studio : lettre « Notes » signée Eliott et Matt | Texte juste, cadre tramé | **Ajuster** | Le texte est bon. Cadre tramé → carte nette ; ajouter Yael Peccatus et Anaïs Polo pour montrer une équipe. |
| Réalisations « Fait à Lausanne » : 9 fenêtres, colonne du milieu décalée | Beau, un peu irrégulier | **Ajuster** | Rendre la grille régulière (3 × 3, hauteurs égales) et ajouter sous chaque fenêtre une ligne « secteur · ce qui a été fait ». Le titre en 72 px est trop grand. |
| Bandeau « 9 projets en ligne, de Lausanne à Bavois (VD) » | Utile | **Garder** | Une preuve vraie. Il passera dans la bande de chiffres (section 5.2). |
| Offres : 3 paliers + prix | Le plus « eazyclick » du site | **Garder, ajuster les textes** | Ajouter un objectif à chaque palier et une accroche. Le badge « Ce qui nous distingue » est flou : le remplacer par « Recommandé ». |
| Carte terminal « > contact » | Clin d'œil développeur | **Remplacer** | Terminal = gadget au moment décisif. Remplacé par un appel final clair (section 5.8). |
| FAQ (8 questions) | Contenu solide, titre géant, une colonne | **Ajuster** | Réécrire la réponse prix sur le mode franc, passer en deux colonnes au-delà de 1000 px (règle déjà actée dans PRODUCT.md), titre ramené à la taille des autres sections. |
| Pied de page Klein : liens, défilant des clients, WAB. géant en lignes | Signature forte | **Garder** | C'est le seul moment exubérant, et il est à sa place (fin de page). Figer l'animation des lignes si elle bouge. |
| Dock (Work, Services, About, Lettre, Terminal, Contact) | Doublon du menu | **Ajuster** | Ramener aux 4 entrées du menu. « Lettre » et « Terminal » sont des gadgets. |
| Fond à points | Discret | **Garder** | Il donne la texture « bureau » sans rien encombrer. |

**Pages intérieures, en bref**
- **Services** : la fenêtre « Services » avec les 9 icônes d'apps est réussie (garder) ; la suite reprend le zigzag et les bulles de l'accueil, avec des légendes grises alignées à droite peu lisibles (« Automatisation / Newsletters / IA » en gris clair) : à passer au même modèle de carte que l'accueil. Le « HELLO my name is » en haut à gauche est à retirer. La section Méthode en 4 étapes est exactement le type de contenu explicatif qu'Eliott aime : à remonter sur l'accueil en version courte.
- **About (/studio)** : contenu riche et crédible (UCreate 10'000 CHF, Bachelor en droit, Centre Patronal, VEG Consulting). C'est la meilleure source de preuves du site, sous-exploitée sur l'accueil.
- **Work (/realisations)** : déjà sobre et régulière, conforme à la direction.

---

## 5. Proposition : l'accueil « bureau rangé »

Ordre de lecture voulu : **promesse → preuve → services → méthode → travaux → prix → studio → questions → contact.** C'est l'ordre eazyclick, adapté : on prouve tôt, on affiche les prix avant de demander le contact.

### 5.1 Ouverture

- Signature : les touches **W A B .** réduites (~64 px de côté au lieu de ~110), centrées, au-dessus du titre.
- **H1** : « Des sites qui font venir vos clients. Des outils qui vous font gagner du temps. »
- **Sous-titre** : « Studio de design et de technologie à Lausanne. Votre site, votre marque et vos outils de gestion, conçus sous le même toit. »
- Boutons : « Démarrer un projet » (touche Klein) + « Voir nos réalisations » (touche claire).
- **Quatre garanties** en pastilles sur une ligne (deux par deux au téléphone, jamais en lignes grises empilées) : « Prix affichés » · « Code sur mesure » · « Hébergé en Suisse » · « Réponse sous 24 h ouvrées ».
- Dessous, la **fenêtre Zinéma** en défilement, pleine largeur du contenu (1120 px), liseré net.
- Retirés : fenêtres éparpillées, autocollant, kaomoji, icônes Corbeille/Work.

### 5.2 Bande de preuves (nouvelle)

- Titre : « Des sites en ligne. Des clients qui reviennent. » (la seconde moitié **à valider** : ne la garder que si elle est vraie).
- 4 **cartes-chiffre** égales, en ligne (2 × 2 au téléphone) : grand chiffre en Instrument Sans 500, légende en dessous.
  - « 9 » — « sites en ligne, de Lausanne à Bavois »
  - « 3 à 6 » — « semaines pour un site vitrine »
  - « 24 h » — « pour recevoir une proposition écrite »
  - « 100 % » — « hébergé en Suisse, chez Infomaniak »
- **À fournir par Eliott** : un ou deux résultats mesurés chez un client (fréquentation, réservations, demandes reçues, temps gagné grâce à un outil). Sans chiffre réel, on n'en invente pas : la quatrième carte peut alors être « 10'000 CHF — remportés au programme UCreate pour le développement d'une application » (fait déjà publié sur /studio).

### 5.3 Services : trois cartes WAB

- Badge « Services » + **H2** : « Ce que nous faisons. Et ce que cela change pour votre entreprise. »
- Grille de **3 cartes égales** (anatomie en section 6). Contenu proposé :

**Carte 1 — Sites internet**
- Tuile : étiquette « SITES INTERNET », aperçu du site Le P'tit Central dans une fenêtre.
- Bulles : « Un site qui tient sur mobile ? » → « Nous le codons de A à Z. »
- Promesse : « Votre site est souvent le premier rendez-vous. Il doit convaincre avant même qu'on vous appelle. »
- Paragraphe : « Nous dessinons et codons chaque site sur mesure, sans WordPress ni Wix. Il s'affiche vite sur téléphone, il est structuré pour Google à Lausanne et dans le canton de Vaud, et il vous appartient : domaine, code et contenus. »
- Puces : « Design et code sur mesure » · « Pensé d'abord pour le mobile » · « Référencement local inclus »
- Chute : « Votre métier, c'est le vôtre. Le site, c'est le nôtre. »
- Bouton : « Voir nos réalisations »

**Carte 2 — Applications de gestion**
- Tuile : étiquette « APPLICATIONS », aperçu de l'écran Finances (montants en CHF, graphique), mention « Données de démonstration » conservée.
- Bulles : « Tout vit dans un tableur. » → « Nous en faisons votre outil. »
- Promesse : « Un tableur partagé n'est pas un outil de gestion. C'est un risque. »
- Paragraphe : « Nous observons d'abord votre façon de travailler, puis nous livrons l'outil module par module. Chaque module sert dès qu'il est terminé, et vos données existantes sont reprises. »
- Puces : « Conçu autour de vos processus » · « Livré par étapes, utilisable tout de suite » · « Accessible depuis le téléphone »
- Chute : « Moins d'outils, moins de ressaisie. »
- Bouton : « Découvrir les applications »

**Carte 3 — Automatisation et IA**
- Tuile : étiquette « AUTOMATISATION », liste de notifications (Devis — Généré ; Facture — Envoyée ; Newsletter — Envoi automatique).
- Bulles : « Les devis me prennent mes soirées. » → « Ils partiront tout seuls. »
- Promesse : « Chaque devis recopié à la main est une heure qui n'est pas facturée. »
- Paragraphe : « Devis, factures, relances, newsletters : nous automatisons les tâches qui reviennent chaque semaine, et nous intégrons l'IA uniquement là où elle fait gagner du temps. »
- Puces : « Devis et factures générés sans saisie » · « Relances et newsletters programmées » · « IA intégrée là où elle est utile »
- Chute : « Vos soirées vous appartiennent. »
- Bouton : « Voir les automatisations »

Sous la grille, une ligne-lien : « Image de marque, print, vêtements : voir tous nos services » → /services.

### 5.4 Méthode (remontée de la page Services)

- **H2** : « De la première conversation à la mise en ligne. »
- 4 cartes étroites numérotées en ligne (chiffre en Sligoil, pas en exposant) : 1 « Premier échange — Votre activité, vos objectifs, vos références. Sans engagement. » · 2 « Proposition — Périmètre, calendrier et prix, sous 24 h ouvrées. » · 3 « Design et développement — Chaque étape validée avec vous. » · 4 « Mise en ligne et suivi — Hébergement, maintenance et évolutions. »
- Mention possible dans l'étape 3 : « Yael Peccatus coordonne votre projet du cadrage à la livraison. » (formulation **à valider** : elle dit le rôle sans employer « interlocuteur unique »).

### 5.5 Réalisations

- Badge « Réalisations » + **H2** : « Fait à Lausanne. » (taille de H2 standard, plus 72 px).
- Sous-titre : « Chaque projet part d'un problème précis. Voici ce que nous avons construit. »
- Grille **régulière 3 × 3**, fenêtres de même hauteur, barre de titre Klein clair conservée. Sous chaque fenêtre : nom du site, puis une ligne « secteur · réalisation » (ex. « Cinéma · Site et programmation » ; « Café · Site vitrine et réservations »). **Les libellés exacts sont à fournir par Eliott** ; ne pas inventer de résultats.
- Bouton : « Voir toutes les réalisations ».

### 5.6 Offres

- Badge « Offres » + **H2** : « Des prix affichés. Avant même le premier échange. »
- Sous-titre : « Trois niveaux d'accompagnement, chacun avec son périmètre, son délai et sa fourchette. Vous savez où vous allez avant de nous écrire. »
- Les 3 cartes actuelles, avec en tête de carte une **tuile** (Klein clair pour 1 et 3, Klein plein pour 2) portant : nom, **objectif**, prix.
  - **Site vitrine** — objectif « Être présent, et bien » — accroche « L'essentiel, fait avec exigence. » — 1'000 – 2'500 CHF — 3 à 6 semaines.
  - **Site et outils** (Recommandé) — objectif « Structurer votre activité » — accroche « Votre site et vos outils, enfin reliés. » — 2'500 – 7'000 CHF.
  - **Expérience sur mesure** — objectif « Marquer les esprits » — accroche « Une pièce unique, de la marque au site. » — dès 7'000 CHF, sur devis.
- Listes « Inclus » actuelles conservées (icônes cochées, 5 lignes).
- Sous la grille, une ligne : « Paiement en plusieurs mensualités possible. Besoin d'un périmètre différent ? Écrivez-nous. »

### 5.7 Le studio

- Badge « Le studio » + la lettre actuelle, dans une **carte nette** (plus de cadre tramé), largeur 720 px.
- Signatures : Eliott Pina (Lead designer), Matt Pina (Lead développeur) ; sous elles, une rangée « L'équipe » avec Yael Peccatus (gestion de projet) et Anaïs Polo (web design) — portraits **à fournir** s'ils n'existent pas.
- Aucun oiseau autour.

### 5.8 Questions fréquentes

- Badge « FAQ » + **H2** : « Les questions qu'on nous pose. Les vraies réponses. »
- Deux colonnes au-delà de 1000 px, filets alignés (règle PRODUCT.md).
- Questions dans cet ordre : prix (réponse franche, voir tableau 2.3, ligne 6) · délais (« Comptez 3 à 6 semaines pour un site vitrine… ») · WordPress ou sur mesure · après la mise en ligne (« Non, vous n'avez rien à gérer seul : hébergement, mises à jour et évolutions sont assurés par le studio. ») · à qui appartient le site · référencement · refonte · que préparer.
- Les réponses commencent par **Oui.** / **Non.** / un chiffre chaque fois que c'est possible.

### 5.9 Appel final (remplace le terminal)

- Une **grande carte Klein pleine** (fond `#161BF2`, texte blanc), largeur du contenu, rayon 20 px.
- À gauche : petit libellé « Premier échange », **H2** blanc « Parlons de votre projet. », paragraphe « Un premier échange de 30 minutes, sans engagement. Nous regardons votre site actuel et vos objectifs, puis nous vous disons concrètement par où commencer. », bouton blanc « Démarrer un projet », libellé « Réponse sous 24 h ouvrées ».
- À droite : **une conversation** en bulles (le client : « J'ai un projet, mais je ne sais pas par où commencer. » → WAB : « C'est justement l'objet du premier échange. ») — les bulles remplacent le mur de photos d'eazyclick, que nous n'avons pas.

### 5.10 Pied de page

Inchangé (liens, défilant des clients, WAB. en lignes Klein). Dock réduit à Work, Services, About, Contact.

---

## 6. La carte WAB (composant unique pour Services, Offres, preuves)

| Élément | Valeur |
|---|---|
| Carte | fond `#FFFFFF`, liseré 1 px `#E4E5E7` (`--line`), rayon 12 px (`--r-win`), **aucune ombre au repos** |
| Survol | liseré `#CEDEFF` (`--klein-tint`), 160 ms. Pas de soulèvement, pas d'échelle |
| Tuile d'aperçu | posée à 6 px du bord de la carte, rayon 8 px, hauteur fixe 220 px (180 px au téléphone) |
| Fond de tuile | Klein plein `#161BF2` **sans** bruit ASCII ni bord tramé, ou Klein très clair `#EAF0FF` (`--klein-wash`) pour alterner. Jamais d'autre teinte |
| Contenu de tuile | étiquette Sligoil 11 px capitales, interlettrage 0,06 em, en haut à gauche (blanc sur Klein, `#0F17BF` sur Klein clair) ; à droite ou en bas, **une seule** mini-interface réelle (capture d'un site livré, écran de l'application, liste de notifications) avec l'ombre `--shadow-object` |
| Corps | padding 28 px (20 px au téléphone), colonne flexible : le bouton est poussé en bas pour que les 3 cartes s'alignent |
| Bulles | en tête du corps : question (gris clair, alignée à gauche) puis réponse (Klein, alignée à droite), 15 px |
| Titre de carte | Instrument Sans 500, 22 px, interlettrage −0,02 em |
| Promesse | 17 px, encre `#101214`, 400, deux lignes maximum |
| Paragraphe | 15 px, `#55585F`, interligne 1,55, 4 lignes maximum |
| Puces | 3 lignes, icône au trait 18 px Klein + texte 15 px encre, filet 1 px `#E4E5E7` entre elles, 14 px de padding vertical |
| Chute | 15 px `#55585F`, une phrase. **Masquée au téléphone** (évite l'empilement de petites lignes grises) |
| Bouton | touche claire pleine largeur (touche Klein pour la carte mise en avant), flèche à droite |
| Grille | 3 colonnes égales, gouttière 12 px, hauteurs égales ; 1 colonne sous 900 px |

**Règle d'or : jamais de carte blanche sans tuile.** C'est la tuile Klein qui évite le reproche « plat et sans âme » adressé à la v4.

**Carte-chiffre** (bande de preuves) : même carte, sans tuile ; padding 28 px ; chiffre 56 px Instrument Sans 500 interlettrage −0,04 em en haut ; légende 15 px `#55585F` en bas ; hauteur fixe 180 px.

---

## 7. Palette

| Couleur | Hex | Rôle | Part |
|---|---|---|---|
| Bureau | `#FAFAFA` + points `--desk-dot` | Fond des sections | ~55 % |
| Papier | `#FFFFFF` | Cartes, barre | ~25 % |
| Panneau | `#F3F2EF` | Fond de la section Offres (une section sur quatre au plus) | ~8 % |
| Klein | `#161BF2` | Tuiles, boutons principaux, bulles de réponse, appel final, pied de page | ~8 % |
| Klein clair | `#EAF0FF` / `#CEDEFF` | Tuiles alternées, barres de fenêtre, survols | ~2 % |
| Encre | `#101214` | Titres, texte principal | texte |
| Encre douce | `#55585F` | Paragraphes, légendes | texte |
| Filet | `#E4E5E7` | Liserés, séparateurs | — |
| Klein encre | `#0F17BF` | Petits textes bleus sur fond clair | — |

**Combinaisons interdites** : Klein `#161BF2` en texte de moins de 14 px sur `#EAF0FF` (utiliser `#0F17BF`) ; encre douce sur Klein ; toute seconde couleur d'accent (vert, violet, rose, jaune — les tuiles multicolores d'eazyclick ne sont pas transposées) ; dégradés violets ou arc-en-ciel.

---

## 8. Typographie

- **Instrument Sans** (déjà servie, gratuite) pour tout le texte et les titres. **Sligoil** uniquement pour les étiquettes, badges, noms de fichiers et numéros d'étapes.
- Graisses : 400 texte, 500 titres. Le 600 réservé aux boutons. Jamais de gras décoratif.

| Niveau | Taille | Interligne | Interlettrage |
|---|---|---|---|
| H1 (ouverture) | clamp(2.5rem, 5vw, 4.25rem) | 1,04 | −0,035 em |
| H2 (sections) | clamp(2rem, 3.6vw, 3rem) | 1,08 | −0,03 em |
| Titre de carte | 1,375rem | 1,2 | −0,02 em |
| Promesse / lede | 1,0625rem – 1,25rem | 1,45 | normal |
| Texte | 1rem / 0,9375rem en carte | 1,55 | normal |
| Étiquette Sligoil | 0,6875rem – 0,75rem, capitales | 1 | 0,06 em |

- Plus aucun titre au-delà de 4,25 rem en dehors du pied de page (aujourd'hui « Fait à Lausanne » et « Questions fréquentes » montent à ~72 px).
- Casse de phrase partout, capitales seulement en Sligoil.
- **Typographie française** : espace insécable avant ? ! : ; et à l'intérieur des guillemets ; apostrophe typographique ’ ; aucun signe seul en début de ligne, vérifié jusqu'à 320 px.

---

## 9. Layout et espace

- Largeur de contenu : **1120 px** (marges de 160 px en 1440, comme aujourd'hui).
- Grille de 12 colonnes, gouttière de 12 px entre cartes.
- Rythme vertical : 128 px entre sections sur ordinateur, 80 px au téléphone ; 48 px entre le titre de section et sa grille.
- En-têtes de section **centrés** : badge Sligoil, H2, une phrase. (L'en-tête titre à gauche / phrase à droite a déjà été rejeté, on ne le repropose pas.)
- Rayons : 12 px cartes et fenêtres, 8 px tuiles et contrôles, 20 px grande carte d'appel final, pilules pour les pastilles.
- Bords : liseré 1 px net. Les bords tramés en pixels (`--dither`) sont réservés à **un seul** objet par page au maximum (la fenêtre Zinéma de l'ouverture si Eliott tient à les garder) ; partout ailleurs, liseré simple.
- Tout est droit : aucune rotation, aucune perspective, aucun objet isométrique.

---

## 10. Imagerie et matières

- **Uniquement du réel** : captures des sites livrés, écrans des applications (avec la mention « Données de démonstration »), portraits de l'équipe. Pas de photo de stock, pas d'illustration, pas de 3D.
- Les captures dans les tuiles et fenêtres : nettes, à l'échelle, ombre `--shadow-object` unique.
- Grain fin `--grain` du fond conservé. Fond à points conservé.
- Le bruit ASCII animé (#, %, *) et les lignes nodales animées dans les tuiles Klein sont retirés : ils brouillent la lecture des aperçus.

---

## 11. Motion

- **Une seule chose bouge en continu sur l'écran** : le défilement de la fenêtre Zinéma (avec bouton Pause). Tout le reste est immobile au repos.
- Apparition au défilement : fondu + montée de 12 px, 420 ms, `cubic-bezier(0.22, 1, 0.36, 1)`, décalage de 60 ms entre cartes d'une même grille, une seule fois.
- Survols : 160 ms, changement de liseré ou de fond uniquement.
- Bulles de dialogue : la question apparaît, puis la réponse 300 ms après (comme aujourd'hui), une seule fois.
- `prefers-reduced-motion` : tout apparaît sans mouvement, défilement Zinéma en pause.
- Oiseaux : seul l'oiseau-logo de la barre (battement d'ailes). Pas de volée sur l'accueil.

---

## 12. À ne pas faire

1. Copier les formules d'eazyclick (« panneau au fond d'une forêt », « budget imaginaire », « zéro bullshit », « Lancez-vous. Sérieusement. ») ni leurs noms de packs.
2. Tutoyer, ou employer un registre familier.
3. Inventer des chiffres, des notes Trustpilot/Google, des logos clients ou des témoignages. Toute preuve manquante est marquée « à fournir par Eliott ».
4. Écrire « interlocuteur unique ».
5. Tuiles multicolores, émojis 3D, mascotte, fusée, photos de stock.
6. Objets flottants, isométriques, penchés ou en perspective ; autocollants ; kaomoji ; icônes Corbeille.
7. Placer des éléments au hasard sur le fond : tout est dans une grille.
8. Volée d'oiseaux, nuage d'objets, 3D, WebGL, objets géants.
9. Bruit ASCII ou lignes animées dans les aperçus.
10. Cartes blanches sans tuile ; cartes dans des cartes (la tuile est posée dans la carte, rien d'autre).
11. Titres de section au-delà de 3 rem ; chiffres en exposant.
12. Plus d'un accent de couleur ; dégradé violet par défaut ; police Inter.
13. Empiler de petites lignes grises sous un bloc en mobile.
14. Terminal, commandes « > contact », ou autre clin d'œil développeur aux moments de conversion.
15. Laisser un « ? » ou un « ! » seul en début de ligne.

---

## 13. En une phrase

**Le même bureau WAB, rangé : chaque carte dit ce que le client y gagne, le prouve avec une vraie interface, et affiche son prix.**

---

## 14. Conflits avec les documents existants (à arbitrer)

- **PRODUCT.md, « Positioning »** : « sans intermédiaire, sans chef de projet ». Contredit l'équipe actuelle (Yael Peccatus, gestion de projet) et le ton « grande agence ». À mettre à jour.
- **PRODUCT.md, « l'accueil ne défile pas »** : périmé, l'accueil actuel défile sur ~9 800 px. À retirer.
- **PRODUCT.md, About** : en-tête « Deux frères, un seul interlocuteur. » — contraire à la consigne « pas d'interlocuteur unique ». À réécrire.
- **DESIGN-SYSTEM.md (v5, ciel rose, plaques de verre)** : remplacé dans les faits par la direction Klein d'`OS-COMPONENTS.md`. Ce document-ci s'aligne sur Klein ; DESIGN-SYSTEM.md reste utile comme historique des refus.
- **OS-COMPONENTS.md** : prévoit `data-birds="rare"` (2 à 4 oiseaux) sur l'accueil ; en pratique une dizaine d'oiseaux se regroupent autour de la lettre. Cette DA propose de couper la volée sur l'accueil.
