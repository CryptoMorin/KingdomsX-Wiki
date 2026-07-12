import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {useThemeConfig} from '@docusaurus/theme-common';
import ThemedImage from '@theme/ThemedImage';

export default function NavbarLogo() {
  const {
    navbar: {title, logo},
  } = useThemeConfig();
  const logoHref = useBaseUrl(logo?.href || '/');
  const sources = {
    light: useBaseUrl(logo?.src),
    dark: useBaseUrl(logo?.srcDark || logo?.src),
  };

  return (
    <div className="navbar-brand-group">
      <Link className="navbar__brand-mark" to={logoHref} aria-label="KingdomsX Wiki home">
        <span className="navbar__logo">
          <ThemedImage sources={sources} alt="" />
        </span>
      </Link>
      <span className="navbar__brand-copy">
        <Link className="navbar__brand" to={logoHref}>{title}</Link>
        <span className="navbar__context">WIKI</span>
      </span>
    </div>
  );
}
