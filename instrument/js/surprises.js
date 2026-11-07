/**
 * Les surprises du visiteur : à chaque touche ou clic court, en plus
 * du geste de pixels. Le plus souvent un message ; parfois le chat
 * (jamais deux fois de suite, 6 actions d'écart au moins) ; parfois une
 * apparition animée (Hello Kitty, les Super Nanas, les cœurs) ; parfois
 * une pluie de billets (environ 1 fois sur 10, et toujours sur Entrée).
 * Le pilote, lui, ne fait surgir que des messages. En mouvement réduit :
 * messages seulement.
 */

import { creerMessages } from './surprise-message.js';
import { creerChat } from './surprise-chat.js';
import { creerApparitions } from './surprise-apparition.js';
import { creerPluie, PLUIE_BILLETS } from './pluie-billets.js';
import { mouvementReduit } from './jetons.js';

// Une fois l'écart de 6 actions passé : en moyenne un chat toutes les 8 à 9 actions.
const CHANCE_CHAT = 0.4;
const ECART_CHAT = 6;
const CHANCE_BILLETS = 1 / 10;
const CHANCE_APPARITION = 1 / 4;

/**
 * @typedef {(options?: { billets?: boolean }) => void} Surprendre
 * @typedef {{ surprendre: Surprendre, message: (texte?: string) => void }} Surprises
 */

/**
 * @param {{ calque: HTMLElement, toileBillets: HTMLCanvasElement }} elements
 * @returns {Surprises}
 */
export function creerSurprises({ calque, toileBillets }) {
    const message = creerMessages(calque);
    const chat = creerChat(calque);
    const apparaitre = creerApparitions(calque);
    const billets = creerPluie(toileBillets, PLUIE_BILLETS);
    let depuisChat = ECART_CHAT;
    let dernier = '';

    /**
     * Joue une surprise qui peut échouer ; un message la remplace alors.
     * @param {string} nom
     * @param {() => Promise<boolean | void>} jouer
     */
    const tenter = (nom, jouer) => {
        dernier = nom;
        jouer().then((ok) => {
            if (ok === false) message();
        }, () => message());
    };

    /** @param {number} chance @param {string} nom */
    const tirer = (chance, nom) => dernier !== nom && Math.random() < chance;

    /** @type {Surprendre} */
    const surprendre = (options = {}) => {
        if (mouvementReduit()) {
            message();
            return;
        }
        depuisChat += 1;
        if (options.billets || Math.random() < CHANCE_BILLETS) {
            tenter('billets', billets);
            if (options.billets) message();
            return;
        }
        if (dernier !== 'chat' && depuisChat > ECART_CHAT && Math.random() < CHANCE_CHAT) {
            depuisChat = 0;
            tenter('chat', chat);
            return;
        }
        if (tirer(CHANCE_APPARITION, 'apparition')) {
            tenter('apparition', apparaitre);
            return;
        }
        dernier = 'message';
        message();
    };

    return { surprendre, message };
}
