// @ts-check
/**
 * WAB OS — le sommaire de la page, dans le dock
 * Sur une page qui a un dock en sommaire ([data-toc], os-dock-toc.css) :
 * l'entrée de la section qu'on lit prend aria-current="location", et
 * le trait de lecture (--read, de 0 à 1) suit le défilement. Un seul
 * calcul par image. Sans ce script, les entrées restent des ancres.
 */

/** Bande de l'écran, vers le tiers haut, où une section compte comme « lue ». */
const READING_BAND = '-35% 0px -60% 0px';

export function initToc() {
    const toc = document.querySelector('[data-toc]');
    if (!(toc instanceof HTMLElement)) return;

    /** @type {Map<Element, HTMLAnchorElement>} */
    const links = new Map();
    toc.querySelectorAll('a[href^="#"]').forEach((link) => {
        const section = document.getElementById(link.getAttribute('href')?.slice(1) ?? '');
        if (section && link instanceof HTMLAnchorElement) links.set(section, link);
    });
    if (!links.size) return;

    /** @param {HTMLAnchorElement | null} current */
    function mark(current) {
        links.forEach((link) => {
            if (link === current) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
        });
    }

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            const seen = entries.filter((entry) => entry.isIntersecting);
            if (seen.length) mark(links.get(seen[seen.length - 1].target) ?? null);
        }, { rootMargin: READING_BAND });
        links.forEach((_, section) => observer.observe(section));
    }

    // Au tout premier écran, aucune section n'est encore lue.
    const first = links.keys().next().value;

    let pending = false;
    function measure() {
        pending = false;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        toc.style.setProperty('--read', max > 0 ? String(Math.min(1, window.scrollY / max)) : '0');
        if (first instanceof Element && first.getBoundingClientRect().top > window.innerHeight * 0.4) mark(null);
    }

    window.addEventListener('scroll', () => {
        if (pending) return;
        pending = true;
        window.requestAnimationFrame(measure);
    }, { passive: true });
    measure();
}
