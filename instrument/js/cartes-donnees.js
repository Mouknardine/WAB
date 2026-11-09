/**
 * Les textes des cartes : qui on est, nos projets, nos services, le contact.
 * À éditer ici, et seulement ici. Les espaces avant ? ! : ; et dans
 * « 24 h » ou « 1’000 CHF » sont insécables : garder-les en recopiant.
 */

/**
 * @typedef {{ href: string, texte: string, externe?: boolean }} Lien
 * @typedef {Object} Carte
 * @property {string} titre
 * @property {string} texte
 * @property {string} [prix]  montant, sous le titre (Services)
 * @property {string} [image]  capture : /assets/images/shot-<image>-800.webp
 * @property {string} [mockup]  photo de mise en situation (iPhone ou MacBook) : /assets/images/work-<mockup>-720.webp
 * @property {string} [avatar]  portrait : /assets/images/avatar-<avatar>.webp
 * @property {Lien[]} [liens]
 * @property {string} [lieu]
 * @property {boolean} [formulaire]  le formulaire de contact, sous le texte
 * @typedef {{ id: string, nom: string, cartes: Carte[] }} Rubrique
 */

/** @type {Rubrique[]} */
export const RUBRIQUES = [
    {
        id: 'nous',
        nom: 'Nous',
        cartes: [
            { titre: 'Une équipe de fous.', texte: 'WeAreBrothers® est un studio créatif qui se sert de l’intelligence artificielle pour élargir sa créativité et concevoir les meilleurs outils. Nos yeux et notre expérience sont nos instruments les plus essentiels pour naviguer dans un monde rempli de bruit et de différences. Nous collaborons avec des secteurs et des univers culturels divers : nous cherchons à comprendre leurs processus afin de proposer les solutions les plus simples et les plus efficaces.' },
            { titre: 'Eliott Pina', avatar: 'eliott', texte: 'Couteau suisse. Jamais de non : on trouvera toujours la solution, ou la personne qu’il faut. Bachelor en droit, master en systèmes d’information et une sacrée curiosité : j’aime faire plein de choses.' },
            { titre: 'Matt Pina', avatar: 'matt', texte: 'Deuxième couteau suisse. Je gère principalement le déploiement et la finalisation de vos projets. J’adore sincèrement le défi de concevoir des outils efficaces qui vous font gagner du temps ou de l’argent.' },
            { titre: 'Bryan Morin', avatar: 'bryan', texte: 'Commercial. C’est moi qui vous appelle et qui vous étonne avec ma sincère envie de vous aider ;)' },
            { titre: 'Anaïs Polo', avatar: 'anais', texte: 'Design. J’étudie le Media & Interaction Design à l’ECAL et j’interviens sur les projets qui demandent un œil neuf.' },
            { titre: 'L’IA', texte: 'Je permets à l’équipe d’aller plus vite, plus loin, et de proposer la meilleure qualité. Je ne suis qu’un outil, mais combinée à leur savoir, on forme la paire <3' },
        ],
    },
    {
        id: 'projets',
        nom: 'Projets',
        cartes: [
            { titre: 'Stidy', mockup: 'stidy', texte: 'Notre propre application, lancée pour l’UNIL et l’EPFL. On lance un chrono, on fait le bilan de sa session de travail et on partage ses efforts avec ses amis. Nous avons gagné 10’000 CHF grâce au programme Ucreat pour travailler sur ce projet. Son développement terminé, nous travaillons aujourd’hui à sa diffusion. En ligne et gratuite : n’hésitez pas à la tester.', liens: [{ href: 'https://stidy-app.com', texte: 'stidy-app.com', externe: true }] },
            { titre: 'Zinéma', mockup: 'zinema', texte: 'Un cinéma singulier, à l’ambiance intimiste et à la programmation originale. Nous avons fait des affiches la page d’accueil. Simple, efficace et inspiré des tableaux de Mondrian, ce site est devenu un vrai outil de vente et de gestion. Avec un outil de gestion développé sur mesure, des tâches chronophages de plusieurs heures sont devenues un jeu d’enfant de quelques secondes.', liens: [{ href: 'https://zinema.ch', texte: 'zinema.ch', externe: true }] },
            { titre: 'Le P’tit Central', mockup: 'central', texte: 'Les gens veulent savoir : c’est ouvert ? On mange quoi ? La réponse s’affiche sur un fond d’azulejos, la signature du café.', liens: [{ href: 'https://lepetitcentral.ch', texte: 'lepetitcentral.ch', externe: true }] },
            { titre: 'Artisano', mockup: 'artisano', texte: 'Trouver un artisan de confiance près de chez soi. Et pour l’artisan, ses devis et ses factures, automatiquement. En développement, bêta ouverte.', liens: [{ href: 'https://artisano-one.vercel.app', texte: 'artisano-one.vercel.app', externe: true }] },
            { titre: 'LE MEMO', mockup: 'memo', texte: 'Un label tout frais qui gère déjà les artistes émergents les plus suivis du moment. Son site s’ouvre sur un séquenceur : à vous de jouer.', liens: [{ href: 'https://le-memo.ch', texte: 'le-memo.ch', externe: true }] },
            { titre: 'Maison Alliani', mockup: 'alliani', texte: 'Le grillz, c’est de la joaillerie. Chaque pièce est montrée comme un bijou.', liens: [{ href: 'https://maison-alliani.com', texte: 'maison-alliani.com', externe: true }] },
            { titre: 'Amarte Studio', mockup: 'amarte', texte: 'Beaucoup viennent pour un premier cours. Le site est pensé pour en convertir un maximum.', liens: [{ href: 'https://amarte.ch', texte: 'amarte.ch', externe: true }] },
            { titre: 'Nadège Mouine', mockup: 'nadege', texte: 'Une architecte dont les projets doivent passer avant tout. L’interface s’efface.', liens: [{ href: 'https://nadegemouine.ch', texte: 'nadegemouine.ch', externe: true }] },
            { titre: 'LAZIZZE DJ', mockup: 'dj', texte: 'Un DJ lausannois qui voulait une interface à l’image de son style, pour transmettre facilement son presskit. (Le DJ, c’est Eliott.)', liens: [{ href: 'https://lazizze.com', texte: 'lazizze.com', externe: true }] },
            { titre: 'La Slack', mockup: 'slack', texte: 'Un bureau, avec des dossiers à ouvrir pour découvrir son travail.', liens: [{ href: 'https://la-slack.com', texte: 'la-slack.com', externe: true }] },
        ],
    },
    {
        id: 'services',
        nom: 'Services',
        cartes: [
            { titre: 'Nos services', texte: 'Nous proposons plusieurs services pour vous faire gagner du temps, de l’argent ou de la visibilité.' },
            { titre: 'Interface', prix: 'Selon le niveau d’interaction souhaité', texte: 'Un site internet ou une application : nous cherchons à créer des expériences uniques et originales.' },
            { titre: 'Outils', prix: '2’500 à 7’000 CHF', texte: 'Des outils sur mesure pour la formation, la gestion de vos équipes ou la vente : nous réfléchissons ensemble à ce qui vous sera utile pour développer votre activité.' },
            { titre: 'Expérience complète', prix: 'dès 7’000 CHF', texte: 'Des interfaces, des outils et une nouvelle image : nous nous chargeons de tout pour faire grandir votre activité.' },
            { titre: 'Ce qui vous appartient après notre passage ?', texte: 'Tout. Pas de frais mensuels de notre part, et nous faisons en sorte que vous puissiez tout gérer en autonomie. Nous répondrons toujours à vos demandes, même des années après la fin de notre collaboration. Nous en sommes convaincus : un client satisfait est notre meilleure publicité.' },
        ],
    },
    {
        id: 'contact',
        nom: 'Contact',
        cartes: [
            {
                titre: 'Écrivez-nous.',
                texte: 'Trois champs obligatoires, le reste si vous voulez. Nous répondons sous 24 h ouvrées par mail, et tout de suite par téléphone.',
                formulaire: true,
            },
        ],
    },
];
