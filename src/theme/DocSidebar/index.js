import React from 'react';

export default function CustomSidebar() {
  return (
    <aside className="theme-doc-sidebar-container customSidebar">
      <div className="theme-doc-sidebar-menu customScroll">
        <ul className="menu__list">

          {/* Main Navigation */}
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
          <li><a href="/NFAQ">⁉️ NFAQ</a></li>

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

          {/* Basics Section */}
          <li className="menu__list__category"><span># Basics</span></li>

          <li><a href="/Introduction">❇️ Introduction</a></li>

          <li>
            <details>
              <summary>⌨️ Commands</summary>
              <ul>
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
                <li><a href="/YAML">📃 YAML</a></li>
                <li><a href="/Languages">💱 Languages</a></li>
                <li><a href="/GUIs">📱 GUI</a></li>
              </ul>
            </details>
          </li>

          {/* Advanced Section */}
          <li className="menu__list__category"><span># Advanced</span></li>

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
          <li className="menu__list__category"><span># Others</span></li>

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