import React from 'react';
import Footer from '@theme-original/Footer';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function FooterWrapper(props) {
  const { siteConfig } = useDocusaurusContext();

  return (
    <>
      <Footer
        {...props}
        />
      <div className="footer">
        <div className="footer-left">
          <img
            src="/img/favicon.ico"
            alt="Logo"
            className="footer-logo"
          />

          <span className="footer-copyright">
            Copyright © {new Date().getFullYear()} KingdomsX.
            <span className="footer-copyright-madeby">A plugin by Crypto Morin.</span>
          </span>
        </div>

        <div className="footer-right">
          <span className="footer-credit">
            Powered by<a href="https://docusaurus.io/">Docusaurus</a>
          </span>

          <img
            src="/img/docusaurus_keytar.svg"
            alt="Docusaurus Logo"
            target="_blank"
            className="footer-logo"
          />
        </div>
      </div>
    </>
  );
}