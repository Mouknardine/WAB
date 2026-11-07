/**
 * Les textes des cartes : qui on est, nos projets, nos prix, le contact.
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
 * @typedef {{ id: string, nom: string, teinte: string, cartes: Carte[] }} Rubrique
 */

/** @type {Rubrique[]} */
export const RUBRIQUES = [
    {
        id: 'nous',
        nom: 'Nous',
        teinte: 'rose',
        cartes: [
            { titre: 'On est quatre, à Lausanne.', texte: 'WeAreBrothers, c’est un studio fondé par deux frères, Eliott et Matt Pina. On dessine des interfaces et on les code nous-mêmes. Pas de gabarit, pas de WordPress, pas de Wix.' },
            { titre: 'Eliott Pina', avatar: 'eliott', texte: 'Design et direction artistique. Bachelor en droit, master en systèmes d’information en cours : le cadre juridique de votre projet est réglé avant la première ligne de code.' },
            { titre: 'Matt Pina', avatar: 'matt', texte: 'Développement, de l’architecture à la mise en ligne. Il travaille aussi au Centre Patronal : il sait comment tournent les entreprises vaudoises.' },
            { titre: 'Bryan Morin', avatar: 'bryan', texte: 'Relation client. C’est lui qui vous répond et qui suit votre projet, du premier appel au lancement.' },
            { titre: 'Anaïs Polo', avatar: 'anais', texte: 'Web design. Elle étudie le Media & Interaction Design à l’ECAL.' },
            { titre: 'Et l’IA ?', texte: 'On s’en sert, franchement. Pour explorer plus de pistes en moins de temps, et pour automatiser ce qui vous prend des heures. Elle ne décide pas à notre place, et on ne vous la vend pas là où elle ne sert à rien.' },
        ],
    },
    {
        id: 'projets',
        nom: 'Projets',
        teinte: 'bleu',
        cartes: [
            { titre: 'Stidy', mockup: 'stidy', texte: 'Notre propre application, lancée pour l’UNIL et l’EPFL. On lance un chrono avant de poser son téléphone : les amis voient l’effort, jamais les notes. En ligne, gratuite.', liens: [{ href: 'https://stidy-app.com', texte: 'stidy-app.com', externe: true }] },
            { titre: 'Zinéma', mockup: 'zinema', texte: 'Un cinéma d’art et essai dont la programmation change chaque semaine. On a fait des affiches la page d’accueil.', liens: [{ href: 'https://zinema.ch', texte: 'zinema.ch', externe: true }] },
            { titre: 'Le P’tit Central', mockup: 'central', texte: 'Les gens veulent savoir : c’est ouvert ? On mange quoi ? La réponse est en haut de la page.', liens: [{ href: 'https://lepetitcentral.ch', texte: 'lepetitcentral.ch', externe: true }] },
            { titre: 'Artisano', mockup: 'artisano', texte: 'Trouver un artisan de confiance près de chez soi. Et pour l’artisan, ses devis et ses factures depuis le chantier. En développement, bêta ouverte.', liens: [{ href: 'https://artisano-one.vercel.app', texte: 'artisano-one.vercel.app', externe: true }] },
            { titre: 'LE MEMO', mockup: 'memo', texte: 'Un collectif, pas une entreprise. Son site s’ouvre sur une boîte à rythmes qu’on joue.', liens: [{ href: 'https://le-memo.ch', texte: 'le-memo.ch', externe: true }] },
            { titre: 'Maison Alliani', mockup: 'alliani', texte: 'Le grillz, c’est de la joaillerie. Chaque pièce est montrée comme un bijou.', liens: [{ href: 'https://maison-alliani.com', texte: 'maison-alliani.com', externe: true }] },
            { titre: 'Amarte Studio', mockup: 'amarte', texte: 'Beaucoup viennent pour un premier cours. Deux boutons : première fois, ou réserver.', liens: [{ href: 'https://amarte.ch', texte: 'amarte.ch', externe: true }] },
            { titre: 'Nadège Mouine', mockup: 'nadege', texte: 'Une architecte dont les projets doivent passer avant tout. L’interface s’efface.', liens: [{ href: 'https://nadegemouine.ch', texte: 'nadegemouine.ch', externe: true }] },
            { titre: 'LAZIZZE DJ', mockup: 'dj', texte: 'Un DJ, ça s’écoute d’abord. Le ton est donné en une seconde.', liens: [{ href: 'https://lazizze.com', texte: 'lazizze.com', externe: true }] },
            { titre: 'La Slack', mockup: 'slack', texte: 'Trois disciplines, un seul menu ? Non : un bureau, avec des dossiers à ouvrir.', liens: [{ href: 'https://la-slack.com', texte: 'la-slack.com', externe: true }] },
            { titre: 'Commissione Entretien', mockup: 'commissione', texte: 'On les appelle dans l’urgence. Le numéro reste toujours sous le pouce.', liens: [{ href: 'https://commissione-entretien.ch', texte: 'commissione-entretien.ch', externe: true }] },
        ],
    },
    {
        id: 'services',
        nom: 'Services',
        teinte: 'jaune',
        cartes: [
            { titre: 'Nos prix sont affichés.', texte: 'Parce qu’un devis surprise, personne n’aime ça. Paiement en plusieurs fois possible.' },
            { titre: 'Site vitrine', prix: '1’000 à 2’500 CHF', texte: 'L’essentiel, codé à la main. Livré en 3 à 6 semaines.' },
            { titre: 'Site et outils', prix: '2’500 à 7’000 CHF', texte: 'Votre site et vos outils de gestion, enfin reliés. Boutique en ligne en option. Automatisation et IA là où elles vous font gagner du temps.' },
            { titre: 'Sur mesure', prix: 'dès 7’000 CHF', texte: 'Une pièce unique, de la marque au site. Sur devis, après un premier échange.' },
            { titre: 'Ce qui est à vous', texte: 'Le domaine, le code et les contenus vous appartiennent. Hébergement en Suisse, chez Infomaniak.' },
        ],
    },
    {
        id: 'contact',
        nom: 'Contact',
        teinte: 'vert',
        cartes: [
            {
                titre: 'Écrivez-nous.',
                texte: 'Trois champs obligatoires, le reste si vous voulez. On répond sous 24 h ouvrées.',
                formulaire: true,
            },
        ],
    },
];
