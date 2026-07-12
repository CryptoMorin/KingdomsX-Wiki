import React from 'react';
import clsx from 'clsx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import NavbarNavLink from '@theme/NavbarItem/NavbarNavLink';
import {navbarIcons} from '@theme/NavbarItem/icons';

export default function DefaultNavbarItemDesktop({
  className,
  isDropdownItem = false,
  label,
  ...props
}) {
  const navbarIcon = navbarIcons[label];
  const linkLabel = navbarIcon ? (
    <FontAwesomeIcon
      className="navbar-social-icon"
      icon={navbarIcon}
      aria-hidden="true"
    />
  ) : label;
  const element = (
    <NavbarNavLink
      className={clsx(
        isDropdownItem ? 'dropdown__link' : 'navbar__item navbar__link',
        className,
      )}
      isDropdownLink={isDropdownItem}
      label={linkLabel}
      {...props}
      aria-label={navbarIcon ? label : props['aria-label']}
    />
  );

  return isDropdownItem ? <li>{element}</li> : element;
}
