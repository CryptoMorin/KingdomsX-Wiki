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

function tableLayout(children) {
  const row = findFirstRow(children);
  if (!row) return {name: 'automatic', widths: []};

  const headers = React.Children.toArray(row.props.children)
    .filter((cell) => React.isValidElement(cell) && (cell.type === 'th' || cell.type === 'td'))
    .map((cell) => textContent(cell.props.children));

  if (headers.length === 2) {
    const hasDescription = headers.some((header) => header.includes('description'));
    return hasDescription
      ? {name: 'key-description', widths: ['36%', '64%']}
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

  return (
    <div className={`table-frame table-frame--${layout.name}`}>
      <table {...props}>
        {layout.widths.length > 0 && (
          <colgroup>
            {layout.widths.map((width, index) => <col key={index} style={{width}} />)}
          </colgroup>
        )}
        {props.children}
      </table>
    </div>
  );
}

export default {
  ...MDXComponents,
  table: Table,
};
