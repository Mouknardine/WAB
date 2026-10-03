// @ts-check
/**
 * WAB OS — les projets du studio
 * La source unique reste la page Work : on la lit une fois, à la
 * première fenêtre qui en a besoin, et on en extrait chaque projet
 * (nom, contexte, disciplines, capture, photo, description,
 * démarche, adresse du site). Rien n'est recopié dans l'accueil.
 *
 * On ne garde que du texte et des adresses vérifiées : aucun bout de
 * HTML de la page lue n'est réinjecté tel quel.
 */

const SOURCE = '/realisations';

/**
 * @typedef {object} Picture
 * @property {string} src
 * @property {string} srcset
 * @property {string} alt
 */

/**
 * @typedef {object} Project
 * @property {string} id
 * @property {string} name
 * @property {string} context
 * @property {string[]} tags
 * @property {string} href      le site du client
 * @property {string} domain
 * @property {Picture} shot     la capture 16:10
 * @property {Picture} photo    la photo 4:5 de la fiche
 * @property {string[]} summary
 * @property {Array<{ term: string, text: string }>} approach
 */

/** @type {Promise<Project[]> | null} */
let pending = null;

/** @param {Element | null} el */
function text(el) {
    // Seuls les blancs ordinaires se resserrent : les espaces
    // insécables de la page (avant : ; ? !) restent en place.
    return el?.textContent?.replace(/[ \t\r\n]+/g, ' ').replace(/^ | $/g, '') ?? '';
}

/**
 * Une image de la page Work : uniquement des fichiers du site.
 * @param {Element | null} img
 * @returns {Picture}
 */
function picture(img) {
    const src = img?.getAttribute('src') ?? '';
    const srcset = img?.getAttribute('srcset') ?? '';
    const local = (/** @type {string} */ value) => /^assets\/[\w./?=-]+$/.test(value);
    const parts = srcset.split(',').map((part) => part.trim()).filter(Boolean);
    return {
        src: local(src) ? src : '',
        srcset: parts.every((part) => local(part.split(/\s+/)[0])) ? parts.join(', ') : '',
        alt: img?.getAttribute('alt') ?? '',
    };
}

/** @param {string} raw @returns {string} */
function safeHref(raw) {
    try {
        const url = new URL(raw);
        return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : '';
    } catch {
        return '';
    }
}

/** @param {Element} piece @returns {Project} */
function parsePiece(piece) {
    const story = piece.querySelector('.piece__case');
    const href = safeHref(piece.querySelector('.piece__link')?.getAttribute('href') ?? '');
    return {
        id: piece.id,
        name: text(piece.querySelector('.piece__name')),
        context: text(piece.querySelector('.piece__context')),
        tags: Array.from(piece.querySelectorAll('.piece__tags li'), text),
        href,
        domain: href ? new URL(href).hostname.replace(/^www\./, '') : '',
        shot: picture(piece.querySelector('.window__img')),
        photo: picture(story?.querySelector('img[data-case-photo]') ?? null),
        summary: Array.from(story?.querySelectorAll('[data-case-summary] p') ?? [], text),
        approach: Array.from(story?.querySelectorAll('[data-case-approach] > div') ?? [], (row) => ({
            term: text(row.querySelector('dt')),
            text: text(row.querySelector('dd')),
        })),
    };
}

/** @returns {Promise<Project[]>} */
async function fetchProjects() {
    const response = await fetch(SOURCE, { credentials: 'same-origin' });
    if (!response.ok) throw new Error(`Page Work indisponible (${response.status})`);
    const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
    const projects = Array.from(doc.querySelectorAll('.piece[id]'))
        .filter((piece) => piece.querySelector('.piece__case'))
        .map(parsePiece)
        .filter((project) => project.name);
    if (!projects.length) throw new Error('Aucun projet trouvé sur la page Work');
    return projects;
}

/**
 * Tous les projets, lus une seule fois. Un échec n'est pas mis en
 * cache : la tentative suivante relit la page.
 * @returns {Promise<Project[]>}
 */
export function loadProjects() {
    pending ??= fetchProjects().catch((error) => {
        pending = null;
        throw error;
    });
    return pending;
}

/**
 * @param {Picture} pic
 * @param {string} sizes
 * @param {string} className
 * @param {[number, number]} ratio  les dimensions natives (16:10, 4:5)
 * @returns {HTMLImageElement}
 */
export function imageFrom(pic, sizes, className, ratio) {
    const img = document.createElement('img');
    img.className = className;
    [img.width, img.height] = ratio;
    img.alt = pic.alt;
    img.decoding = 'async';
    if (pic.srcset) {
        img.srcset = pic.srcset;
        img.sizes = sizes;
    }
    img.src = pic.src;
    return img;
}
