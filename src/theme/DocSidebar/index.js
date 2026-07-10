import React, { useEffect, useRef } from 'react';
import { useLocation } from '@docusaurus/router';

export default function CustomSidebar() {
  const sidebarRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    const links = Array.from(sidebar.querySelectorAll('a[href]'));

    const setActiveLink = (activeLink) => {
      links.forEach((link) => {
        const isActive = link === activeLink;
        link.classList.toggle('menu__link--active', isActive);

        if (!isActive) return;

        let details = link.closest('details');
        while (details) {
          details.open = true;
          details = details.parentElement.closest('details');
        }
      });
    };

    const updateActiveLink = () => {
      const currentPath = `${location.pathname}${location.hash}`;
      const pageLinks = links.filter((link) => {
        const href = link.getAttribute('href');
        const path = href.split('#')[0];
        return path === location.pathname || (path === '/' && location.pathname === '/Home');
      });

      const currentLink = pageLinks.find((link) => link.getAttribute('href') === currentPath);
      const pageLink = pageLinks.find((link) => !link.hash);
      const activeAnchor = pageLinks.reduce((activeLink, link) => {
        if (!link.hash) return activeLink;

        const heading = document.getElementById(decodeURIComponent(link.hash.slice(1)));
        return heading && heading.getBoundingClientRect().top <= 100 ? link : activeLink;
      }, null);

      setActiveLink(activeAnchor || currentLink || pageLink);
    };

    updateActiveLink();
    window.addEventListener('scroll', updateActiveLink, { passive: true });
    window.addEventListener('hashchange', updateActiveLink);

    return () => {
      window.removeEventListener('scroll', updateActiveLink);
      window.removeEventListener('hashchange', updateActiveLink);
    };
  }, [location.hash, location.pathname]);

  return (
    <aside ref={sidebarRef} className="theme-doc-sidebar-container customSidebar">
      <div className="theme-doc-sidebar-menu customScroll">
        <ul className="menu__list">

          {/* Main Navigation */}
          <li><a href="/">🏠 Home</a></li>
          <li><a href="/Features">🔰 Features</a></li>

          <li>
            <details>
              <summary>📥 Installation</summary>
              <ul>
                <li><a href="/Installation">📥 Installation</a></li>
                <li><a href="/Installation#setup">📗 Setup</a></li>
                <li><a href="/Installation#compatibility">📘 Compatibility</a></li>
              </ul>
            </details>
          </li>

          <li><a href="/FAQ">❓ FAQ</a></li>
          <li><a href="/NFAQ">⁉️ NFAQ</a></li>

          <li>
            <details>
              <summary>⚜️ Addons</summary>
              <ul>
                <li><a href="/Addons">⚜️ Addons</a></li>
                <li><a href="/Outposts">🚩 Outposts</a></li>
                <li><a href="/Peace-Treaties">☮️ Peace Treaties</a></li>
                <li><a href="/Map-Viewers-Addon">🗺️ Map Viewers</a></li>
                <li><a href="/EngineHub-Addon">🏬 EngineHub</a></li>
                <li><a href="/Admin-Tools">🛠 Admin Tools</a></li>
              </ul>
            </details>
          </li>

          {/* Basics Section */}
          <li className="menu__list__category"><span>Basics</span></li>

          <li><a href="/Introduction">❇️ Introduction</a></li>

          <li>
            <details>
              <summary>⌨️ Commands</summary>
              <ul>
                <li><a href="/Commands">⌨️ Commands</a></li>
                <li><a href="/Commands#players">👨‍🦱 Players</a></li>
                <li><a href="/Commands#admins">👩‍⚖️ Admins</a></li>
              </ul>
            </details>
          </li>

          <li><a href="/Permissions">🔓 Permissions</a></li>

          <li>
            <details>
              <summary>🔣 Placeholders</summary>
              <ul>
                <li><a href="/Placeholders">🔣 Placeholders</a></li>
                <li><a href="/Placeholders#players">🚹 Players</a></li>
                <li><a href="/Placeholders#kingdoms">🏛 Kingdoms</a></li>
                <li><a href="/Placeholders#nations">🏢 Nations</a></li>
              </ul>
            </details>
          </li>

          <li>
            <details>
              <summary>📁 Config</summary>
              <ul>
                <li><a href="/Config">📁 Config</a></li>
                <li><a href="/YAML">📃 YAML</a></li>
                <li><a href="/Languages">💱 Languages</a></li>
                <li><a href="/GUIs">📱 GUI</a></li>
              </ul>
            </details>
          </li>

          {/* Advanced Section */}
          <li className="menu__list__category"><span>Advanced</span></li>

          <li><a href="/Protection-Signs">🔒 Protection Signs</a></li>
          <li><a href="/Mails">✉️ Mails</a></li>

          <li>
            <details>
              <summary>📚 Mechanics</summary>
              <ul>
                <li>
                  <details>
                    <summary>⚔️ Invasion</summary>
                    <ul>
                      <li><a href="/Mechanics">⚔️ Invasion</a></li>
                      <li><a href="/Mechanics#Preparing">🛡️ Preparing</a></li>
                      <li><a href="/Mechanics#Champion">🧟 Champion</a></li>
                      <li><a href="/Mechanics#mass-wars">🗡 Masswar</a></li>
                    </ul>
                  </details>
                </li>
                <li><a href="/Mechanics#Structures">📡 Structures</a></li>
                <li><a href="/Mechanics#Turrets">🔫 Turrets</a></li>
              </ul>
            </details>
          </li>

          {/* Others Section */}
          <li className="menu__list__category"><span>Others</span></li>

          <li><a href="/Troubleshooting">🧰 Troubleshooting</a></li>

          <li>
            <details>
              <summary>💻 API</summary>
              <ul>
                <li><a href="/API#basics">🔹 Basics</a></li>
                <li><a href="/API#turrets--structures">🔹 Turrets & Structures</a></li>
                <li><a href="/API#metadata">🔹 Metadata</a></li>
                <li><a href="/API#events">🔹 Events</a></li>
                <li><a href="/API#examples">🔹 Examples</a></li>
                <li><a href="/Addons-API">🔹 Addons</a></li>
              </ul>
            </details>
          </li>

        </ul>
      </div>
    </aside>
  );
}