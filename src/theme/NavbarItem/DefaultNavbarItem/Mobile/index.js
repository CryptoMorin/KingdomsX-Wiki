import React from 'react';
import clsx from 'clsx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import NavbarNavLink from '@theme/NavbarItem/NavbarNavLink';
import {mainMenuIcons} from '@theme/NavbarItem/icons';

export default function DefaultNavbarItemMobile({
  className,
  isDropdownItem,
  label,
  ...props
}) {
  const menuIcon = mainMenuIcons[label];
  const linkLabel = menuIcon ? (
    <>
      <FontAwesomeIcon
        className="navbar-sidebar__main-menu-icon"
        icon={menuIcon}
        aria-hidden="true"
      />
      <span>{label}</span>
    </>
  ) : label;

  return (
    <li className="menu__list-item">
      <NavbarNavLink
        className={clsx('menu__link', className)}
        label={linkLabel}
        {...props}
      />
    </li>
  );
}
