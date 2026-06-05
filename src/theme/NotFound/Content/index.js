import React, { useEffect, useState } from 'react';

export default function NotFoundContent() {
  const [html, setHtml] = useState('');

  useEffect(() => {
    fetch('/404.html')
      .then((r) => r.text())
      .then(setHtml);
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}