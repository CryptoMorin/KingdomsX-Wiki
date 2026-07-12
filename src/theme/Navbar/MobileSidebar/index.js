import React, {useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {
  useLockBodyScroll,
  useNavbarMobileSidebar,
  useNavbarSecondaryMenu,
} from '@docusaurus/theme-common/internal';
import NavbarMobileSidebarHeader from '@theme/Navbar/MobileSidebar/Header';
import NavbarMobileSidebarPrimaryMenu from '@theme/Navbar/MobileSidebar/PrimaryMenu';
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

function MenuSwitch({buttonRef, direction, label, onClick}) {
  return (
    <button
      ref={buttonRef}
      type="button"
      className={clsx('clean-btn navbar-sidebar__menu-switch', {
        'navbar-sidebar__menu-switch--forward': direction === 'forward',
      })}
      onClick={onClick}>
      {direction === 'back' && <span aria-hidden="true">←</span>}
      <span>{label}</span>
      {direction === 'forward' && <span aria-hidden="true">→</span>}
    </button>
  );
}

function MobileSidebarPanel({children, hidden}) {
  return (
    <div
      className={clsx(
        ThemeClassNames.layout.navbar.mobileSidebar.panel,
        'navbar-sidebar__item menu',
        hidden && 'navbar-sidebar__item--hidden',
      )}
      aria-hidden={hidden}
      inert={hidden ? '' : undefined}>
      {children}
    </div>
  );
}

export default function NavbarMobileSidebar() {
  const mobileSidebar = useNavbarMobileSidebar();
  const secondaryMenu = useNavbarSecondaryMenu();
  const openerRef = useRef(null);
  const mainMenuSwitchRef = useRef(null);
  const wikiMenuSwitchRef = useRef(null);
  const [showWikiMenu, setShowWikiMenu] = useState(true);
  useLockBodyScroll(mobileSidebar.shown);

  const hasWikiMenu = Boolean(secondaryMenu.content);
  const wikiMenuShown = hasWikiMenu && showWikiMenu;

  useEffect(() => {
    if (!mobileSidebar.shown) setShowWikiMenu(true);
  }, [mobileSidebar.shown]);

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
    <div
      className={clsx(
        ThemeClassNames.layout.navbar.mobileSidebar.container,
        'navbar-sidebar',
      )}>
      <div className="navbar-sidebar__drawer">
        <NavbarMobileSidebarHeader />
        <div className="navbar-sidebar__items">
          <MobileSidebarPanel hidden={wikiMenuShown}>
            <div className="navbar-sidebar__main-menu">
              {hasWikiMenu && (
                <MenuSwitch
                  buttonRef={mainMenuSwitchRef}
                  direction="forward"
                  label="Back to content menu"
                  onClick={() => {
                    setShowWikiMenu(true);
                    requestAnimationFrame(() =>
                      wikiMenuSwitchRef.current?.focus({preventScroll: true}),
                    );
                  }}
                />
              )}
              <NavbarMobileSidebarPrimaryMenu />
            </div>
            <MobileThemeControl />
          </MobileSidebarPanel>
          <MobileSidebarPanel hidden={!wikiMenuShown}>
            <MenuSwitch
              buttonRef={wikiMenuSwitchRef}
              direction="back"
              label="Back to main menu"
              onClick={() => {
                setShowWikiMenu(false);
                requestAnimationFrame(() =>
                  mainMenuSwitchRef.current?.focus({preventScroll: true}),
                );
              }}
            />
            {secondaryMenu.content}
            <MobileThemeControl />
          </MobileSidebarPanel>
        </div>
      </div>
    </div>
  );
}
