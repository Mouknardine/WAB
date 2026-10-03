// @ts-check
/**
 * WAB OS — la charpente d'une fenêtre
 * Construit le <dialog> d'une fenêtre (barre de verre, trois
 * pastilles qui sont de vrais boutons — fermer, réduire, agrandir —,
 * titre, contenu) et le déplacement par la barre. Tout le texte passe par textContent.
 */

let uid = 0;

/**
 * @typedef {object} Frame
 * @property {HTMLDialogElement} el
 * @property {HTMLElement} bar
 * @property {HTMLElement} body
 * @property {HTMLButtonElement} close
 * @property {HTMLButtonElement} min
 * @property {HTMLButtonElement} max
 * @property {HTMLElement} titleText
 */

/**
 * @param {string} label
 * @param {string} modifier
 * @returns {HTMLButtonElement}
 */
function control(label, modifier) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `oswin__ctl oswin__ctl--${modifier}`;
    button.setAttribute('aria-label', label);
    return button;
}

/**
 * @param {{ title: string, icon: string, size: string }} spec
 * @returns {Frame}
 */
export function buildFrame(spec) {
    uid += 1;
    const titleId = `oswin-title-${uid}`;

    const el = document.createElement('dialog');
    el.className = `oswin oswin--${spec.size}`;
    el.setAttribute('aria-labelledby', titleId);
    el.tabIndex = -1;

    const bar = document.createElement('div');
    bar.className = 'oswin__bar';

    const controls = document.createElement('div');
    controls.className = 'oswin__ctls';
    const close = control('Fermer la fenêtre', 'close');
    const min = control('Réduire dans le dock', 'min');
    const max = control('Agrandir la fenêtre', 'max');
    max.setAttribute('aria-pressed', 'false');
    controls.append(close, min, max);

    const title = document.createElement('p');
    title.className = 'oswin__title';
    title.id = titleId;
    const icon = document.createElement('span');
    icon.className = `sym sym--${spec.icon}`;
    icon.setAttribute('aria-hidden', 'true');
    const titleText = document.createElement('span');
    titleText.textContent = spec.title;
    title.append(icon, titleText);

    bar.append(controls, title);

    const body = document.createElement('div');
    body.className = 'oswin__body';

    el.append(bar, body);
    return { el, bar, body, close, min, max, titleText };
}

/**
 * Le déplacement par la barre, à la souris comme au doigt. Le
 * script ne touche que `translate` : l'ouverture anime `scale`.
 * @param {HTMLElement} bar
 * @param {object} hooks
 * @param {() => boolean} hooks.canMove
 * @param {() => { x: number, y: number }} hooks.get
 * @param {(x: number, y: number) => void} hooks.set
 * @param {() => void} hooks.onStart
 */
export function makeMovable(bar, hooks) {
    bar.addEventListener('pointerdown', (down) => {
        if (down.button !== 0 || !hooks.canMove()) return;
        if (down.target instanceof Element && down.target.closest('button')) return;
        down.preventDefault();
        const start = hooks.get();
        let moved = false;
        bar.setPointerCapture(down.pointerId);

        /** @param {PointerEvent} move */
        const onMove = (move) => {
            const dx = move.clientX - down.clientX;
            const dy = move.clientY - down.clientY;
            if (!moved && Math.hypot(dx, dy) < 3) return;
            if (!moved) hooks.onStart();
            moved = true;
            hooks.set(start.x + dx, start.y + dy);
        };
        const onEnd = () => {
            bar.removeEventListener('pointermove', onMove);
            bar.removeEventListener('pointerup', onEnd);
            bar.removeEventListener('pointercancel', onEnd);
            if (bar.hasPointerCapture(down.pointerId)) bar.releasePointerCapture(down.pointerId);
        };
        bar.addEventListener('pointermove', onMove);
        bar.addEventListener('pointerup', onEnd);
        bar.addEventListener('pointercancel', onEnd);
    });
}
