import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

function normalizePath(pathname) {
  return pathname === '/' ? pathname : pathname.replace(/\/+$/, '');
}

function decodeHash(hash) {
  try {
    return decodeURIComponent(hash.slice(1));
  } catch {
    return hash.slice(1);
  }
}

function updateMenu(menu) {
  const currentPath = normalizePath(window.location.pathname);
  const links = Array.from(menu.querySelectorAll('a[href]'));
  const pageLinks = links
    .map((link) => ({link, url: new URL(link.href, window.location.origin)}))
    .filter(({url}) => url.origin === window.location.origin && normalizePath(url.pathname) === currentPath);

  if (pageLinks.length === 0) {
    links.forEach((link) => link.classList.remove('menu__link--active'));
    return;
  }

  const activeAnchor = pageLinks.reduce((activeLink, {link, url}) => {
    if (!url.hash) return activeLink;

    const heading = document.getElementById(decodeHash(url.hash));
    return heading && heading.getBoundingClientRect().top <= 100 ? link : activeLink;
  }, null);
  const exactHashLink = pageLinks.find(({url}) => url.hash === window.location.hash)?.link;
  const pageLink = pageLinks.find(({url}) => !url.hash)?.link;
  const activeLink = activeAnchor || exactHashLink || pageLink;

  links.forEach((link) => link.classList.toggle('menu__link--active', link === activeLink));
}

function updateActiveLinks() {
  document.querySelectorAll('.theme-doc-sidebar-menu').forEach(updateMenu);
}

let updateScheduled = false;

function scheduleActiveLinksUpdate() {
  if (updateScheduled) return;

  updateScheduled = true;
  requestAnimationFrame(() => {
    updateScheduled = false;
    updateActiveLinks();
  });
}

if (ExecutionEnvironment.canUseDOM) {
  window.addEventListener('scroll', scheduleActiveLinksUpdate, {passive: true});
  window.addEventListener('hashchange', scheduleActiveLinksUpdate);
  scheduleActiveLinksUpdate();
}

export function onRouteDidUpdate() {
  scheduleActiveLinksUpdate();
}
