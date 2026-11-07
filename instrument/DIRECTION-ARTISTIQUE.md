# Maquette « l'instrument » — fiche projet

Version maquette, 6 novembre 2026. Remplace la piste « machine à pixels » (maquette-machine/, structure jugée trop classique par Eliott).

## 1. Brief réécrit (P-01)
Pour : responsables de PME, lieux culturels, indépendants de Suisse romande.
Pour faire : sentir en dix secondes l'aisance de WAB avec la technologie et l'IA, savoir qu'ils sont à Lausanne, et pouvoir écrire ou appeler.
Action principale : jouer avec l'écran ; action de fond : contacter (toujours visible en haut à droite).
Si le visiteur ne regarde qu'une chose : l'écran qui répond à sa première touche.
Fait absent de la demande : la page ne montre plus les projets ; seul le lien « Réalisations » y mène.

## 2. Dossier de matière (P-02)
D1 six teintes WAB (css/os-tints.css) ; D2 pixels du site en ligne ; D3 Sligoil Micro et Micro Bold (police du site) ; D4 contact@wearebrothers.ch, 079 311 58 40 ; D5 Lausanne ; D6 le clavier suisse QWERTZ, outil quotidien du studio.

## 3. Idée en une phrase (P-03)
« Le site de WeAreBrothers est un instrument à pixels aux six couleurs du studio : chaque touche d'un clavier suisse y joue un geste. »
Test d'interchangeabilité : avec le nom d'un concurrent, la phrase perd ses six teintes, ses pixels et sa police (D1 à D3).

## Inspirations
Esprit : l'écran est un appareil qu'on joue, plein et bruyant, où rien n'explique et tout répond.
R1, R6 : la typo fait l'image (lettres géantes en pixels). R2 : aplats bruts posés sur le reste. R5, R7 : la page est un dispositif. R3 : nuance de jeu. Laissé : autocollants (R1), faux bureau (R5), arc de pochettes (R7), manifeste (R4), grotesques et palettes des références.
Tests : T1 rien de reconnaissable côte à côte ; T2 aucune signature reprise ; T3 aucune police ni palette commune ; T4 voir § 3 ; T5 anti-slop passé ; T6 rien de proche d'une agence vaudoise.

## 4. Boîte morphologique (P-04)
Typo : une seule police, Sligoil (07.11 : Eliott veut la même police partout) ; 700 pour la marque, les commandes et les titres, 400 pour ce qui se lit ; ← → ↗ en police système. Zone de jeu gris très clair, bords et cartes sur papier blanc. Couleur : papier, encre, six aplats pleins. Forme : cellule carrée, aplat, filet d'encre. Mouvement : gestes de 200 à 380 ms, décélération, déclenchés seulement par une action. Ton : vouvoiement, phrases courtes.
Ancres : six teintes, pixel carré, contact visible.

## 5. Typographie
Texte 15 à 16 px, titre clamp(1rem, …, 1.375rem), consignes 13 px. Convention romande : espace insécable avant « : », apostrophe ’.

## 6. Couleur
Fond papier, encre oklch(0.18 0.005 265), six aplats --klein (D1). Textes toujours sur aplat de papier .

## 7. Grille
Cellule 16 px partout (10 px entre 768 et 896 px). Bords à 8 px / 16 px. Écritures de l'accueil en ligne (signes, mots, lettres isolées) en Sligoil 15 px au bureau, 13 px au téléphone, un signe pour ~36 cases pleines, encre papier sur bleu et rouge, encre noire ailleurs, lettres isolées en teinte assombrie (3:1 au moins) ; jamais dans une grande lettre détourée pendant 8 s. Téléphone (< 768 px) : trois bandes, contact en haut sur une ligne, instrument au milieu entre deux filets de 2 px, un seul panneau en bas (phrase, rangée des quatre rubriques) ; plus de pads ni de Pause au téléphone (07.11, Eliott : « ne servent à rien »), on joue en touchant la grille ; lettres en grand (0,75 du petit côté), détourées sur papier.

## 8. Mouvement
Aucun au chargement. Lettre 260 ms (balayage haut-bas), forme 240 ms (éclosion), aplat 200 ms, vague 360 ms, pluie 380 ms, miroir 300 ms, dispersion 320 ms, décalage 220 ms, effacement 340 ms ; Entrée : cascade de 45 ms entre gestes (après action). Interruptibles et empilables. Mouvement réduit : gestes posés d'un coup. Vibration de 10 ms au doigt quand l'appareil la permet. Relecture Emil Kowalski (07.11, css/mouvement.css) : appui à scale 0,97 en 160 ms sur tous les boutons ; ouverture d'une rubrique 0,97 → 1 + opacité en 180 ms depuis les boutons du bas (opacité seule en mouvement réduit) ; changer de carte reste instantané ; au doigt, la carte suit le glisser, un geste vif (> 0,11 px/ms) suffit, retour 200 ms sinon ; un seul doigt compte.

