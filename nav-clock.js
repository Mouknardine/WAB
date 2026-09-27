/**
 * WAB. — Horloge et statut du studio (Lausanne)
 * Met à jour tous les éléments portant [data-local-time] avec l'heure
 * de Lausanne, et ceux portant [data-local-status] avec ce que fait
 * le studio à ce moment-là : au travail, en soirée, la nuit, le
 * week-end.
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

    if (weekend) return { text: 'Week-end, réponse lundi', live: false };
    if (hour >= OPEN_HOUR && hour < EVENING_HOUR) return { text: 'Au studio', live: true };
    if (hour >= EVENING_HOUR && hour < NIGHT_HOUR) return { text: 'En soirée, réponse demain', live: false };
    return { text: 'Lausanne dort', live: false };
}

document.addEventListener('DOMContentLoaded', () => {
    const clocks = document.querySelectorAll('[data-local-time]');
    const statuses = document.querySelectorAll('[data-local-status]');
    if (!clocks.length && !statuses.length) return;

    const timeFormat = (() => {
        try {
            return new Intl.DateTimeFormat('fr-CH', { hour: '2-digit', minute: '2-digit', timeZone: ZONE });
        } catch (error) {
            return null; // fuseau indisponible : on garde les textes d'attente
        }
    })();
    if (!timeFormat) return;

    function update() {
        const now = new Date();
        const time = timeFormat.format(now);
        clocks.forEach((el) => {
            el.textContent = time;
        });

        const status = statusFor(readLausanne(now));
        statuses.forEach((el) => {
            el.textContent = status.text;
            el.classList.toggle('is-live', status.live);
            el.hidden = false;
        });
    }

    update();
    setInterval(update, 30000);
});
