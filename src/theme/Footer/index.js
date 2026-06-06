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
      <div className="custom-footer-bar">
        <div className="custom-footer-left">
          <img
            src="/img/favicon.ico"
            alt="Logo"
            className="footer-logo"
          />

          <span className="footer-text">
            © {new Date().getFullYear()} {siteConfig.title}
          </span>
        </div>
      </div>
    </>
  );
}