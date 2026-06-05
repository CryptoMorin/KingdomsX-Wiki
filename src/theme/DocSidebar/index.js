import React from 'react';
import DocSidebar from '@theme-original/DocSidebar';

function Item({ emoji, label, to }) {
  return (
    <li className="menu__list-item">
      <a className="menu__link" href={to}>
        {emoji} {label}
      </a>
    </li>
  );
}

function Group({ title, emoji, children, defaultOpen = true }) {
  return (
    <li className="menu__list-item">
      <details className="menu__list-item-collapsible" open={defaultOpen}>
        <summary className="menu__link">
          {emoji} {title}
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
    <DocSidebar
      {...props}
      sidebar={
        [
          {
            type: 'category',
            label: 'Custom',
            items: [] // we are NOT using Docusaurus auto sidebar here
          }
        ]
      }
    >
      {/* We overlay custom UI inside sidebar container */}
      <div className="customSidebarRoot">

        <ul className="menu__list">

          {/* Home */}
          <Item emoji="🏠" label="Home" to="/" />

          {/* Features */}
          <Item emoji="🔰" label="Features" to="/Features" />

          {/* Installation */}
          <Group emoji="📥" title="Installation">
            <Item emoji="📗" label="Setup" to="/Installation#setup" />
            <Item emoji="📘" label="Compatibility" to="/Installation#compatibility" />
          </Group>

          {/* FAQ */}
          <Item emoji="❓" label="FAQ" to="/FAQ" />

          {/* NFAQ */}
          <Item emoji="⁉️" label="NFAQ" to="/NFAQ" />

          {/* Addons */}
          <Group emoji="⚜️" title="Addons">
            <Item emoji="🚩" label="Outposts" to="/Outposts" />
            <Item emoji="☮️" label="Peace Treaties" to="/Peace-Treaties" />
            <Item emoji="🗺️" label="Map Viewers" to="/Map-Viewers-Addon" />
            <Item emoji="🏬" label="EngineHub" to="/EngineHub-Addon" />
            <Item emoji="🛠" label="Admin Tools" to="/Admin-Tools" />
          </Group>

          <hr />

          {/* Basics */}
          <Item emoji="❇️" label="Introduction" to="/Introduction" />
          <Item emoji="⌨️" label="Commands" to="/Commands" />

          <Group emoji="⌨️" title="Commands">
            <Item emoji="👨‍🦱" label="Players" to="/Commands#players" />
            <Item emoji="👩‍⚖️" label="Admins" to="/Commands#admins" />
          </Group>

          <Item emoji="🔓" label="Permissions" to="/Permissions" />
          <Item emoji="🔣" label="Placeholders" to="/Placeholders" />

          <Group emoji="🔣" title="Placeholders">
            <Item emoji="🚹" label="Players" to="/Placeholders#players" />
            <Item emoji="🏛" label="Kingdoms" to="/Placeholders#kingdoms" />
            <Item emoji="🏢" label="Nations" to="/Placeholders#nations" />
          </Group>

          <Item emoji="📁" label="Config" to="/Config" />

          <Group emoji="📁" title="Config Files">
            <Item emoji="📃" label="YAML" to="/YAML" />
            <Item emoji="💱" label="Languages" to="/Languages" />
            <Item emoji="📱" label="GUI" to="/GUIs" />
          </Group>

          <hr />

          {/* Advanced */}
          <Item emoji="🔒" label="Protection Signs" to="/Protection-Signs" />
          <Item emoji="✉️" label="Mails" to="/Mails" />
          <Item emoji="📚" label="Mechanics" to="/Mechanics" />

          <Group emoji="⚔️" title="Invasion">
            <Item emoji="🛡️" label="Preparing" to="/Mechanics#Preparing" />
            <Item emoji="🧟" label="Champion" to="/Mechanics#Champion" />
            <Item emoji="🗡" label="Masswar" to="/Mechanics#mass-wars" />
          </Group>

          <Item emoji="📡" label="Structures" to="/Mechanics#Structures" />
          <Item emoji="🔫" label="Turrets" to="/Mechanics#Turrets" />

          <hr />

          {/* Others */}
          <Item emoji="🧰" label="Troubleshooting" to="/Troubleshooting" />
          <Item emoji="💻" label="API" to="/API" />

          <Group emoji="💻" title="API">
            <Item emoji="🔹" label="Basics" to="/API#basics" />
            <Item emoji="🔹" label="Turrets & Structures" to="/API#turrets--structures" />
            <Item emoji="🔹" label="Metadata" to="/API#metadata" />
            <Item emoji="🔹" label="Events" to="/API#events" />
            <Item emoji="🔹" label="Examples" to="/API#examples" />
            <Item emoji="🔹" label="Addons" to="/API#addons-api" />
          </Group>

        </ul>
      </div>
    </DocSidebar>
  );
}