## 9. Formats
Maquette web statique, un seul écran sans défilement, bureau et mobile.

## 10. Il vit tout seul (demande d'Eliott, 06.11.2026)
Quand personne ne joue : dérive des pixels toutes les 140 ms (environ 0,16 % des cases : glisser d'une case, changer de teinte, s'éteindre, s'allumer à côté) et un geste de la table toutes les 2 à 3 s, choisi selon la densité (au-dessus de 55 % : éclaircie ; sous 40 % : forme, aplat, pluie, lettre ou mot court WAB, FORME, PIXEL, TRAME, SIGNE). Arrêt immédiat dès que le visiteur joue, reprise 4 s plus tard avec une montée de 2 s. Pause onglet caché, bouton Pause / Lecture (WCAG 2.2.2), rien en mouvement réduit. Exception MV-06 écrite.

## 11. Les surprises (demande d'Eliott, 06.11.2026)
À chaque touche ou clic court du visiteur (jamais du pilote) : un message en Sligoil Bold sur aplat blanc ou noir (1,2 s, trois au plus ; liste dans js/messages.js), parfois le chat qui danse (3 s, au moins 6 actions d'écart), parfois une pluie de 40 à 80 billets (toujours sur Entrée). Par-dessus les pixels, sous les bords. Mouvement réduit : messages seulement. Billets gardés : 00, 03, 05, 07, 08, 13, 14 (les autres étaient coupés net ou en paquets).

## 12. Cartes (06.11.2026, revu le même jour)
Nous (rose), Projets (bleu), Prix (jaune), Contact (vert), ouvertes depuis les boutons du bas. Papier plein, bordure d'encre pleine de 2 px, coins droits, aucune ombre, jamais penchées ; en-tête en aplat de la teinte (nom, numéro « 3/10 », ← →, ×). Titre en Sligoil Bold 22 px, texte en Sligoil 16 px (15 px au téléphone). Passer d'une carte à l'autre (07.11) : l'en-tête reste fixe, la carte prend sa nouvelle hauteur en 320 ms (courbe tiroir), l'ancien texte glisse de 16 px dans le sens du geste et s'efface (160 ms), le nouveau arrive de l'autre côté ligne après ligne (30 ms d'écart), et les cartes du dessous se resserrent un instant comme si l'on tirait une carte du paquet ; interruptible, fondu seul en mouvement réduit (js/cartes-transition.js). Bureau : un paquet par rubrique, une carte visible, deux bords pleins décalés de 6 px dessous ; paquets déplaçables par l'en-tête, cascade légère de 40 × 48 px entre paquets ; Nous ouvert au chargement. Téléphone : une rubrique à la fois, même paquet d'une carte (← →, glisser au doigt, « Fermer »), qui couvre toute la zone de l'instrument sur fond papier avec 16 px de gouttières ; capture limitée à 40 % de la carte. Contour de focus au clavier seulement. Textes dans js/cartes-donnees.js.

## 13. Les deux blocs du bas au bureau (07.11.2026)
Même famille que les cartes et les touches : papier, bordure d'encre pleine de 2 px, coins droits, même marge intérieure, bas alignés. À gauche, texte justifié d'un bord à l'autre : le bloc fait 47 signes (la phrase la plus longue tient sur une ligne), le titre en Sligoil 700 tient en trois lignes de 21 signes et sa taille en découle ; un filet le sépare des deux phrases. À droite, les rubriques en touches de 4 px d'épaisseur (la rubrique ouverte reste enfoncée, remplie de sa teinte), puis sous un filet « Jouez » et ses touches de clavier dessinées (A–Z, 0–9, Espace, Entrée), qui s'enfoncent 140 ms quand on tape la vraie touche. Plus de Pause, plus de ligne de faits, plus de « Cliquez, glissez » (demandes d'Eliott, 07.11). Sans clavier ni souris, la ligne « Jouez » disparaît. Le téléphone ne change pas.

## Curseur (07.11)

Demandé par Eliott sur sa référence : une flèche en losanges de pixels, rose #eb3f9c, cerclée de blanc pour rester visible sur les pixels roses (assets/curseur.svg, 32 px, pointe en 2 × 2). Curseur natif du navigateur (`cursor: url()`), pas un élément qui suit la souris : rien ne traîne, MV-10 non concerné. La main reste sur les boutons et liens.

## Formulaire de contact (07.11)

Dans la carte Contact : nom, e-mail (obligatoires), entreprise, projet et budget en touches (facultatifs), message (obligatoire), puis « Envoyer » en grande touche verte. Envoi vers /send-message.php (SMTP Infomaniak, déjà en ligne), champ piège anti-robots. Erreurs écrites sous chaque champ, corrigées en direct ; si l’envoi échoue, rien n’est perdu : lien vers la messagerie avec le message déjà rédigé. Au bureau la carte fait 34 rem, nom et e-mail côte à côte. En local (serveur Python), l’envoi tombe toujours dans le cas « pas parti » : il ne marche qu’en ligne.
