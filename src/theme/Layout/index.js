import React, { useEffect } from "react";
import OriginalLayout from "@theme-original/Layout";

export default function Layout(props) {
  useEffect(() => {
    const applyPercentRule = () => {
      document.querySelectorAll("code").forEach((el) => {
        const text = el.textContent?.trim() || "";

        if (text.startsWith("%") && text.endsWith("%")) {
          el.classList.add("percent-wrapped");
        } else {
          el.classList.remove("percent-wrapped");
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