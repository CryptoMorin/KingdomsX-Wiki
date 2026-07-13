import React from 'react';
import MDXComponents from '@theme-original/MDXComponents';

function findFirstRow(node) {
  let row;

  React.Children.forEach(node, (child) => {
    if (row || !React.isValidElement(child)) return;
    if (child.type === 'tr') {
      row = child;
      return;
    }
    row = findFirstRow(child.props.children);
  });

  return row;
}

function textContent(node) {
  return React.Children.toArray(node)
    .map((child) => React.isValidElement(child) ? textContent(child.props.children) : String(child))
    .join('')
    .trim()
    .toLowerCase();
}

function breakAtDots(node) {
  return React.Children.map(node, (child) => {
    if (typeof child === 'string') {
      const parts = child.split('.');
      if (parts.length === 1) return child;

      return parts.map((part, index) => (
        <React.Fragment key={index}>
          {part}
          {index < parts.length - 1 && <>.<wbr /></>}
        </React.Fragment>
      ));
    }

    if (!React.isValidElement(child) || child.props.children == null) return child;

    if (child.type === 'code' || child.type === MDXComponents.code) {
      return React.createElement(
        'code',
        {...child.props, key: child.key},
        breakAtDots(child.props.children),
      );
    }

    return React.cloneElement(child, {}, breakAtDots(child.props.children));
  });
}

function breakTableColumns(node, columns) {
  return React.Children.map(node, (child) => {
    if (!React.isValidElement(child)) return child;

    if (child.type === 'tr') {
      let column = -1;
      const children = React.Children.map(child.props.children, (cell) => {
        if (!React.isValidElement(cell) || (cell.type !== 'th' && cell.type !== 'td')) return cell;
        column += 1;

        if (cell.type !== 'td' || !columns.includes(column)) return cell;
        return React.cloneElement(cell, {}, breakAtDots(cell.props.children));
      });

      return React.cloneElement(child, {}, children);
    }

    if (child.props.children == null) return child;
    return React.cloneElement(child, {}, breakTableColumns(child.props.children, columns));
  });
}

function tableLayout(children) {
  const row = findFirstRow(children);
  if (!row) return {name: 'automatic', widths: []};

  const headers = React.Children.toArray(row.props.children)
    .filter((cell) => React.isValidElement(cell) && (cell.type === 'th' || cell.type === 'td'))
    .map((cell) => textContent(cell.props.children));

  if (headers.length === 2) {
    if (headers[0] === 'command' && headers[1] === 'permission') {
      return {name: 'command-permission', widths: ['35%', '65%'], breakColumns: [1]};
    }

    const hasDescription = headers.some((header) => header.includes('description'));
    return hasDescription
      ? {
          name: 'key-description',
          variant: headers[0] === 'permission' ? 'permission-description' : null,
          widths: ['36%', '64%'],
          breakColumns: headers[0] === 'permission' ? [0] : [],
        }
      : {name: 'balanced', widths: ['50%', '50%']};
  }

  if (headers.length === 3 && headers[0]?.includes('date')) {
    return {name: 'timeline', widths: ['16%', '20%', '64%']};
  }

  if (headers.length === 3) {
    return {name: 'three-column', widths: ['28%', '22%', '50%']};
  }

  if (headers.length === 4) {
    return {name: 'four-column', widths: ['24%', '30%', '22%', '24%']};
  }

  return {name: 'automatic', widths: []};
}

function Table(props) {
  const layout = tableLayout(props.children);
  const children = layout.breakColumns?.length > 0
    ? breakTableColumns(props.children, layout.breakColumns)
    : props.children;

  return (
    <div className={[
      'table-frame',
      `table-frame--${layout.name}`,
      layout.variant && `table-frame--${layout.variant}`,
    ].filter(Boolean).join(' ')}>
      <table {...props}>
        {layout.widths.length > 0 && (
          <colgroup>
            {layout.widths.map((width, index) => <col key={index} style={{width}} />)}
          </colgroup>
        )}
        {children}
      </table>
    </div>
  );
}

export default {
  ...MDXComponents,
  table: Table,
};
