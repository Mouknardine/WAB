// @ts-check
/**
 * WAB. — Ce qui ne s'anime qu'à l'écran
 * Pose .is-visible sur chaque élément [data-watch] quand il entre à
 * l'écran. Avec data-watch="once", la classe reste ; sans valeur,
 * elle part quand l'élément sort — la capture qui défile dans la
 * fenêtre de l'application ne tourne ainsi que lorsqu'on la voit.
 *
 * Sans IntersectionObserver, tout est montré d'emblée.
 */

export function initWatch() {
    const targets = Array.from(document.querySelectorAll('[data-watch]'));
    if (!targets.length) return;

    if (!('IntersectionObserver' in window)) {
        targets.forEach((el) => el.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const el = entry.target;
            const once = el.getAttribute('data-watch') === 'once';
            if (entry.isIntersecting) {
                el.classList.add('is-visible');
                if (once) observer.unobserve(el);
            } else if (!once) {
                el.classList.remove('is-visible');
            }
        });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });

    targets.forEach((el) => observer.observe(el));
}
