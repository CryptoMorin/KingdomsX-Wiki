import React, { useEffect, useState } from 'react';

export default function NotFoundContent() {
  const [html, setHtml] = useState('');

  useEffect(() => {
    fetch('pages/404.html')
      .then((r) => r.text())
      .then(setHtml);
  }, []);

  console.log("404 Not Found")
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}