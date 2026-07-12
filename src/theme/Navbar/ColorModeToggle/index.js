import React, {useRef} from 'react';
import clsx from 'clsx';
import useIsBrowser from '@docusaurus/useIsBrowser';
import {useColorMode, useThemeConfig} from '@docusaurus/theme-common';
import IconDarkMode from '@theme/Icon/DarkMode';
import IconLightMode from '@theme/Icon/LightMode';
import IconSystemColorMode from '@theme/Icon/SystemColorMode';

const modes = [
  {choice: 'light', label: 'Light', Icon: IconLightMode},
  {choice: null, label: 'System', Icon: IconSystemColorMode},
  {choice: 'dark', label: 'Dark', Icon: IconDarkMode},
];

export default function NavbarColorModeToggle({className}) {
  const {disableSwitch} = useThemeConfig().colorMode;
  const {colorModeChoice, setColorMode} = useColorMode();
  const isBrowser = useIsBrowser();
  const selectedIndex = modes.findIndex(({choice}) => choice === colorModeChoice);
  const optionRefs = useRef([]);

  if (disableSwitch) return null;

  const handleKeyDown = (event) => {
    let nextIndex;

    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = (selectedIndex + modes.length - 1) % modes.length;
    } else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = (selectedIndex + 1) % modes.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = modes.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    setColorMode(modes[nextIndex].choice);
    requestAnimationFrame(() => optionRefs.current[nextIndex]?.focus());
  };

  return (
    <div
      className={clsx(className, 'color-mode-toggle')}
      data-theme-choice={colorModeChoice ?? 'system'}
      role="radiogroup"
      aria-label="Color theme"
      onKeyDown={handleKeyDown}>
      <span className="color-mode-toggle__thumb" aria-hidden="true" />
      {modes.map(({choice, label, Icon}, index) => {
        const selected = choice === colorModeChoice;

        return (
          <button
            key={label}
            ref={(element) => { optionRefs.current[index] = element; }}
            className="clean-btn color-mode-toggle__option"
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={`${label} theme`}
            title={`${label} theme`}
            tabIndex={selected ? 0 : -1}
            disabled={!isBrowser}
            onClick={() => setColorMode(choice)}>
            <Icon aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}
