import React from 'react';
import DocSidebarItemCategory from '@theme-original/DocSidebarItem/Category';

export default function LinkedDocSidebarItemCategory({item, ...props}) {
  const linkedHref = item.customProps?.linkedHref;
  const linkedItem = linkedHref ? {...item, href: linkedHref} : item;

  return <DocSidebarItemCategory item={linkedItem} {...props} />;
}
