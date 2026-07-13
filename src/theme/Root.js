import React, {useEffect, useRef} from 'react';
import {useHistory} from '@docusaurus/router';
import {PAGE_TRANSITION_READY_EVENT} from '@site/src/js/page-transition';

const FADE_DURATION = 250;
const ENTER_PENDING_CLASS = 'wiki-page-enter-pending';
const PAGE_SELECTOR = 'html.docs-doc-page main';

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getInternalDestination(event) {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return null;
  }

  if (!(event.target instanceof Element)) return null;

  const link = event.target.closest('a[href]');
  if (!link || link.hasAttribute('download')) return null;
  if (link.target && link.target !== '_self') return null;

  const destination = new URL(link.href, window.location.href);
  if (destination.origin !== window.location.origin) return null;
  if (destination.pathname === window.location.pathname) return null;

  return destination;
}

export default function Root({children}) {
  const history = useHistory();
  const transitioning = useRef(false);
  const activeAnimation = useRef(null);

  useEffect(() => {
    const finishTransition = () => {
      if (!transitioning.current) return;

      const page = document.querySelector(PAGE_SELECTOR);
      if (!page?.animate) {
        document.documentElement.classList.remove(ENTER_PENDING_CLASS);
        transitioning.current = false;
        return;
      }

      const animation = page.animate(
        [{opacity: 0}, {opacity: 1}],
        {duration: FADE_DURATION, easing: 'ease-out', fill: 'both'},
      );

      activeAnimation.current = animation;
      page.style.removeProperty('opacity');
      document.documentElement.classList.remove(ENTER_PENDING_CLASS);
      animation.finished
        .catch(() => undefined)
        .finally(() => {
          if (activeAnimation.current !== animation) return;

          animation.cancel();
          activeAnimation.current = null;
          transitioning.current = false;
        });
    };

    const handleClick = (event) => {
      const destination = getInternalDestination(event);
      if (!destination || prefersReducedMotion()) return;

      if (transitioning.current) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      const page = document.querySelector(PAGE_SELECTOR);
      if (!page?.animate) return;

      event.preventDefault();
      event.stopPropagation();
      transitioning.current = true;

      const animation = page.animate(
        [{opacity: 1}, {opacity: 0}],
        {duration: FADE_DURATION, easing: 'ease-in', fill: 'both'},
      );

      activeAnimation.current = animation;
      animation.finished
        .catch(() => undefined)
        .then(() => {
          if (activeAnimation.current !== animation) return;

          document.documentElement.classList.add(ENTER_PENDING_CLASS);
          // Cancelling a finished web animation briefly restores CSS opacity for whatever reason
          // Keep the old page hidden until Docusaurus mounts the next route
          page.style.opacity = '0';
          animation.cancel();
          activeAnimation.current = null;
          history.push(`${destination.pathname}${destination.search}${destination.hash}`);
        });
    };

    document.addEventListener('click', handleClick, true);
    window.addEventListener(PAGE_TRANSITION_READY_EVENT, finishTransition);

    return () => {
      document.removeEventListener('click', handleClick, true);
      window.removeEventListener(PAGE_TRANSITION_READY_EVENT, finishTransition);
      document.documentElement.classList.remove(ENTER_PENDING_CLASS);
      document.querySelector(PAGE_SELECTOR)?.style.removeProperty('opacity');
      activeAnimation.current?.cancel();
      activeAnimation.current = null;
      transitioning.current = false;
    };
  }, [history]);

  return <>{children}</>;
}
