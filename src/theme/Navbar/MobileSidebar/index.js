import React, {useEffect, useRef} from 'react';
import {useLockBodyScroll, useNavbarMobileSidebar} from '@docusaurus/theme-common/internal';
import NavbarMobileSidebarLayout from '@theme/Navbar/MobileSidebar/Layout';
import NavbarMobileSidebarHeader from '@theme/Navbar/MobileSidebar/Header';
import NavbarMobileSidebarPrimaryMenu from '@theme/Navbar/MobileSidebar/PrimaryMenu';
import NavbarMobileSidebarSecondaryMenu from '@theme/Navbar/MobileSidebar/SecondaryMenu';
import NavbarColorModeToggle from '@theme/Navbar/ColorModeToggle';

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'summary',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function MobileThemeControl() {
  return (
    <div className="navbar-sidebar__theme-control">
      <span className="navbar-sidebar__theme-label">Appearance</span>
      <NavbarColorModeToggle />
    </div>
  );
}

export default function NavbarMobileSidebar() {
  const mobileSidebar = useNavbarMobileSidebar();
  const openerRef = useRef(null);
  useLockBodyScroll(mobileSidebar.shown);

  useEffect(() => {
    const sidebar = document.querySelector('.navbar-sidebar');
    if (!sidebar) return undefined;

    sidebar.toggleAttribute('inert', !mobileSidebar.shown);
    sidebar.setAttribute('aria-hidden', String(!mobileSidebar.shown));

    if (!mobileSidebar.shown) return undefined;

    openerRef.current = document.activeElement;
    const focusableElements = () =>
      Array.from(sidebar.querySelectorAll(focusableSelector)).filter((element) => {
        const closedDetails = element.closest('details:not([open])');
        return !element.closest('[inert]') && (!closedDetails || element.tagName === 'SUMMARY');
      });
    requestAnimationFrame(() => sidebar.querySelector('.navbar-sidebar__close')?.focus());

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        mobileSidebar.toggle();
        return;
      }

      if (event.key !== 'Tab') return;

      const elements = focusableElements();
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      openerRef.current?.focus?.();
    };
  }, [mobileSidebar.shouldRender, mobileSidebar.shown, mobileSidebar.toggle]);

  if (!mobileSidebar.shouldRender) return null;

  return (
    <NavbarMobileSidebarLayout
      header={<NavbarMobileSidebarHeader />}
      primaryMenu={(
        <>
          <NavbarMobileSidebarPrimaryMenu />
          <MobileThemeControl />
        </>
      )}
      secondaryMenu={(
        <>
          <NavbarMobileSidebarSecondaryMenu />
          <MobileThemeControl />
        </>
      )}
    />
  );
}
