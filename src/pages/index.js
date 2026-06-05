import React from 'react';
import { Redirect } from '@docusaurus/router';

export default function Home() {
  console.log("redirect home")
  return <Redirect to="Home" />;
}