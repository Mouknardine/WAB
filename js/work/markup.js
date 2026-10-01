// @ts-check
/**
 * WAB. — Fiche projet : le gabarit de la fenêtre
 * Une seule fenêtre pour tous les projets, construite au premier
 * clic et remplie à chaque ouverture (voir fill.js). Aucun texte de
 * projet ici : tout vient de la tuile, dans work.html.
 *
 * Sur ordinateur, deux cartes côte à côte : la photo à gauche, le
 * bouton vers le site posé dessus en verre, le récit à droite. Sur
 * téléphone, une seule feuille qui défile : la barre, la photo, puis
 * le récit.
 *
 * La photo entière est le lien vers le site : le bouton n'en est que
 * le repère, un clic n'importe où sur l'image mène au même endroit.
 * La capture en bas du récit y mène aussi, hors de l'ordre de
 * tabulation : au clavier, un seul arrêt suffit.
 */

const CLOSE_ICON = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>';
const VISIT_ICON = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 17L17 7M17 7H7M17 7V17" /></svg>';

const TEMPLATE = `
<div class="case__layout">
    <div class="case__panel">
        <div class="case__bar">
            <span class="case__num" data-case-num></span>
            <button type="button" class="case__close" data-case-close aria-label="Fermer la fiche">${CLOSE_ICON}</button>
        </div>
        <div class="case__body">
            <div class="case__intro">
                <div class="case__meta">
                    <h2 class="case__title" id="caseTitle" tabindex="-1" data-case-name></h2>
                    <p class="case__context" data-case-context></p>
                    <ul class="case__tags" data-case-tags></ul>
                </div>
                <div class="case__summary" data-case-summary></div>
            </div>
            <section class="case__approach" aria-labelledby="caseApproachTitle">
                <h3 class="case__approach-title" id="caseApproachTitle">Notre démarche</h3>
                <dl class="case__steps" data-case-steps></dl>
            </section>
            <a class="window case__shot" href="/" target="_blank" rel="noopener noreferrer" tabindex="-1" data-case-visit>
                <span class="window__chrome" aria-hidden="true"><span></span><span></span><span></span></span>
                <span class="window__view" data-case-shot></span>
            </a>
        </div>
    </div>
    <figure class="case__media">
        <a class="case__frame" href="/" target="_blank" rel="noopener noreferrer" data-case-visit>
            <div class="case__photo-slot" data-case-photo></div>
            <span class="btn case__visit">
                <span>Voir le site</span>${VISIT_ICON}
            </span>
        </a>
        <figcaption class="case__foot">
            <span class="case__foot-name" data-case-foot-name></span>
            <span class="case__foot-context" data-case-foot-context></span>
        </figcaption>
    </figure>
</div>`;

/** @returns {HTMLDialogElement} */
export function createCaseDialog() {
    const dialog = document.createElement('dialog');
    dialog.className = 'case';
    dialog.setAttribute('aria-labelledby', 'caseTitle');
    dialog.innerHTML = TEMPLATE;
    document.body.append(dialog);
    return dialog;
}
