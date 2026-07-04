import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

const PORTRAIT_SUPPORT_ELEMENT_CLASS = 'portrait-support';
const SIDEBAR_NAVBAR = '.theme-layout-navbar-sidebar.navbar-sidebar';
let loadPhase = 1;
const loadPhaseStr = () => `[Load Phase ${loadPhase}] `;

function log(...msg) {
    console.log(loadPhaseStr(), ...msg);
}
function warn(...msg) {
    console.warn(loadPhaseStr(), ...msg);
}

function applySidebar(opened) {
    const actualSidebar = document.querySelector('aside.theme-doc-sidebar-container');
    if (!actualSidebar) throw "Actual side bar is missing!";

    if (opened) {
        actualSidebar.style.transform = 'translateX(0)';
        // actualSidebar.style.removeProperty('visibility');
        // actualSidebar.style.removeProperty('opacity');
    } else {
        actualSidebar.style.transform = 'translateX(-100%)';
        // actualSidebar.style.visibility = 'hidden';
        // actualSidebar.style.opacity = '0';
    }
}

function replaceNavbar() {
    let actualSidebar = document.querySelector('aside.theme-doc-sidebar-container');
    if (!actualSidebar) throw "Actual side bar is missing!";

    const navbarSidebar = document.querySelector(SIDEBAR_NAVBAR);
    if (!navbarSidebar) {
        warn('No sidebar navbar found.');
        return false;
    }
    
    actualSidebar = actualSidebar.cloneNode(true);
    actualSidebar.style.transform = 'translateX(-100%)';
    actualSidebar.style.display = 'block';
    actualSidebar.style.height = '100%';
    actualSidebar.style.width = 'var(--ifm-navbar-sidebar-width)';
    actualSidebar.style.top = '0';
    actualSidebar.style.left = '0';
    actualSidebar.style.position = 'fixed';
    actualSidebar.style.transition = '0.3s linear';
    actualSidebar.classList.add(PORTRAIT_SUPPORT_ELEMENT_CLASS);

    // Add the logo on top
    const customSidebar = document.querySelector('.customSidebar');
	let navbarBrand = document.querySelector('.navbar__brand');
    if (navbarBrand && customSidebar) {
        navbarBrand = navbarBrand.cloneNode(true);
        navbarBrand.classList.add(PORTRAIT_SUPPORT_ELEMENT_CLASS);

        const brandSeparator = document.createElement('div');
        brandSeparator.classList.add('brand_separator');
        brandSeparator.classList.add(PORTRAIT_SUPPORT_ELEMENT_CLASS);

        customSidebar.prepend(brandSeparator);
        customSidebar.prepend(navbarBrand);
    } else {
        warn("navBar brand or customSidebar not found:", navbarBrand, customSidebar);
    }

    // Prevent page crash due to:
    //    Node.removeChild: The node to be removed is not a child of this node
    // Set the element to invisible instead of completely removing it.
    navbarSidebar.style.display = 'none';
    navbarSidebar.after(actualSidebar);
    log("Replaced navbar sidebar.");
    return true;
}

function onBackdropChange() {
    if (!replaceNavbar()) return false;

    const navbar = document.querySelector('.theme-layout-navbar.navbar.navbar--fixed-top');

    if (navbar) {
        const observer = new MutationObserver(() => {
            const isOpen = navbar.classList.contains('navbar-sidebar--show');

            if (isOpen) {
                log('Sidebar opened');
                applySidebar(true);
            } else {
                log('Sidebar closed');
                applySidebar(false);
            }
        });

        observer.observe(navbar, {
            attributes: true,
            attributeFilter: ['class'],
        });
        return true;
    } else {
        warn('navbar not found.');
        return false;
    }
}

function cleanUpPotraitSupport() {
    const portraitSupportElements = document.getElementsByClassName(PORTRAIT_SUPPORT_ELEMENT_CLASS);
    let cleanupCount = 0;

    for (const el of portraitSupportElements) {
        el.remove();
        cleanupCount++;
    }

    log("cleaned up a total of", cleanupCount, "portrait support elements.");
}

function observeAdditionAndRemoval() {
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {

            // Navbar added.
            for (const node of mutation.addedNodes) {
                if (!(node instanceof HTMLElement)) continue;

                if (node.matches?.(SIDEBAR_NAVBAR)) {
                    log('Sidebar added!', node);
                    onBackdropChange();
                    return;
                }

                const sidebar = node.querySelector?.(SIDEBAR_NAVBAR);
                if (sidebar) {
                    log('Sidebar added!', sidebar);
                    onBackdropChange();
                    return;
                }
            }

            // Navbar removed.
            for (const node of mutation.removedNodes) {
                if (!(node instanceof HTMLElement)) continue;

                if (node.matches?.(SIDEBAR_NAVBAR)) {
                    log('Sidebar removed!', node);
                    cleanUpPotraitSupport()
                    return;
                }

                const sidebar = node.querySelector?.(SIDEBAR_NAVBAR);
                if (sidebar) {
                    log('Sidebar removed!', sidebar);
                    cleanUpPotraitSupport()
                    return;
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    return observer;
}


if (!ExecutionEnvironment.canUseDOM) {
    loadPhase = 0;
    log('mobile-sidebar.js module cannot use DOM at this moment.');
} else {
    // Wait until the DOM is ready
    if (!onBackdropChange()) {
        loadPhase = 2;
        document.addEventListener('DOMContentLoaded', () => {
            if (!onBackdropChange()) {
                loadPhase = 3;
                observeAddition();
            }
        });
    }
}