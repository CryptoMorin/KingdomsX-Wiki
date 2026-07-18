import React, { useEffect } from 'react';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NavbarNavLink from '@theme/NavbarItem/NavbarNavLink';
import { navbarIcons } from '@theme/NavbarItem/icons';
import Translate, { translate } from '@docusaurus/Translate';
import addHoverPopup from '../../../../js/hoverPopup';

const descriptions = {
  discord: translate({
    id: "navbar.discord.description",
    message: "Join the official KingdomsX Discord.",
    description: "Tooltip for the Discord navbar button."
  }),
  website: translate({
    id: "navbar.website.description",
    message: "Visit the official KingdomsX website.",
    description: "Tooltip for the website navbar button."
  }),
  github: translate({
    id: "navbar.github.description",
    message: "Visit the official KingdomsX GitHub page.",
    description: "Tooltip for the GitHub navbar button."
  }),
  reload: translate({
    id: "navbar.reload.description",
    message: "Requests the backend server to reload all its assets and then reloads the current page. This does not refresh the downloaded GitHub MD files cache or run the MD preprocessor.",
    description: "Tooltip for the reload navbar button."
  }),
}

export default function DefaultNavbarItemDesktop({
  className,
  isDropdownItem = false,
  label,
  ...props
}) {
  const description = descriptions[label.toLowerCase()];

  if (className) {
    useEffect(() => {
      // NavbarNavLink doesn't forward ref, we can't useRef().
      const ele = document.querySelector(`.${className}`);
      const liveDesc = ele.dataset.description;

      if (liveDesc) addHoverPopup(ele, liveDesc);
    }, []);
  }

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
      data-description={description}
    />
  );

  return isDropdownItem ? <li>{element}</li> : element;
}
