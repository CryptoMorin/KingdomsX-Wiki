import React, { useEffect } from "react";
import OriginalLayout from "@theme-original/Layout";

export default function Layout(props) {
  useEffect(() => {
    const applyPercentRule = () => {
      document.querySelectorAll("code").forEach((el) => {
        const text = el.textContent?.trim() || "";

        if (
        text &&
        text.startsWith("%") &&
        text.endsWith("%") &&
        text.length > 2
        ) {
            el.classList.add("placeholder-text");
            const inner = text.slice(1, -1);

            el.innerHTML = `
                <span class="placeholder-enclosure">%</span>
                <span class="placeholder-content">${inner}</span>
                <span class="placeholder-enclosure">%</span>
            `;
        }
      });
    };

    applyPercentRule();

    const observer = new MutationObserver(applyPercentRule);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <OriginalLayout {...props} />
    </>
  );
}