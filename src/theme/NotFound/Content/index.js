import React from 'react';
import { Redirect } from '@docusaurus/router';

export default function NotFound() {
  useEffect(() => {
    window.location.replace('pages/404');
  }, []);
}