import React from 'react';

export default function CustomSidebar() {
  return (
    <aside className="theme-doc-sidebar-container customSidebar">
      <div className="theme-doc-sidebar-menu customScroll">

        <ul className="menu__list">

          <li><a href="/">🏠 Home</a></li>
          <li><a href="/Features">🔰 Features</a></li>

          <li>
            <details open>
              <summary>📥 Installation</summary>
              <ul>
                <li><a href="/Installation#setup">📗 Setup</a></li>
                <li><a href="/Installation#compatibility">📘 Compatibility</a></li>
              </ul>
            </details>
          </li>

          <li><a href="/FAQ">❓ FAQ</a></li>

          <li>
            <details open>
              <summary>⚜️ Addons</summary>
              <ul>
                <li><a href="/Outposts">🚩 Outposts</a></li>
                <li><a href="/Peace-Treaties">☮️ Peace Treaties</a></li>
                <li><a href="/Map-Viewers-Addon">🗺️ Map Viewers</a></li>
                <li><a href="/EngineHub-Addon">🏬 EngineHub</a></li>
                <li><a href="/Admin-Tools">🛠 Admin Tools</a></li>
              </ul>
            </details>
          </li>

        </ul>

      </div>
    </aside>
  );
}