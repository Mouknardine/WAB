# Product

<!-- impeccable:product-schema 1 -->

État au **8 octobre 2026**. Ce qui est durable (public, offres, prix, ton, équipe, contraintes) ; l'aspect visuel est dans `DESIGN-SYSTEM.md`, les composants dans `OS-COMPONENTS.md`.

## Platform

web

## Users

Dirigeants de PME et indépendants de l'arc lémanique (Lausanne, Morges, Nyon, Vevey, Genève) et de Suisse romande, qui cherchent un studio pour créer ou refondre leur site, ou pour développer un outil de gestion interne.

Ils arrivent le plus souvent sans culture technique, avec un site existant daté ou absent, ou avec des process métier qui vivent dans un tableur partagé. Leur travail sur le site : juger en quelques secondes si ce studio est sérieux, comprendre ce qu'il sait faire et combien cela coûte, et décider d'engager un premier échange sans risque.

Second public, plus rare mais réel : des clients créatifs (DJ, architecte, artisan joaillier, collectif artistique) qui viennent chercher un objet visuel fort plutôt qu'un site standard.

## Product Purpose

Le site est l'outil commercial principal de WeAreBrothers Studio (WAB.), studio indépendant de design et de développement fondé à Lausanne par Eliott et Matt Pina. Il présente le studio, son travail et ses services — création de sites sur mesure, refonte, web design, branding, motion design, e-commerce, SEO, automatisation, et développement d'applications de gestion sur mesure.

Succès = un visiteur qualifié qui envoie le formulaire de contact ou écrit à contact@wearebrothers.ch, avec suffisamment de confiance déjà installée pour que le premier échange porte sur le projet, pas sur la crédibilité du studio.

## Positioning

Un studio de design et de technologie à Lausanne : marque, site et outils de gestion conçus sous le même toit, par une équipe nommée et joignable. Ton de **grande agence de design** — professionnel, posé, concret.

Second différenciateur, en montée : WAB ne s'arrête pas au site vitrine. Le studio développe aussi des applications de gestion sur mesure, dessinées à partir du métier réel de l'entreprise. Peu de studios de cette taille couvrent les deux.

Priorité commerciale : les sites web restent le cœur de l'activité ; les logiciels métier sont l'axe de croissance. Le site sert les deux sans que la seconde offre écrase la première.

Formulations à éviter : « interlocuteur unique », « sans chef de projet » (l'équipe compte un gestionnaire de projet), tout registre familier.

## Operating Context

- Zone d'intervention : arc lémanique et Suisse romande. Studio basé à **Lausanne** — jamais Genève comme siège (Genève n'apparaît que comme zone desservie).
- Contact direct par email et formulaire, réponse annoncée sous 24 h ouvrées, sans engagement.
- Déroulé d'un projet site : premier échange, proposition (périmètre, calendrier, prix), design et développement validés étape par étape, puis mise en ligne, hébergement en Suisse (Infomaniak), maintenance et évolutions.
- Déroulé d'un projet logiciel : observation du métier, puis livraison module par module, chaque module utilisable dès qu'il est terminé, reprise des données existantes.
- Délai type d'un site vitrine : 3 à 6 semaines.
- **Prix publics** (validés par Eliott le 03.10.2026), affichés sur l'accueil et Services :
  - **Site vitrine** — 1'000 – 2'500 CHF — « Être présent en ligne » ;
  - **Site et outils** (recommandé) — 2'500 – 7'000 CHF — outil de gestion, e-commerce et options ;
  - **Expérience sur mesure** — dès 7'000 CHF, sur devis — avec refonte de marque.
  Paiement en plusieurs mensualités possible. Aucun autre prix ne doit être publié.

## Capabilities and Constraints

**Pages** (URLs propres réécrites par `.htaccess`) :

| Adresse | Fichier | Contenu |
|---|---|---|
| `/` | `index.html` | Premier écran « WeAreBrothers. » en touches + deux boutons ; Services (trois cartes : sites, applications, automatisation) ; Méthode (quatre étapes) ; Réalisations (« Fait à Lausanne. », grille de captures) ; Offres (trois prix) ; Le studio (lettre signée) ; FAQ ; appel final |
| `/realisations` | `work.html` | « Neuf études de cas, de Lausanne à Bavois. » — vue en icônes ou en liste, fiche de chaque projet ; méthode ; contact |
| `/services` | `services.html` | Technologie ; Image de marque ; Formules (les trois prix) ; Méthode |
| `/studio` | `about.html` | Équipe (cinq portraits en fenêtres, nom et rôle) ; Conseil (fenêtre « Parcours ») ; Savoir-faire ; contact |
| `/creation-site-internet-lausanne` | `creation-site-internet-lausanne.html` | Page d'atterrissage SEO : exemples, ce qui est inclus, formats, déroulé, studio et communes servies, refonte, FAQ |
| `/applications` | `applications.html` | L'application de gestion écran par écran, approche, FAQ, contact |
| (toute adresse inconnue) | `404.html` | Page introuvable, vrai code 404, `noindex` |

