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
            © {new Date().getFullYear()} {siteConfig.title}
          </span>
        </div>

        <div className="footer-right">
          <span className="footer-credit">
            Made with <a href="Docusaurus">Docusaurus</a>
          </span>

          <img
            src="/img/docusaurus_keytar.svg"
            alt="Docusaurus Logo"
            className="footer-logo"
          />
        </div>
      </div>
    </>
  );
}