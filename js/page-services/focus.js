// @ts-check
/**
 * Services — le bloc courant
 * Le bloc qui traverse le milieu de l'écran reçoit .is-current : la
 * frappe (page-services-typing.css) ne s'anime que sur lui. Une bande
 * fine au centre de l'écran sert de repère : un seul bloc la touche à
 * la fois. L'arrivée des blocs, elle, est en CSS
 * (page-services-feats.css).
 */

const ROOT = '[data-svc-feats]';
const FEAT = '.svc-feat';

export function initFocus() {
    if (!('IntersectionObserver' in window)) return;
    const roots = Array.from(document.querySelectorAll(ROOT)).filter(
        /** @returns {el is HTMLElement} */ (el) => el instanceof HTMLElement,
    );
    if (!roots.length) return;

    const feats = roots.flatMap((root) => Array.from(root.querySelectorAll(FEAT)));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            feats.forEach((feat) => feat.classList.toggle('is-current', feat === entry.target));
        });
    }, { rootMargin: '-48% 0px -48% 0px' });

    feats.forEach((feat) => observer.observe(feat));
}
