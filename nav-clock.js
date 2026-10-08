/**
 * WAB. — Horloge et statut du studio (Lausanne)
 * Met à jour tous les éléments portant [data-local-time] avec l'heure
 * de Lausanne. Expose aussi le statut du studio à ce moment-là (au
 * travail, en soirée, la nuit, le week-end), que le terminal affiche.
 *
 * Le statut ne dépend que du jour et de l'heure : il ne prétend
 * jamais que quelqu'un est connecté. Chargé sur toutes les pages,
 * une seule implémentation.
 */

const ZONE = 'Europe/Zurich';

/* Du lundi au vendredi. Les horaires du studio. */
const OPEN_HOUR = 8;
const EVENING_HOUR = 18;
const NIGHT_HOUR = 23;

/** Lit l'heure et le jour de la semaine à Lausanne. */
function readLausanne(date) {
    const parts = new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit',
        hourCycle: 'h23',
        weekday: 'short',
        timeZone: ZONE,
    }).formatToParts(date);
    const hour = Number(parts.find((part) => part.type === 'hour')?.value);
    const weekday = parts.find((part) => part.type === 'weekday')?.value;
    return { hour, weekday };
}

/**
 * Le vendredi soir appartient déjà au week-end : la réponse viendra
 * lundi, pas « demain ».
 */
function statusFor({ hour, weekday }) {
    const weekend = weekday === 'Sat' || weekday === 'Sun'
        || (weekday === 'Fri' && hour >= EVENING_HOUR);

    if (weekend) return { text: 'Week-end, réponse lundi' };
    if (hour >= OPEN_HOUR && hour < EVENING_HOUR) return { text: 'Au studio' };
    if (hour >= EVENING_HOUR && hour < NIGHT_HOUR) return { text: 'En soirée, réponse demain' };
    return { text: 'Lausanne dort' };
}

/**
 * La lumière du jour à Lausanne, pour le bureau
 * (js/os/sky.js) : matin, jour, soir, nuit.
 */
function phaseFor({ hour }) {
    if (hour >= 6 && hour < 10) return 'matin';
    if (hour >= 10 && hour < 17) return 'jour';
    if (hour >= 17 && hour < 21) return 'soir';
    return 'nuit';
}

/* Une seule implémentation pour tout le site : la lumière du bureau
   (js/os/sky.js) et le terminal la lisent ici plutôt que de la recopier. */
window.WABClock = Object.freeze({ ZONE, readLausanne, statusFor, phaseFor });

document.addEventListener('DOMContentLoaded', () => {
    const clocks = document.querySelectorAll('[data-local-time]');
    if (!clocks.length) return;

    const timeFormat = (() => {
        try {
            return new Intl.DateTimeFormat('fr-CH', { hour: '2-digit', minute: '2-digit', timeZone: ZONE });
        } catch (error) {
            return null; // fuseau indisponible : on garde les textes d'attente
        }
    })();
    if (!timeFormat) return;

    function update() {
        const time = timeFormat.format(new Date());
        clocks.forEach((el) => {
            el.textContent = time;
        });
    }

    update();
    setInterval(update, 30000);
});
