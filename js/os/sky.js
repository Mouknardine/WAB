// @ts-check
/**
 * WAB OS — la lumière du bureau
 * Pose data-sky (matin, jour, soir, nuit) sur la racine selon l'heure
 * réelle de Lausanne, lue par nav-clock.js ; os-sky.css en tire la
 * teinte du ciel et des points. Revu chaque minute.
 */

import { getClock } from './clock.js?v=1';

const REFRESH_MS = 60000;

export function initSky() {
    const clock = getClock();
    if (!clock) return;
    const apply = () => {
        document.documentElement.dataset.sky = clock.phaseFor(clock.readLausanne(new Date()));
    };
    apply();
    window.setInterval(apply, REFRESH_MS);
}
