import React from 'react';
import { Redirect } from '@docusaurus/router';

export default function Home() {
  console.log("404 NotFound Redirect.")
  return <Redirect to="/pages/404" />;
}