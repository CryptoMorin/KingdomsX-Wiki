import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCodeBranch } from '@fortawesome/free-solid-svg-icons';

export default function Footer() {
  return (
    <div className="footer">
      <div className="container footer-container">
        <div className="footer-left">
          <img
            src="/img/logo.webp"
            alt="Logo"
            className="footer-logo"
          />

          <div className="footer-copy">
            <span className="footer-copyright">
              &copy; 2026 KingdomsX. A plugin by <a href="https://github.com/CryptoMorin" target="_blank" rel="noopener noreferrer">Crypto Morin</a>.
            </span>

            <span className="footer-source">
              <FontAwesomeIcon icon={faCodeBranch} aria-hidden="true" />{' '}
              <a href="https://github.com/CryptoMorin/KingdomsX-Wiki" target="_blank" rel="noopener noreferrer">KingdomsX-Wiki</a>
              &bull; Powered by <a href="https://docusaurus.io/" target="_blank" rel="noopener noreferrer">Docusaurus</a>
              <img src="/img/docusaurus_keytar.svg" alt="" />
            </span>
          </div>
        </div>

        <nav className="footer-right footer-links" aria-label="Footer links">
          <a href="https://kingdomsx.com" target="_blank" rel="noopener noreferrer">Website</a>
          <a href="https://discord.kingdomsx.com" target="_blank" rel="noopener noreferrer">Discord</a>
          <a href="https://servers.kingdomsx.com" target="_blank" rel="noopener noreferrer">Servers</a>
          <a href="https://download.kingdomsx.com" target="_blank" rel="noopener noreferrer">Download</a>
        </nav>
      </div>
    </div>
  );
}
