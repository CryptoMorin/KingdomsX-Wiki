import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import DefaultNavbarItem from '@theme/NavbarItem/DefaultNavbarItem';
import addHoverPopup from '../../../js/hoverPopup';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
let reloadOverlay = null;

function showReloading() {
    if (reloadOverlay) {
        return;
    }

    // Disable scrolling
    document.body.style.overflow = "hidden";
    reloadOverlay = document.createElement("div");
    reloadOverlay.id = "reload-overlay";

    reloadOverlay.innerHTML = `
        <div class="reload-box">
            <div class="spinner dont-select"></div>
            <div class="dont-select">Reloading...</div>
        </div>
    `;

    document.body.appendChild(reloadOverlay);
}


function showMessage(success, showCloseBtn, message) {
    if (!reloadOverlay) return;

    const box = reloadOverlay.querySelector(".reload-box");
    const boxIconClass = success ? "reload-success" : "reload-fail";

    createRoot(box).render(
        <>
            <FontAwesomeIcon className={boxIconClass} icon={success ? faCheckCircle : faX} aria-hidden="true" />
            <div>{message}</div>
            {showCloseBtn && (
                <button id="reload-close" onClick={hideReloadOverlay}>Close</button>
            )}
        </>
    );
}


function hideReloadOverlay() {
    document.body.style.overflow = "";

    if (reloadOverlay) {
        reloadOverlay.remove();
        reloadOverlay = null;
    }

    const style = document.getElementById("reload-overlay-style");
    if (style) {
        style.remove();
    }
}

async function sendReloadRequest(event) {
    console.log("Sending reload request...");
    event.preventDefault();
    showReloading();

    try {
        const response = await fetch(window.location.origin + "/api/v1/reload");
        const data = await response.json();
        console.log(data);

        // The true parameter doesn't work for all browsers.
        if (data.ok) {
            showMessage(true, false, data.message + "\nReloading the current page, please wait...");
            await wait(2 * 1000);
            window.location.reload(true);
        } else {
            showMessage(false, true, "Server failed to reload the page:\n" + data.message);
        }
    } catch (e) {
        showMessage(false, true, e.name + ": " + e.message);
        console.error(e);
    }
}

export default function ReloadRequestNavbarItem(props) {
    return <DefaultNavbarItem {...props} onClick={sendReloadRequest} />;
}
