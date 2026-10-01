// @ts-check
/**
 * WAB. — Accueil
 * Les deux scènes pilotées par le défilement : l'ouverture (le point
 * de WAB. qui s'ouvre sur le travail) et la planche de projets.
 * Chacune vérifie son propre balisage et renonce sans bruit s'il
 * manque : la page reste lisible, simplement immobile.
 */

import { initOpening } from './opening.js?v=1';
import { initGallery } from './gallery.js?v=1';

initOpening();
initGallery();
