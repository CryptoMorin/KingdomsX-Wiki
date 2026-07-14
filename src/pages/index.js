import React from 'react';
import { Redirect } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {PageMetadata} from '@docusaurus/theme-common';

// export default function Home() {
//   console.log("redirect home")
//   return <Redirect to="Home" />;
// }

// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import Home from "./Home";

// export function Home() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Navigate to="/home" replace />} />
//         <Route path="/Test" element={<Navigate to="/home" replace />} />
//         <Route path="/home" element={<Home />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }
export default function HomeRedirect() {
  const {siteConfig} = useDocusaurusContext();

  return (
    <>
      <PageMetadata description={siteConfig.customFields.siteDescription} />
      <Redirect to="/Home" />
    </>
  );
}
