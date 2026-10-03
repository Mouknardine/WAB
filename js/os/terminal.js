// @ts-check
/**
 * WAB OS — le Terminal
 * Une petite fenêtre sombre où l'on tape aide, projets, services,
 * equipe, contact, heure. La saisie est bornée et nettoyée (caractères
 * de contrôle retirés, 60 signes au plus), et tout s'affiche par
 * textContent : rien de tapé n'est jamais interprété comme du HTML.
 * Flèches haut et bas : les commandes précédentes. Un oiseau se pose
 * sur la barre.
 */

import { openWindow } from './wm.js?v=1';
import { el } from './dom.js?v=2';
import { openContact } from './actions.js?v=1';
import { report } from './lazy.js?v=1';
import { run } from './terminal-commands.js?v=1';
import { launchCase } from './apps.js?v=2';

const MAX_INPUT = 60;
const MAX_LINES = 240;
const PROMPT = 'invite@wab ~ %';

/**
 * @param {string} raw
 * @returns {{ name: string, arg: string, shown: string }}
 */
export function parse(raw) {
    const shown = raw.normalize('NFC').replace(/[\u0000-\u001f\u007f-\u009f]/g, '').trim().slice(0, MAX_INPUT);
    const [word = '', ...rest] = shown.split(/\s+/);
    const name = word.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    return { name, arg: rest.join(' '), shown };
}

/** @param {HTMLElement} log */
function makePrinter(log) {
    /** @param {string | string[]} lines @param {'muted' | 'accent' | 'error'} [tone] */
    return (lines, tone) => {
        (Array.isArray(lines) ? lines : [lines]).forEach((line) => {
            log.append(el('p', tone ? `term__line term__line--${tone}` : 'term__line', line));
        });
        while (log.childElementCount > MAX_LINES) log.firstElementChild?.remove();
        log.scrollTop = log.scrollHeight;
    };
}

/** Un oiseau posé sur la barre de la fenêtre. */
/** @param {HTMLElement} host */
async function perchBird(host) {
    const bird = el('canvas', 'win-perch oswin__perch');
    bird.dataset.perch = 'fly';
    bird.dataset.scale = '2';
    bird.dataset.color = '4';
    bird.setAttribute('aria-hidden', 'true');
    host.append(bird);
    try {
        const { setupPerch } = await import('../birds/perch.js?v=8');
        setupPerch(bird);
    } catch (error) {
        bird.remove();
        report('terminal-bird', error);
    }
}

/** @param {import('./wm.js').OsWindow} win */
function build(win) {
    const term = el('div', 'term');
    const log = el('div', 'term__log');
    log.setAttribute('role', 'log');
    log.setAttribute('aria-live', 'polite');
    log.setAttribute('aria-label', 'Sortie du terminal');
    const print = makePrinter(log);

    const form = el('form', 'term__form');
    const label = el('label', 'term__prompt', PROMPT);
    const input = el('input', 'term__input');
    input.id = `term-input-${Date.now()}`;
    input.name = 'commande';
    label.htmlFor = input.id;
    Object.assign(input, { type: 'text', maxLength: MAX_INPUT, autocomplete: 'off', spellcheck: false, enterKeyHint: 'send' });
    input.setAttribute('autocapitalize', 'none');
    input.setAttribute('aria-describedby', `${input.id}-hint`);
    const hint = el('span', 'sr-only', 'Tapez une commande puis Entrée. Tapez aide pour la liste.');
    hint.id = `${input.id}-hint`;
    form.append(label, input, hint);

    /** @type {string[]} */
    const history = [];
    let cursor = 0;

    /** @type {import('./terminal-commands.js').TermIO} */
    const io = {
        print,
        clear: () => log.replaceChildren(),
        contact: openContact,
        openCase: (id, title) => launchCase(id, title, input),
    };

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const { name, arg, shown } = parse(input.value);
        input.value = '';
        if (!shown) return;
        history.push(shown);
        cursor = history.length;
        print(`${PROMPT} ${shown}`, 'muted');
        run(name, arg, io).catch((error) => {
            report('terminal', error);
            print('Quelque chose a coincé. Réessayez.', 'error');
        });
    });

    input.addEventListener('keydown', (event) => {
        if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
        event.preventDefault();
        cursor = Math.min(history.length, Math.max(0, cursor + (event.key === 'ArrowUp' ? -1 : 1)));
        input.value = history[cursor] ?? '';
    });

    term.addEventListener('click', (event) => {
        // Un clic dans le vide rend la main au champ, sauf si l'on
        // vient de sélectionner du texte pour le copier.
        if (!window.getSelection()?.isCollapsed) return;
        if (event.target === term || event.target === log) input.focus();
    });

    print(['WAB OS, Terminal.', 'Tapez aide pour commencer.'], 'accent');
    term.append(log, form);
    win.body.append(term);
    perchBird(win.el);
}

/** @param {HTMLElement | null} opener */
export function openTerminal(opener) {
    openWindow({
        id: 'terminal',
        title: 'Terminal',
        icon: 'terminal',
        app: 'terminal',
        size: 'sm',
        opener,
        build,
        focus: (win) => win.body.querySelector('.term__input'),
    });
}
