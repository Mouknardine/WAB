// @ts-check
/**
 * WAB. — page Work : signaler une panne sans bruit
 * Le nom du module en panne est posé sur la racine (lisible en
 * inspectant la page), l'erreur part au rapport du navigateur, jamais
 * dans la console du visiteur.
 *
 * @param {string} name
 * @param {unknown} error
 */
export function report(name, error) {
    document.documentElement.dataset.workError = name;
    if (typeof window.reportError === 'function') window.reportError(error);
}
