import { creerInstrument } from './instrument.js';
import { compositionAccueil, compositionHasard, compositionOuverture } from './composition.js';
import { fabriquer } from './gestes.js';
import { relierClavier } from './controles.js';
import { creerTouchesDessinees } from './touches-dessinees.js';
import { activerAppuiTactile, relierAppuis } from './toucher.js';
import { relierPointeur } from './pointeur.js';
import { creerAnnonce } from './annonce.js';
import { creerPilote } from './pilote.js';
import { mouvementReduit, petitEcran } from './jetons.js';
import { creerSurprises } from './surprises.js';
import { creerEcritures } from './ecritures.js';
import { creerCartes } from './cartes.js';

const POLICE_MACHINE = '700 40px Sligoil';
// Le mot qui salue la vague, puis un message tous les trois gestes environ
const MESSAGE_OUVERTURE = 'Magnifique.';
const CHANCE_MESSAGE_PILOTE = 0.35;

/**
 * @template {Element} T
 * @param {string} selecteur
 * @param {new () => T} type
 * @returns {T}
 */
function trouver(selecteur, type) {
    const element = document.querySelector(selecteur);
    if (!(element instanceof type)) throw new Error(`Élément introuvable : ${selecteur}`);
    return element;
}

async function demarrer() {
    const toile = trouver('#toile', HTMLCanvasElement);
    const annonce = creerAnnonce(trouver('#annonce', HTMLElement));

    // Les lettres sont dessinées avec la police : on l'attend, sans bloquer si elle manque.
    await document.fonts.load(POLICE_MACHINE).catch(() => []);

    // Les écritures suivent chaque peinture de la grille ; si leur calque
    // manque, l'instrument joue sans elles.
    /** @type {import('./ecritures.js').Ecritures | null} */
    let ecritures = null;
    const instrument = creerInstrument(toile, {
        apresPeinture: () => ecritures?.mettreAJour(),
        surGestes: (gestes) => ecritures?.proteger(gestes),
    });
    try {
        ecritures = creerEcritures(trouver('#ecritures', HTMLCanvasElement), instrument, mouvementReduit());
    } catch {
        ecritures = null;
    }
    document.documentElement.setAttribute('data-instrument', 'pret');

    const { surprendre, message } = creerSurprises({
        calque: trouver('#surprises', HTMLElement),
        toileBillets: trouver('#billets', HTMLCanvasElement),
    });

    // À l'arrivée, la vague se forme puis WAB se pose ; le pilote prend la
    // main ensuite. En mouvement réduit, l'image d'accueil est posée
    // d'un coup et reste figée.
    /** @type {import('./pilote.js').Pilote | null} */
    let pilote = null;
    if (mouvementReduit()) instrument.poser(compositionAccueil(instrument.dimensions()));
    else {
        const ouverture = compositionOuverture(performance.now(), instrument.dimensions());
        instrument.jouer(ouverture.gestes);
        window.setTimeout(() => {
            message(MESSAGE_OUVERTURE);
            pilote = creerPilote(instrument, () => ecritures?.vivre(), () => {
                if (Math.random() < CHANCE_MESSAGE_PILOTE) message();
            });
        }, ouverture.duree);
    }
    const interrompre = () => pilote?.interrompre();


    const actions = {
        surprendre,
        jouer(/** @type {import('./gestes-dessin.js').Geste[]} */ gestes) {
            interrompre();
            instrument.jouer(gestes);
        },
        signaler: annonce.signaler,
        dimensions: () => instrument.dimensions(),
        effacer() {
            interrompre();
            instrument.jouer([fabriquer('effacer', { x: 0.5, y: 0.5 }, Math.random, performance.now())]);
            annonce.dire('Tout s’envole : l’écran est vide.');
        },
        enfoncer: creerTouchesDessinees(),
        composer() {
            interrompre();
            instrument.vider();
            instrument.jouer(compositionHasard(performance.now(), instrument.dimensions()));
            annonce.dire('Nouvelle composition au hasard.');
        },
    };

    relierClavier(actions);
    relierPointeur(toile, actions);
    activerAppuiTactile();
    relierAppuis();
}

/**
 * Les cartes ne dépendent pas de l'instrument : elles marchent même s'il
 * ne démarre pas. Au bureau, on sait tout de suite qui on est : la
 * paquet « Nous » est déjà ouvert sur sa première carte.
 */
function demarrerCartes() {
    const cartes = creerCartes(trouver('#cartes', HTMLElement));
    if (!petitEcran()) cartes.ouvrir('nous', { focus: false });
}

// Si l'instrument ne démarre pas (canvas indisponible), les textes, le
// contact et les cartes restent en place : la page reste utile.
demarrer().catch(() => {
    document.documentElement.setAttribute('data-instrument', 'indisponible');
}).finally(() => {
    try {
        demarrerCartes();
    } catch {
        document.documentElement.setAttribute('data-cartes', 'indisponibles');
    }
});