- **L'accueil défile** : c'est une page longue, avec un sommaire de ses sections dans le dock (ordinateur).
- **Menu** : Work, Services, About, et Contact (qui ouvre une fenêtre). Toute nouvelle page se rattache à l'un de ces nœuds.
- **Création de site et Applications** ne sont pas dans le menu : elles sont atteintes par la colonne « Expertises » du pied de page de toutes les pages. Ces liens ne doivent jamais disparaître (sans lien visible, Google traiterait la page d'atterrissage comme satellite).
- **Pas de page Contact** : tout lien `data-contact` ouvre une fenêtre de contact par-dessus la page. `/contact` redirige en 301 vers `/#ecrire`, qui l'ouvre. Champs obligatoires : nom, email, message (astérisque) ; facultatifs : entreprise, type de projet, budget en CHF, délai. Le budget figure dans l'objet de l'email reçu.
- **About** : pas d'étiquette, de manifeste ni de liste de valeurs ; les diplômes et le prix UCreate sont ceux d'Eliott, jamais du studio entier ; ne jamais gonfler ni inventer ces faits. Ne jamais poser de légende sur les visages.
- **Listes et FAQ** : deux colonnes au-delà de 1000 px, filets alignés.

**Stack** : HTML, CSS et JavaScript statiques écrits à la main, sans framework ni étape de build ; PHP seulement pour l'envoi du formulaire. Tout doit tenir en fichiers plats servis par FTP. Détail des dossiers : `README.md`.

**SEO local prioritaire** : JSON-LD complet sur chaque page (Organization, Person, WebPage, FAQPage, BreadcrumbList), `sitemap.xml` avec images, `llms.txt`, `robots.txt`, IndexNow (à chaque déploiement, et `indexnow.sh` / workflow `submit-urls.yml` à la demande). Requêtes cibles : « agence web Lausanne » et « site internet Lausanne », présentes dans le titre, la description et le H1 de l'accueil (le H1 visible est le nom en touches ; la suite est réservée aux lecteurs d'écran et aux moteurs). Les réponses de FAQ affichées et celles du bloc FAQPage sont identiques mot pour mot. À maintenir à chaque ajout de page ou d'image.

**Langue** : français (`fr-CH`) uniquement. Une version anglaise est envisagée : garder le contenu séparable de la structure.

**Typographie française** : jamais de `?` ou `!` isolé en début de ligne — espace insécable systématique, à vérifier jusqu'à 320 px.

**Non décidé** : blog ; version anglaise.

## Brand Commitments

- Nom : **WeAreBrothers Studio**, affiché **WAB.** dans l'interface. Variantes reconnues : WeAreBrothers, WAB Studio.
- Équipe nommée publiquement (page About) :
  - **Eliott Pina** — lead designer, direction artistique ; bachelor en droit, master en cours en systèmes d'information et innovation digitale, lauréat du programme UCreate (10'000 CHF pour le développement d'une application) ;
  - **Matt Pina** — lead développeur full-stack ; également en poste au Centre Patronal ;
  - **Ivan Jakovlevski** — commercial et relation client ; également en R&D chez VEG Consulting, fiduciaire lausannoise ;
  - **Yael Peccatus** — gestionnaire de projet (a notamment piloté Memories Store et le label LE MEMO) ;
  - **Anaïs Polo** — web designeuse, étudiante en Bachelor Media & Interaction Design à l'ECAL.
- Quatre valeurs internes, non affichées : Proximité, Craft, Performance, Transparence.
- Voix : française, directe, concrète, sans jargon ; le client est vouvoyé. Affirmations vérifiables plutôt que formules creuses. Les bulles de dialogue (question / réponse) sont une signature à garder.
- Email public unique : contact@wearebrothers.ch. Domaine : wearebrothers.ch.

## Evidence on Hand

**Réalisations réelles** (neuf, dans `work.html`, source unique lue aussi par les fenêtres de l'accueil) : Zinéma (cinéma d'art et essai, Lausanne), LE MEMO (collectif artistique et boutique, Lausanne), Le P'tit Central (café-restaurant, Lausanne), Maison Alliani (haute joaillerie, grillz sur mesure), Amarte Studio (yoga et Pilates, Épalinges), Nadège Mouine (site personnel, architecte en formation à l'EPFL), LAZIZZE DJ (portfolio immersif), La Slack (portfolio en bureau virtuel), Commissione Entretien (entreprise familiale d'entretien, Bavois).

**Application de gestion réelle**, conçue pour une agence : projets, tâches, temps, clients, documents, facturation. Trois écrans sur `/applications`, **avec données de démonstration** — la mention doit rester visible. Le nom de l'agence cliente n'est pas public.

**Absences à ne jamais combler par invention** : aucun témoignage client, aucun logo de client, aucun chiffre d'affaires ni nombre de projets au-delà des neuf montrés, aucune certification, aucune autre récompense que UCreate. Une preuve manquante se demande à Eliott, elle ne se fabrique pas.

## Product Principles

1. **La preuve avant la promesse.** La crédibilité vient du travail montré, des prix affichés et de la qualité du site lui-même.
2. **Une équipe joignable.** Des personnes nommées, une réponse sous 24 h ; rien ne doit mettre de distance entre le visiteur et le studio.
3. **Rien qui ne serve un client réel.** Ce qui n'a pas d'usage identifié n'entre pas, sur une page comme dans un logiciel.
4. **Local d'abord.** Lausanne et l'arc lémanique sont le marché.
5. **Deux offres, une seule maison.** Sites et logiciels métier cohabitent sans se diluer.
6. **Le site est la démonstration.** Un défaut visible coûte plus ici qu'ailleurs.

## Accessibility & Inclusion

Pas d'obligation contractuelle formelle. Pratique du site : contraste AA, navigation clavier, `prefers-reduced-motion` respecté (animations et son coupés), décor en `aria-hidden`, texte réel dans les titres. Pour les applications métier : consultation au téléphone, debout, entre deux rendez-vous — petit écran d'abord.
