/**
 * Safari iOS ne rabat sa barre d'adresse que si la page défile sous le
 * doigt. Au téléphone, la page est donc bien plus haute que l'écran
 * (css/mobile.css). Tant que la barre est sortie, la grille laisse passer
 * le glissé vertical pour faire défiler la page et rabattre la barre ;
 * dès qu'elle est rabattue, la grille reprend tout le doigt pour dessiner.
 *
 * On ne se fie pas au seul défilement : Safari peut ressortir sa barre
 * (toucher le bas de l'écran, clavier, retour en haut) sans que la page
 * bouge. On compare donc la hauteur visible à la hauteur de l'écran barre
 * rabattue (100lvh) : la grille ne bloque le défilement que si la barre
 * est réellement rabattue.
 */

const RACINE = document.documentElement;
/** Écart toléré (px) entre la hauteur visible et 100lvh, barre rabattue. */
const TOLERANCE = 24;

/** Un repère invisible de la hauteur de l'écran barre rabattue. */
function creerRepere() {
    const repere = document.createElement('div');
    repere.setAttribute('aria-hidden', 'true');
    repere.style.cssText = 'position:fixed;top:0;left:0;width:0;height:100lvh;visibility:hidden;pointer-events:none';
    document.body.append(repere);
    return repere;
}

/** @param {HTMLElement} repere */
function barreRabattue(repere) {
    const hauteurMax = repere.offsetHeight;
    if (hauteurMax === 0) return false;
    return window.scrollY > 0 && hauteurMax - window.innerHeight <= TOLERANCE;
}

/** Suit la barre de Safari (écouteurs passifs, sans effet sur les gestes). */
export function relierBarreSafari() {
    const repere = creerRepere();
    const noter = () => {
        if (barreRabattue(repere)) RACINE.dataset.barre = 'rabattue';
        else delete RACINE.dataset.barre;
    };
    noter();
    window.addEventListener('scroll', noter, { passive: true });
    window.addEventListener('resize', noter, { passive: true });
    window.visualViewport?.addEventListener('resize', noter, { passive: true });
}
