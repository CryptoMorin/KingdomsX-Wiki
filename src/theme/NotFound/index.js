import React from 'react';
import {translate} from '@docusaurus/Translate';
import {PageMetadata} from '@docusaurus/theme-common';
import NotFoundContent from '@theme/NotFound/Content';

export default function NotFound() {
  const title = translate({
    id: 'theme.NotFound.title',
    message: 'Page Not Found',
  });

  return (
    <>
      <PageMetadata title={title} />
      <NotFoundContent />
    </>
  );
}