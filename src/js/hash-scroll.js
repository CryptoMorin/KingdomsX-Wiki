import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

function scrollToHash(hash = window.location.hash) {
  if (!hash) return;

  let id;
  try {
    id = decodeURIComponent(hash.slice(1));
  } catch {
    id = hash.slice(1);
  }

  const scroll = (attempt = 0) => {
    const target = document.getElementById(id);

    if (target) {
      target.scrollIntoView({block: 'start'});
      return;
    }

    if (attempt < 10) requestAnimationFrame(() => scroll(attempt + 1));
  };

  requestAnimationFrame(() => requestAnimationFrame(() => scroll()));
}

if (ExecutionEnvironment.canUseDOM) {
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', () => scrollToHash(), {once: true});
  } else {
    scrollToHash();
  }

  window.addEventListener('hashchange', () => scrollToHash());
}

export function onRouteDidUpdate({location, previousLocation}) {
  if (location.hash && (location.pathname !== previousLocation?.pathname || location.hash !== previousLocation?.hash)) {
    scrollToHash(location.hash);
  }
}
