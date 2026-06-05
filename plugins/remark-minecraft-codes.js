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

function styleFrom(state) {
  const s = [];

  if (state.color) s.push(`color:${state.color}`);
  if (state.bold) s.push(`font-weight:bold`);
  if (state.italic) s.push(`font-style:italic`);

  const deco = [];
  if (state.underline) deco.push("underline");
  if (state.strike) deco.push("line-through");
  if (deco.length) s.push(`text-decoration:${deco.join(" ")}`);

  return s.join(";");
}

export default function remarkMinecraftFormat() {
  return (tree) => {
    visit(tree, "inlineCode", (node, _, parent) => {
      const text = node.value;
      if (!text || !text.includes("&")) return;

      // safety: NEVER touch code blocks accidentally
      if (parent?.type === "code") return;

      let state = resetState();
      let buffer = "";
      const out = [];

      const flush = () => {
        if (!buffer) return;

        const style = styleFrom(state);
        const styleAttr = style ? ` style="${style}"` : "";

        out.push(`<span${styleAttr}>${buffer}</span>`);
        buffer = "";
      };

      for (let i = 0; i < text.length; i++) {
        const ch = text[i];

        if (ch === "&" && i + 1 < text.length) {
          const code = text[i + 1].toLowerCase();

          // IMPORTANT:
          // We KEEP &x in output → so add it BEFORE applying logic
          buffer += `&${code}`;

          flush();

          if (code === "r") {
            state = resetState();
          } else if (code === "l") {
            state.bold = true;
          } else if (code === "o") {
            state.italic = true;
          } else if (code === "n") {
            state.underline = true;
          } else if (code === "m") {
            state.strike = true;
          } else if (COLORS[code]) {
            state.color = COLORS[code];
          }

          i++; // skip code char
          continue;
        }

        buffer += ch;
      }

      flush();

      node.type = "html";
      node.value = `<span class="mc-root">${out.join("")}</span>`;
    });
  };
}