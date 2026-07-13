import React from 'react';
import DocSidebarItemCategory from '@theme-original/DocSidebarItem/Category';

export default function LinkedDocSidebarItemCategory({item, onItemClick, ...props}) {
  const linkedHref = item.customProps?.linkedHref;
  const linkedItem = linkedHref ? {...item, href: linkedHref} : item;
  const labelLinkProps = linkedItem.href
    ? {onClick: () => onItemClick?.(linkedItem)}
    : {};

  return (
    <DocSidebarItemCategory
      item={linkedItem}
      onItemClick={onItemClick}
      {...props}
      {...labelLinkProps}
    />
  );
}
