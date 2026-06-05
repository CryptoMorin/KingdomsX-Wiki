import { visit } from "unist-util-visit";

/* ---------------- COLORS ---------------- */

const LEGACY_COLORS = {
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

const NAMED_COLORS = {
  navy: "#000080",
  maroon: "#800000",
  // extend as needed
};

/* ---------------- STATE ---------------- */

function reset() {
  return {
    color: null,
    bold: false,
    italic: false,
    underline: false,
    strike: false,
    obfuscated: false,
  };
}

function style(state) {
  const s = [];

  if (state.color) s.push(`color:${state.color}`);
  if (state.bold) s.push(`font-weight:bold`);
  if (state.italic) s.push(`font-style:italic`);

  const deco = [];
  if (state.underline) deco.push("underline");
  if (state.strike) deco.push("line-through");
  if (deco.length) s.push(`text-decoration:${deco.join(" ")}`);

  if (state.obfuscated) {
    s.push(`filter: blur(0.5px); letter-spacing:1px`);
  }

  return s.join(";");
}

/* ---------------- PARSING HELPERS ---------------- */

function parseRgb(str) {
  const m = str.match(/(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (!m) return null;
  const [r, g, b] = m.slice(1).map(Number);
  return (
    "#" +
    [r, g, b]
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("")
  );
}

function normalizeHex(hex) {
  hex = hex.replace("#", "");

  if (hex.length === 3) {
    return (
      "#" +
      hex
        .split("")
        .map((c) => c + c)
        .join("")
    );
  }

  return "#" + hex;
}

/* ---------------- MAIN PLUGIN ---------------- */

export default function remarkMinecraftAdvanced() {
  return (tree) => {
    visit(tree, "inlineCode", (node, _, parent) => {
      const text = node.value;
      if (!text) return;
      if (parent?.type === "code") return;

      let state = reset();
      let out = [];

      const push = (content, st, extraClass = "") => {
        const styleAttr = style(st);

        out.push(
          `<span class="mc-token ${extraClass}"${
            styleAttr ? ` style="${styleAttr}"` : ""
          }>${content}</span>`
        );
      };

      const applyLegacy = (code) => {
        if (LEGACY_COLORS[code]) state.color = LEGACY_COLORS[code];

        else if (code === "l") state.bold = true;
        else if (code === "o") state.italic = true;
        else if (code === "n") state.underline = true;
        else if (code === "m") state.strike = true;
        else if (code === "k") state.obfuscated = true;
        else if (code === "r") state = reset();
      };

      const parseColor = (chunk) => {
        chunk = chunk.trim();

        // &#RRGGBB
        if (chunk.startsWith("&#")) {
          state.color = normalizeHex(chunk.slice(1));
          return;
        }

        // {#...}
        if (chunk.startsWith("{#") && chunk.endsWith("}")) {
          const inner = chunk.slice(2, -1);

          // {#r,g,b}
          if (inner.includes(",")) {
            state.color = parseRgb(inner);
            return;
          }

          // hex or name
          if (/^[0-9a-fA-F]{3,6}$/.test(inner)) {
            state.color = normalizeHex(inner);
            return;
          }

          const name = inner.toLowerCase();
          if (NAMED_COLORS[name]) {
            state.color = NAMED_COLORS[name];
          }
        }
      };

      let buffer = "";

      const flush = () => {
        if (!buffer) return;
        push(buffer, { ...state });
        buffer = "";
      };

      for (let i = 0; i < text.length; i++) {
        const ch = text[i];

        /* -------- LEGACY & CODES -------- */
        if (ch === "&" && i + 1 < text.length) {
          const code = text[i + 1].toLowerCase();

          flush();

          // preserve visible code itself
          push(`&${code}`, { ...state }, "mc-code");

          applyLegacy(code);

          i++;
          continue;
        }

        /* -------- HEX &#RRGGBB -------- */
        if (text.startsWith("&#", i)) {
          const match = text.slice(i).match(/^&#([0-9a-fA-F]{6})/);
          if (match) {
            flush();
            push(match[0], { ...state }, "mc-code");
            state.color = "#" + match[1];
            i += match[0].length - 1;
            continue;
          }
        }

        /* -------- {#...} formats -------- */
        if (text.startsWith("{#", i)) {
          const end = text.indexOf("}", i);
          if (end !== -1) {
            const chunk = text.slice(i, end + 1);

            flush();
            push(chunk, { ...state }, "mc-code");

            parseColor(chunk);

            i = end;
            continue;
          }
        }

        buffer += ch;
      }

      flush();

      node.type = "html";
      node.value = `<span class="mc-root">${out.join("")}</span>`;
    });
  };
}