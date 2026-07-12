import React from 'react';
import {useLocation} from '@docusaurus/router';
import {useActiveDocContext} from '@docusaurus/plugin-content-docs/client';
import DefaultNavbarItem from '@theme/NavbarItem/DefaultNavbarItem';

const githubWikiRoot = 'https://github.com/CryptoMorin/KingdomsX/wiki';

export default function GitHubWikiPageNavbarItem(props) {
  const {activeDoc} = useActiveDocContext();
  const {hash} = useLocation();
  const pageId = activeDoc?.id;
  const hasEquivalentPage = pageId && !pageId.includes('/');
  const href = hasEquivalentPage
    ? `${githubWikiRoot}/${encodeURIComponent(pageId)}${hash}`
    : githubWikiRoot;

  return <DefaultNavbarItem {...props} href={href} />;
}
