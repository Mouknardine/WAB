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

**Pages en ligne** : Accueil (`/`), Réalisations (`/realisations`), Applications sur mesure (`/applications`), À propos (`/studio`), Contact (`/contact`).

**Stack du site** : HTML / CSS / JavaScript statiques, écrits à la main, sans framework ni étape de build. Une feuille de style et un script par page (`style.css` + `about.css`, `work.css`, `contact.css`, `applications.css`). Déploiement par GitHub Actions vers Infomaniak en FTPS à chaque push sur `main`.

**Contrainte durable — 100 % statique.** Tout travail futur doit tenir en fichiers plats servis par FTP. Pas de framework, pas de bundler, pas d'étape de build.

**Contrainte durable — le site est la démonstration.** Le site est lui-même la première preuve commerciale du niveau de craft vendu aux clients. Un défaut visible sur le site coûte plus qu'ailleurs.

**Contrainte durable — SEO local prioritaire.** Le référencement Lausanne / arc lémanique passe avant les autres arbitrages : JSON-LD complet sur chaque page (Organization, Person, WebPage, FAQPage, BreadcrumbList), `sitemap.xml` avec images légendées, `llms.txt`, `robots.txt`, ping IndexNow (`indexnow.sh`). À maintenir à jour à chaque ajout de page ou d'image.

**Langue** : français (`fr-CH`) uniquement aujourd'hui. Une version anglaise est envisagée : les nouvelles pages doivent être structurées pour l'accueillir sans refonte (pas de texte codé en dur dans des chemins, structure de contenu séparable).

**Formulaire de contact** : `send-message.php` + `smtp-mailer.php`, SMTP authentifié Infomaniak (la fonction PHP `mail()` est désactivée chez l'hébergeur). Identifiants injectés au déploiement depuis les secrets GitHub, en base64, dans un `mail-config.php` qui n'existe jamais dans le dépôt. Implémentation actuelle, non figée comme engagement produit.

**Typographie française** : jamais de `?` ou `!` isolé en début de ligne — espace insécable systématique, à vérifier jusqu'à 320 px de large.

**Non décidé** : rien n'est arrêté sur une éventuelle page tarifs, un blog, ou une page dédiée par service.

## Brand Commitments

- Nom : **WeAreBrothers Studio**, affiché **WAB.** dans l'interface. Variantes reconnues : WeAreBrothers, WAB Studio.
- Slogan : « Des expériences qui restent dans la mémoire ».
- Équipe nommée publiquement : **Eliott Pina** (lead designer / direction artistique — Figma, Motion Design, Branding, GSAP, Three.js, After Effects), **Matt Pina** (lead développeur full-stack — Next.js, TypeScript, Node.js, Supabase, PostgreSQL, GSAP), **Ivan Jakovlevski** (commercial et relation client, également en R&D chez VEG Consulting, fiduciaire à Lausanne).
- Quatre valeurs affichées, dans cet ordre : Proximité, Craft, Performance, Transparence.
- Voix : française, directe, concrète, sans jargon. Tutoiement jamais employé ; le client est vouvoyé. Les formules commerciales creuses sont évitées au profit d'affirmations vérifiables.
- Email public unique : contact@wearebrothers.ch. Domaine : wearebrothers.ch.

## Evidence on Hand

**Réalisations réelles, en ligne, présentées avec captures** (`assets/images/project-*.png`) :

- La Slack — portfolio créatif en bureau virtuel — https://la-slack.com/
- Nadège Mouine — site personnel, architecte en formation à l'EPFL — https://nadegemouine.ch
- Commissione Entretien — entreprise familiale d'entretien à Bavois (VD) — https://commissione-entretien.ch/
- LAZIZZE DJ — portfolio immersif, DJ house lausannois
- Maison Alliani — vitrine haute joaillerie, grillz sur mesure
- Géotechnologie — bureau d'études géotechniques à Morzine

**Application de gestion réelle**, conçue et développée pour une agence : projets, tâches, temps passé, clients, documents, facturation. Trois écrans documentés sur `/applications` (`app-agenda-aujourdhui`, `app-agenda-taches`, `app-agenda-finances`), **avec données de démonstration** — la mention doit rester visible.

**Absences à ne jamais combler par invention** : aucun témoignage client, aucun logo de client, aucun chiffre d'affaires, aucun nombre de projets livrés, aucun prix, aucune certification, aucune récompense. Le nom de l'agence cliente de l'application n'est pas public. Si un futur travail a besoin de preuve sociale, elle doit être demandée, pas fabriquée.

## Product Principles

1. **La preuve avant la promesse.** Le studio n'a ni témoignages ni chiffres : sa crédibilité vient du travail montré et de la qualité du site lui-même. Toute page doit démontrer plus qu'elle n'affirme.
2. **La relation directe est le produit.** Deux frères joignables, sans intermédiaire, réponse sous 24 h. Tout ce qui met de la distance entre le visiteur et les fondateurs travaille contre l'offre.
3. **Rien qui ne serve un client réel.** Vaut pour les fonctionnalités d'un logiciel comme pour les sections d'une page : ce qui n'a pas d'usage identifié n'entre pas.
4. **Local d'abord.** Lausanne et l'arc lémanique sont le marché ; la visibilité locale conditionne l'arrivée des clients avant toute autre considération.
5. **Deux offres, une seule maison.** Sites et logiciels métier doivent cohabiter sans se diluer : un visiteur venu pour un site ne doit jamais se sentir sur le mauvais site, et inversement.

## Accessibility & Inclusion

Aucun standard formel n'a été établi comme obligation contractuelle. Contrainte d'usage confirmée pour les applications métier : consultation depuis le téléphone, debout, entre deux rendez-vous — interface dessinée pour le petit écran d'abord.
