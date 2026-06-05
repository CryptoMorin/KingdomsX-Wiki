// remarkMinecraftFormat.js
import { visit } from "unist-util-visit";

const COLORS = {
  "0": "#000000",
  "1": "#0000AA",
  "2": "#00AA00",
  "3": "#00AAAA",
  "4": "#AA0000",
  "5": "#AA00AA",
  "6": "#FFAA00",
  "7": "#AAAAAA",
  "8": "#555555",
  "9": "#5555FF",
  a: "#55FF55",
  b: "#55FFFF",
  c: "#FF5555",
  d: "#FF55FF",
  e: "#FFFF55",
  f: "#FFFFFF",
};

function resetState() {
  return {
    color: null,
    bold: false,
    italic: false,
    underline: false,
    strike: false,
  };
}

function buildStyle(state) {
  const style = [];

  if (state.color) style.push(`color:${state.color}`);
  if (state.bold) style.push(`font-weight:bold`);
  if (state.italic) style.push(`font-style:italic`);

  const decorations = [];
  if (state.underline) decorations.push("underline");
  if (state.strike) decorations.push("line-through");

  if (decorations.length) {
    style.push(`text-decoration:${decorations.join(" ")}`);
  }

  return style.join(";");
}

export default function remarkMinecraftFormat() {
  return (tree) => {
    visit(tree, "inlineCode", (node) => {
      const text = node.value;
      if (!text || !text.includes("&")) return;

      let state = resetState();
      let buffer = "";
      const out = [];

      const flush = () => {
        if (!buffer) return;

        const style = buildStyle(state);
        const styleAttr = style ? ` style="${style}"` : "";

        out.push(`<span${styleAttr}>${buffer}</span>`);
        buffer = "";
      };

      for (let i = 0; i < text.length; i++) {
        const char = text[i];

        if (char === "&" && i + 1 < text.length) {
          const code = text[i + 1].toLowerCase();

          flush();

          // reset
          if (code === "r") {
            state = resetState();
          }

          // bold
          else if (code === "l") {
            state.bold = true;
          }

          // italic
          else if (code === "o") {
            state.italic = true;
          }

          // underline
          else if (code === "n") {
            state.underline = true;
          }

          // strikethrough
          else if (code === "m") {
            state.strike = true;
          }

          // colors
          else if (COLORS[code]) {
            state.color = COLORS[code];
          }

          i++; // skip format char
          continue;
        }

        buffer += char;
      }

      flush();

      node.type = "html";
      node.value = out.join("");
    });
  };
}