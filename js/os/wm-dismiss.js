// @ts-check
/**
 * WAB OS — refermer d'un geste
 * — Au téléphone, toute feuille se referme en la tirant vers le bas :
 *   par sa barre, ou par son contenu quand il est déjà en haut. Lâchée
 *   trop tôt, elle remonte à sa place.
 * — Une fenêtre « à congédier » (la fiche projet) se referme aussi
 *   d'un clic à côté : sur la page, ou sur le voile de la feuille.
 *   Un clic dans la barre de menus, le dock ou une autre fenêtre ne
 *   la ferme pas : ce sont des outils, pas « à côté ».
 */

const SLOP = 8;
const DISTANCE = 0.22;
const SPEED = 0.6;
const CHROME = 'dialog, .menubar, .dock, .os-menu';
const calm = window.matchMedia('(prefers-reduced-motion: reduce)');

/**
 * @typedef {object} Target
 * @property {HTMLDialogElement} el
 * @property {() => boolean} isSheet
 * @property {() => boolean} isActive  la fenêtre est la plus en avant
 * @property {() => HTMLElement | null} opener
 * @property {() => void} close
 */

/**
 * Un élément défilant entre le doigt et la feuille a-t-il déjà
 * défilé ? Alors le geste vers le bas sert à remonter, pas à fermer.
 * @param {EventTarget | null} start
 * @param {HTMLElement} root
 */
function scrolledAbove(start, root) {
    let node = start instanceof Element ? start : null;
    while (node && node !== root) {
        if (node.scrollTop > 0) return true;
        node = node.parentElement;
    }
    return false;
}

/** @param {HTMLElement} el @param {number} dy */
function follow(el, dy) {
    el.style.transition = 'none';
    el.style.transform = `translateY(${Math.max(0, dy)}px)`;
}

/**
 * @param {HTMLElement} el
 * @param {string} transform
 * @param {() => void} [done]
 */
function settle(el, transform, done) {
    if (calm.matches) {
        el.style.transform = '';
        done?.();
        return;
    }
    el.style.transition = 'transform var(--dur-2) var(--ease-out)';
    el.style.transform = transform;
    el.addEventListener('transitionend', () => {
        el.style.transition = '';
        if (!done) el.style.transform = '';
        done?.();
    }, { once: true });
}

/** @param {Target} target */
function swipeToClose(target) {
    const { el } = target;
    /** @type {{ y: number, x: number, t: number, live: boolean } | null} */
    let drag = null;

    el.addEventListener('touchstart', (event) => {
        if (!target.isSheet() || event.touches.length !== 1) return;
        if (scrolledAbove(event.target, el)) return;
        const touch = event.touches[0];
        drag = { y: touch.clientY, x: touch.clientX, t: event.timeStamp, live: false };
    }, { passive: true });

    el.addEventListener('touchmove', (event) => {
        if (!drag) return;
        const touch = event.touches[0];
        const dy = touch.clientY - drag.y;
        const dx = touch.clientX - drag.x;
        if (!drag.live) {
            if (dy <= 0 || Math.abs(dx) > dy) {
                if (Math.hypot(dx, dy) >= SLOP) drag = null;
                return;
            }
            // Vers le bas, contenu en haut : le geste est à nous dès le
            // premier pixel, sinon Safari le donne au défilement.
            event.preventDefault();
            if (dy < SLOP) return;
            drag.live = true;
        }
        event.preventDefault();
        follow(el, dy - SLOP);
    }, { passive: false });

    const release = (/** @type {TouchEvent} */ event) => {
        if (!drag) return;
        const { live, y, t } = drag;
        drag = null;
        if (!live) return;
        const dy = (event.changedTouches[0]?.clientY ?? y) - y;
        const speed = dy / Math.max(1, event.timeStamp - t);
        if (dy > el.offsetHeight * DISTANCE || speed > SPEED) {
            settle(el, 'translateY(100%)', target.close);
        } else {
            settle(el, 'translateY(0)');
        }
    };
    el.addEventListener('touchend', release);
    el.addEventListener('touchcancel', release);
}

/**
 * Le clic « à côté ». Il doit commencer et finir hors de la fenêtre :
 * une sélection de texte qui déborde ne ferme rien.
 * @param {Target} target
 * @returns {() => void}  retire l'écoute
 */
function clickAway(target) {
    const { el } = target;
    let armed = false;

    /** @param {MouseEvent} event */
    const outside = (event) => {
        if (event.target === el) {
            const box = el.getBoundingClientRect();
            return event.clientY < box.top || event.clientY > box.bottom
                || event.clientX < box.left || event.clientX > box.right;
        }
        if (!(event.target instanceof Element)) return false;
        if (event.target.closest(CHROME)) return false;
        const opener = target.opener();
        return !(opener && opener.contains(event.target));
    };

    /** @param {PointerEvent} event */
    const down = (event) => {
        armed = el.open && target.isActive() && event.button === 0 && outside(event);
    };
    /** @param {MouseEvent} event */
    const up = (event) => {
        if (!armed) return;
        armed = false;
        if (outside(event)) target.close();
    };

    document.addEventListener('pointerdown', down, true);
    document.addEventListener('click', up, true);
    return () => {
        document.removeEventListener('pointerdown', down, true);
        document.removeEventListener('click', up, true);
    };
}

/**
 * @param {Target} target
 * @param {boolean} dismissible
 * @returns {() => void}  à appeler à la fermeture
 */
export function makeDismissible(target, dismissible) {
    swipeToClose(target);
    return dismissible ? clickAway(target) : () => {};
}
