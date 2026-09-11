/**
 * WAB. — Relevé des zones occupées de la page
 *
 * Deux choses intéressent les oiseaux :
 *
 *  — les lignes de texte posées à même le papier. Rien ne les sépare
 *    d'un oiseau qui passe derrière, et les lettres deviennent
 *    illisibles. Ce sont les zones à fuir.
 *
 *  — les blocs à fond plein : cartes, boutons, bandeaux. Ils cachent
 *    déjà l'oiseau, mais un oiseau glissé entre deux cartes n'en
 *    montre qu'une tranche. Ce sont les zones où il ne sert à rien
 *    de voler.
 *
 * Les mesures sont exprimées par rapport au haut du document : elles
 * restent valables pendant tout le défilement et ne sont refaites
 * qu'en cas de changement de mise en page.
 */

/** Au-delà de cette opacité, un fond est considéré comme couvrant. */
const OPAQUE_ENOUGH = 0.6;

/* Une photo ou une vidéo cache autant qu'un aplat, mais son contenu
   n'est pas un fond au sens du CSS : il faut la nommer à part. */
const FILLED_TAGS = new Set(['IMG', 'VIDEO', 'IFRAME', 'PICTURE']);

/* Les balises HTML se nomment en majuscules, les balises SVG en
   minuscules : les deux graphies sont volontaires. */
const IGNORED_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'CANVAS', 'svg', 'text']);

function alphaOf(color) {
    const parts = /^rgba?\(([^)]+)\)$/.exec(color);
    if (!parts) return color === 'transparent' ? 0 : 1;
    const values = parts[1].split(/[,\s/]+/).filter(Boolean);
    return values.length < 4 ? 1 : parseFloat(values[3]);
}

/** Un élément qui flotte au-dessus de la page : sa position mesurée
 *  ne resterait pas valable au défilement, on l'ignore entièrement. */
function isFloating(style) {
    return style.position === 'fixed' || style.position === 'sticky';
}

function isHidden(style) {
    return style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0';
}

function toZone(rect, scrollX, scrollY) {
    return { x: rect.left + scrollX, y: rect.top + scrollY, w: rect.width, h: rect.height };
}

/**
 * Parcourt la page et renvoie ses zones occupées, en coordonnées
 * document : { texts, blocks }.
 */
export function collectZones() {
    const texts = [];
    const blocks = [];
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    // Vrai dès qu'un élément, ou l'un de ses ancêtres, sépare déjà le
    // texte des oiseaux — ou flotte au-dessus de la page.
    const shielded = new Map([[document.body, false]]);

    for (const element of document.body.querySelectorAll('*')) {
        const parent = element.parentElement;
        const covered = parent ? shielded.get(parent) === true : false;
        const style = getComputedStyle(element);

        if (IGNORED_TAGS.has(element.tagName) || isHidden(style)) {
            shielded.set(element, true);
            continue;
        }

        const floating = isFloating(style);
        const opaque = FILLED_TAGS.has(element.tagName)
            || style.backgroundImage !== 'none'
            || alphaOf(style.backgroundColor) >= OPAQUE_ENOUGH;

        if (!covered && !floating && opaque) {
            const rect = element.getBoundingClientRect();
            if (rect.width > 1 && rect.height > 1) blocks.push(toZone(rect, scrollX, scrollY));
        }

        shielded.set(element, covered || floating || opaque);
    }

    const range = document.createRange();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);

    while (walker.nextNode()) {
        const node = walker.currentNode;
        if (!node.nodeValue || !node.nodeValue.trim()) continue;

        const parent = node.parentElement;
        if (!parent || shielded.get(parent) !== false) continue;

        range.selectNodeContents(node);
        for (const rect of range.getClientRects()) {
            if (rect.width < 1 || rect.height < 1) continue;
            texts.push(toZone(rect, scrollX, scrollY));
        }
    }

    return { texts, blocks };
}
