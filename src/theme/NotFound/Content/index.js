import React, { useEffect, useState } from 'react';

export default function NotFoundContent() {
  const [html, setHtml] = useState('');

  useEffect(() => {
    fetch('/404.html')
      .then((r) => r.text())
      .then(setHtml);
  }, []);

  console.log("using effect 404.html")
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}