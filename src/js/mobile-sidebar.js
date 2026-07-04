import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
if (!ExecutionEnvironment.canUseDOM) {
    console.log('mobile-sidebar.js module cannot use DOM at this moment.');
    return;
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
    const actualSidebar = document.querySelector('aside.theme-doc-sidebar-container');
    if (!actualSidebar) throw "Actual side bar is missing!";

    const navbarSidebar = document.querySelector('.theme-layout-navbar-sidebar.navbar-sidebar');
    if (!navbarSidebar) {
        console.warn('No sidebar navbar found.');
        return;
    }
    
    actualSidebar.style.transform = 'translateX(-100%)';
    actualSidebar.style.display = 'block';
    actualSidebar.style.height = '100%';
    actualSidebar.style.width = 'var(--ifm-navbar-sidebar-width)';
    actualSidebar.style.top = '0';
    actualSidebar.style.left = '0';
    actualSidebar.style.position = 'fixed';
    actualSidebar.style.transition = '0.3s linear';

    // Add the logo on top
    const customSidebar = document.querySelector('.customSidebar');
	let navbarBrand = document.querySelector('.navbar__brand');
    if (navbarBrand && customSidebar) {
        navbarBrand = navbarBrand.cloneNode(true);

        const brandSeparator = document.createElement('div');
        brandSeparator.classList.add('brand_separator');

        customSidebar.prepend(brandSeparator);
        customSidebar.prepend(navbarBrand);
    } else {
        console.warn("navBar brand or customSidebar not found:", navbarBrand, customSidebar);
    }

    navbarSidebar.replaceWith(actualSidebar);
    console.log("Replaced navbar sidebar.");
}

function onBackdropChange() {
    replaceNavbar();
    const navbar = document.querySelector('.theme-layout-navbar.navbar.navbar--fixed-top');

    if (navbar) {
    const observer = new MutationObserver(() => {
        const isOpen = navbar.classList.contains('navbar-sidebar--show');

        if (isOpen) {
            console.log('Sidebar opened');
            applySidebar(true);
        } else {
            console.log('Sidebar closed');
            applySidebar(false);
        }
    });

    observer.observe(navbar, {
        attributes: true,
        attributeFilter: ['class'],
    });
    }
}

// Wait until the DOM is ready
onBackdropChange();
document.addEventListener('DOMContentLoaded', () => {
  onBackdropChange();
});