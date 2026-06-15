"use client";

// Selector visual de emoji para "próximos juegos". En lugar de escribir o
// pegar el emoji a mano, se elige con un clic de una cuadrícula con variedad
// (círculos y cuadrados de color como los de Discord + algunos temáticos de
// juegos). Igual deja un campito para pegar cualquier otro emoji.
//
// El valor final viaja en un <input hidden> con el `name` dado, así los
// formularios que ya usaban un <input name="emoji"> siguen funcionando igual.
import { useState } from "react";

// Emojis sugeridos, agrupados para que la cuadrícula se lea ordenada.
const PRESETS = [
  // Círculos de color (los puntos que muestra Discord junto al nombre)
  "🔴", "🟠", "🟡", "🟢", "🔵", "🟣", "🟤", "⚫", "⚪",
  // Cuadrados de color
  "🟥", "🟧", "🟨", "🟩", "🟦", "🟪", "🟫", "⬛", "⬜",
  // Temáticos de juegos
  "⭐", "🔥", "⚔️", "🛡️", "🐉", "👑", "💎", "🎮", "🚀", "⚡",
];

export function EmojiPicker({
  name,
  defaultValue = "🟣",
}: {
  name: string;
  defaultValue?: string;
}) {
  const [value, setValue] = useState(defaultValue);

  return (
    <div>
      {/* El valor real que envía el formulario */}
      <input type="hidden" name={name} value={value} />

      {/* Cuadrícula de emojis para elegir con un clic */}
      <div className="flex flex-wrap gap-1.5">
        {PRESETS.map((emoji) => {
          const active = emoji === value;
          return (
            <button
              key={emoji}
              type="button"
              onClick={() => setValue(emoji)}
              aria-pressed={active}
              className={`flex h-9 w-9 items-center justify-center rounded-lg text-lg leading-none transition ${
                active
                  ? "bg-accent/20 ring-2 ring-accent"
                  : "bg-white/5 ring-1 ring-white/10 hover:bg-white/10 hover:ring-white/30"
              }`}
            >
              {emoji}
            </button>
          );
        })}
      </div>

      {/* Campo para escribir / pegar cualquier otro emoji */}
      <div className="mt-2 flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={8}
          className="w-16 rounded-lg bg-white/5 px-3 py-2 text-center text-base text-white outline-none ring-1 ring-white/10 transition focus:ring-accent/50"
          placeholder="🟣"
        />
        <span className="font-hud text-[10px] text-white/30">
          o pega aquí otro emoji
        </span>
      </div>
    </div>
  );
}
