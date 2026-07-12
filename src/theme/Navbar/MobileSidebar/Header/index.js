import React from 'react';
import {useNavbarMobileSidebar} from '@docusaurus/theme-common/internal';
import IconClose from '@theme/Icon/Close';
import NavbarLogo from '@theme/Navbar/Logo';

export default function NavbarMobileSidebarHeader() {
  const mobileSidebar = useNavbarMobileSidebar();

  return (
    <div className="navbar-sidebar__brand">
      <NavbarLogo />
      <button
        type="button"
        aria-label="Close navigation bar"
        className="clean-btn navbar-sidebar__close"
        onClick={mobileSidebar.toggle}>
        <IconClose color="var(--ifm-color-emphasis-600)" />
      </button>
    </div>
  );
}
