/**
 * WAB. — Horloge locale partagée (Lausanne)
 * Met à jour tous les éléments portant [data-local-time] :
 * celle du menu plein écran et celles des pages (Contact, About).
 * Chargé sur toutes les pages, une seule implémentation.
 */

document.addEventListener('DOMContentLoaded', () => {
    const clocks = document.querySelectorAll('[data-local-time]');
    if (!clocks.length) return;

    function update() {
        let time;
        try {
            time = new Intl.DateTimeFormat('fr-CH', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Europe/Zurich',
            }).format(new Date());
        } catch (e) {
            return; // fuseau indisponible : on garde le placeholder
        }
        clocks.forEach((el) => {
            el.textContent = time;
        });
    }

    update();
    setInterval(update, 30000);
});
