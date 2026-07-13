import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

const SMOOTH_SCROLL_CLASS = 'wiki-anchor-scroll-smooth';
const CANCEL_ALIGNMENT_EVENTS = ['wheel', 'touchstart', 'pointerdown', 'keydown'];

let observedHash = '';
let anchorLayoutObserver;

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function enableSmoothScroll() {
  if (!prefersReducedMotion()) {
    document.documentElement.classList.add(SMOOTH_SCROLL_CLASS);
  }
}

function disableSmoothScroll() {
  document.documentElement.classList.remove(SMOOTH_SCROLL_CLASS);
}

function isSamePageHashChange(location, previousLocation) {
  return Boolean(
    previousLocation &&
    location.pathname === previousLocation.pathname &&
    location.search === previousLocation.search &&
    location.hash !== previousLocation.hash
  );
}

function getHashTarget(hash) {
  if (!hash) return null;

  let id;
  try {
    id = decodeURIComponent(hash.slice(1));
  } catch {
    id = hash.slice(1);
  }

  return document.getElementById(id);
}

function scrollToTarget(target, behavior) {
  target.scrollIntoView({
    behavior: prefersReducedMotion() ? 'instant' : behavior,
    block: 'start',
  });
}

function stopAnchorAlignment() {
  observedHash = '';
  anchorLayoutObserver?.disconnect();
  anchorLayoutObserver = undefined;
}

function keepAnchorAligned(hash, behavior) {
  stopAnchorAlignment();

  const target = getHashTarget(hash);
  if (!target) return null;

  observedHash = hash;
  const content = target.closest('.theme-doc-markdown') ?? document.body;

  // Docusaurus lazy-loads markdown images. Watching the whole page also catches
  // images below headings near the bottom that increase the available scroll range
  if (content && typeof ResizeObserver !== 'undefined') {
    anchorLayoutObserver = new ResizeObserver(() => {
      if (window.location.hash !== hash) {
        stopAnchorAlignment();
        return;
      }

      scrollToTarget(target, behavior);
    });
    anchorLayoutObserver.observe(content);
  }

  return target;
}

function cancelAnchorAlignment() {
  stopAnchorAlignment();
  disableSmoothScroll();
}

function prepareAnchorClick(event) {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    !(event.target instanceof Element)
  ) {
    return;
  }

  const link = event.target.closest('a[href]');
  if (!link || link.hasAttribute('download')) return;
  if (link.target && link.target !== '_self') return;

  const destination = new URL(link.href, window.location.href);
  const isSamePage =
    destination.origin === window.location.origin &&
    destination.pathname === window.location.pathname &&
    destination.search === window.location.search;

  if (!isSamePage || !destination.hash) return;

  enableSmoothScroll();
  keepAnchorAligned(destination.hash, 'smooth');

  // Following the current fragment does not fire hashchange or a route update
  if (destination.hash === window.location.hash) {
    requestAnimationFrame(disableSmoothScroll);
  }
}

function scrollToHash(hash = window.location.hash) {
  cancelAnchorAlignment();
  if (!hash) return;

  const scroll = (attempt = 0) => {
    const target = keepAnchorAligned(hash, 'instant');

    if (target) {
      scrollToTarget(target, 'instant');
    } else if (attempt < 10) {
      requestAnimationFrame(() => scroll(attempt + 1));
    }
  };

  requestAnimationFrame(() => requestAnimationFrame(() => scroll()));
}

if (ExecutionEnvironment.canUseDOM) {
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', () => scrollToHash(), {once: true});
  } else {
    scrollToHash();
  }

  document.addEventListener('click', prepareAnchorClick, true);
  window.addEventListener('hashchange', () => {
    const {hash} = window.location;

    if (!hash) {
      cancelAnchorAlignment();
    } else if (observedHash !== hash) {
      const target = keepAnchorAligned(hash, 'smooth');
      if (target) scrollToTarget(target, 'smooth');
    }

    requestAnimationFrame(disableSmoothScroll);
  });
  CANCEL_ALIGNMENT_EVENTS.forEach((eventName) =>
    window.addEventListener(eventName, cancelAnchorAlignment, {
      capture: true,
      passive: true,
    }));
}

export function onRouteUpdate({location, previousLocation}) {
  stopAnchorAlignment();

  if (isSamePageHashChange(location, previousLocation)) {
    enableSmoothScroll();
    keepAnchorAligned(location.hash, 'smooth');
  }
}

export function onRouteDidUpdate({location, previousLocation}) {
  if (!previousLocation && location.hash) {
    const target = keepAnchorAligned(location.hash, 'instant');

    if (target) {
      scrollToTarget(target, 'instant');
    } else {
      scrollToHash(location.hash);
    }
    return;
  }

  if (isSamePageHashChange(location, previousLocation)) {
    if (observedHash !== location.hash) {
      keepAnchorAligned(location.hash, 'smooth');
    }

    requestAnimationFrame(disableSmoothScroll);
    return;
  }

  const locationChanged =
    location.pathname !== previousLocation?.pathname ||
    location.search !== previousLocation?.search ||
    location.hash !== previousLocation?.hash;

  if (location.hash && locationChanged) {
    scrollToHash(location.hash);
  } else {
    cancelAnchorAlignment();
  }
}
