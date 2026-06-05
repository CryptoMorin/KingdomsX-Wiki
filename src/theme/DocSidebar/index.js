import React from 'react';
// import DocSidebar from '@theme-original/DocSidebar';

function CustomSidebarItem({ label, to, emoji }) {
  return (
    <li className="menu__list-item">
      <a className="menu__link" href={to}>
        {emoji} {label}
      </a>
    </li>
  );
}

function CollapsibleSection({ title, children, defaultOpen = true }) {
  return (
    <li className="menu__list-item">
      <details open={defaultOpen} className="custom-sidebar-group">
        <summary className="menu__link">
          {title}
        </summary>
        <ul className="menu__list">
          {children}
        </ul>
      </details>
    </li>
  );
}

export default function CustomDocSidebar(props) {
  return (
    <aside className="theme-doc-sidebar-container custom-sidebar">

      {/* Custom overlay / replacement (optional: you can remove DocSidebar above if you fully replace it) */}
      <nav className="menu">
        <ul className="menu__list">

          {/* Home */}
          <CustomSidebarItem emoji="🏠" label="Home" to="/KingdomsX/wiki" />

          {/* Features */}
          <CustomSidebarItem emoji="🔰" label="Features" to="/KingdomsX/wiki/Features" />

          {/* Installation */}
          <CollapsibleSection title="📥 Installation">
            <CustomSidebarItem emoji="📗" label="Setup" to="/KingdomsX/wiki/Installation#setup" />
            <CustomSidebarItem emoji="📘" label="Compatibility" to="/KingdomsX/wiki/Installation#compatibility" />
          </CollapsibleSection>

          {/* FAQ */}
          <CustomSidebarItem emoji="❓" label="FAQ" to="/KingdomsX/wiki/FAQ" />

          {/* NFAQ */}
          <CustomSidebarItem emoji="⁉️" label="NFAQ" to="/KingdomsX/wiki/NFAQ" />

          {/* Addons */}
          <CollapsibleSection title="⚜️ Addons">
            <CustomSidebarItem emoji="🚩" label="Outposts" to="/KingdomsX/wiki/Outposts" />
            <CustomSidebarItem emoji="☮️" label="Peace Treaties" to="/KingdomsX/wiki/Peace-Treaties" />
            <CustomSidebarItem emoji="🗺️" label="Map Viewers" to="/KingdomsX/wiki/Map-Viewers-Addon" />
            <CustomSidebarItem emoji="🏬" label="EngineHub" to="/KingdomsX/wiki/EngineHub-Addon" />
            <CustomSidebarItem emoji="🛠" label="Admin Tools" to="/KingdomsX/wiki/Admin-Tools" />
          </CollapsibleSection>

          {/* Basics */}
          <li className="menu__list-item"><strong>Basics</strong></li>

          <CustomSidebarItem emoji="❇️" label="Introduction" to="/KingdomsX/wiki/Introduction" />
          <CustomSidebarItem emoji="⌨️" label="Commands" to="/KingdomsX/wiki/Commands" />

          <CollapsibleSection title="👨‍🦱 Players">
            <CustomSidebarItem emoji="👨‍🦱" label="Players Commands" to="/KingdomsX/wiki/Commands#players" />
          </CollapsibleSection>

          <CollapsibleSection title="👩‍⚖️ Admins">
            <CustomSidebarItem emoji="👩‍⚖️" label="Admin Commands" to="/KingdomsX/wiki/Commands#admins" />
          </CollapsibleSection>

          <CustomSidebarItem emoji="🔓" label="Permissions" to="/KingdomsX/wiki/Permissions" />
          <CustomSidebarItem emoji="🔣" label="Placeholders" to="/KingdomsX/wiki/Placeholders" />

          <CollapsibleSection title="🚹 Placeholders">
            <CustomSidebarItem emoji="🚹" label="Players" to="/KingdomsX/wiki/Placeholders#players" />
            <CustomSidebarItem emoji="🏛" label="Kingdoms" to="/KingdomsX/wiki/Placeholders#kingdoms" />
            <CustomSidebarItem emoji="🏢" label="Nations" to="/KingdomsX/wiki/Placeholders#nations" />
          </CollapsibleSection>

          <CustomSidebarItem emoji="📁" label="Config" to="/KingdomsX/wiki/Config" />

          <CollapsibleSection title="📁 Config Details">
            <CustomSidebarItem emoji="📃" label="YAML" to="/KingdomsX/wiki/YAML" />
            <CustomSidebarItem emoji="💱" label="Languages" to="/KingdomsX/wiki/Languages" />
            <CustomSidebarItem emoji="📱" label="GUI" to="/KingdomsX/wiki/GUIs" />
          </CollapsibleSection>

          {/* Advanced */}
          <li className="menu__list-item"><strong>Advanced</strong></li>

          <CustomSidebarItem emoji="🔒" label="Protection Signs" to="/KingdomsX/wiki/Protection-Signs" />
          <CustomSidebarItem emoji="✉️" label="Mails" to="/KingdomsX/wiki/Mails" />
          <CustomSidebarItem emoji="📚" label="Mechanics" to="/KingdomsX/wiki/Mechanics" />

          <CollapsibleSection title="⚔️ Invasion">
            <CustomSidebarItem emoji="🛡️" label="Preparing" to="/KingdomsX/wiki/Mechanics#Preparing" />
            <CustomSidebarItem emoji="🧟" label="Champion" to="/KingdomsX/wiki/Mechanics#Champion" />
            <CustomSidebarItem emoji="🗡" label="Masswar" to="/KingdomsX/wiki/Mechanics#mass-wars" />
          </CollapsibleSection>

          <CustomSidebarItem emoji="📡" label="Structures" to="/KingdomsX/wiki/Mechanics#Structures" />
          <CustomSidebarItem emoji="🔫" label="Turrets" to="/KingdomsX/wiki/Mechanics#Turrets" />

          {/* Others */}
          <li className="menu__list-item"><strong>Others</strong></li>

          <CustomSidebarItem emoji="🧰" label="Troubleshooting" to="/KingdomsX/wiki/Troubleshooting" />
          <CustomSidebarItem emoji="💻" label="API" to="/KingdomsX/wiki/API" />

          <CollapsibleSection title="💻 API Sections">
            <CustomSidebarItem emoji="🔹" label="Basics" to="/KingdomsX/wiki/API#basics" />
            <CustomSidebarItem emoji="🔹" label="Turrets & Structures" to="/KingdomsX/wiki/API#turrets--structures" />
            <CustomSidebarItem emoji="🔹" label="Metadata" to="/KingdomsX/wiki/API#metadata" />
            <CustomSidebarItem emoji="🔹" label="Events" to="/KingdomsX/wiki/API#events" />
            <CustomSidebarItem emoji="🔹" label="Examples" to="/KingdomsX/wiki/API#examples" />
            <CustomSidebarItem emoji="🔹" label="Addons" to="/KingdomsX/wiki/Addons-API" />
          </CollapsibleSection>

        </ul>
      </nav>
    </aside>
  );
}