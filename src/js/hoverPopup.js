const CLOSE_ANIMATION_DURATION = 300;

export default function addHoverPopup(element, text) {
    let activePopup = null;
    let currentWorkerId = 0;

    element.addEventListener("mouseenter", () => {
        if (window.innerWidth < 450) return;
        const capturedId = ++currentWorkerId;

        if (activePopup) {
            activePopup.remove();
        }

        const rect = element.getBoundingClientRect();
        const popup = document.createElement("div");
        popup.className = "hover-popup";

        popup.innerHTML = `
            <div class="popup-vertical"></div>
            <div class="popup-horizontal"></div>
            <div class="popup-box">${text}</div>
        `;

        document.body.appendChild(popup);

        // Position relative to hovered element
        popup.style.left = `${rect.left}px`;
        popup.style.top = `${rect.bottom}px`;

        activePopup = popup;

        // Start animation
        requestAnimationFrame(() => {
            if (capturedId !== currentWorkerId) return;
            popup.classList.add("visible");
        });
    });

    element.addEventListener("mouseleave", () => {
        const capturedId = currentWorkerId;
        if (!activePopup) return;

        activePopup.classList.remove("visible");

        setTimeout(() => {
            if (currentWorkerId === capturedId && activePopup) {
                activePopup.remove();
                activePopup = null;
            }
        }, CLOSE_ANIMATION_DURATION);
    });
}
