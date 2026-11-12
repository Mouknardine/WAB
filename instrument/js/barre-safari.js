/**
 * Safari iOS ne rabat sa barre d'adresse que si la page défile sous le
 * doigt. Au téléphone, la page est donc plus haute que l'écran
 * (css/mobile.css) et la grille laisse passer le premier glissé vertical
 * pour faire défiler. Dès que la page a défilé, on le note sur <html> :
 * la grille reprend alors tout le doigt et sert de nouveau à dessiner.
 */

const RACINE = document.documentElement;

function noterDefilement() {
    if (window.scrollY > 0) RACINE.dataset.barre = 'rabattue';
    else delete RACINE.dataset.barre;
}

/** Suit le défilement de la page (écouteur passif, sans effet sur le geste). */
export function relierBarreSafari() {
    noterDefilement();
    window.addEventListener('scroll', noterDefilement, { passive: true });
}
