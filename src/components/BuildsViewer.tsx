"use client";
import { useState } from "react";
import { Panel } from "@/components/hud";
import type { SectionContent } from "@/lib/sections";

type SkillEntry = { name: string; img: string };

type Build = {
  name: string;
  mode: "PvE" | "PvP";
  techniques: SkillEntry[];
  enchants: SkillEntry[];
  desc: string;
};

type ClassData = {
  class: string;
  class_es: string;
  icon?: string;
  builds: Build[];
};

type TierData = {
  tier: string;
  label: string;
  coming_soon?: boolean;
  classes: ClassData[];
};

export function BuildsViewer({ section }: { section: SectionContent }) {
  const tiers = section.blocks
    .filter((b) => b.content.startsWith("__BUILDS__"))
    .map((b) => {
      try {
        return JSON.parse(b.content.slice("__BUILDS__".length)) as TierData;
      } catch {
        return null;
      }
    })
    .filter(Boolean) as TierData[];

  const [activeTier, setActiveTier] = useState(tiers[0]?.tier ?? "");
  const [activeClass, setActiveClass] = useState<string | null>(null);
  const [mode, setMode] = useState<"All" | "PvE" | "PvP">("All");

  const tier = tiers.find((t) => t.tier === activeTier) ?? tiers[0];
  const cls = tier?.classes.find(
    (c) => c.class === (activeClass ?? tier?.classes[0]?.class),
  );

  const pveCount = cls?.builds.filter((b) => b.mode === "PvE").length ?? 0;
  const pvpCount = cls?.builds.filter((b) => b.mode === "PvP").length ?? 0;
  const hasPvP =
    tier?.classes.some((c) => c.builds.some((b) => b.mode === "PvP")) ?? false;
  const filteredBuilds =
    cls?.builds.filter((b) => mode === "All" || b.mode === mode) ?? [];

  function changeTier(t: string) {
    setActiveTier(t);
    setActiveClass(null);
    setMode("All");
  }

  function changeClass(c: string) {
    setActiveClass(c);
    setMode("All");
  }

  const modes: ("All" | "PvE" | "PvP")[] = ["All", "PvE"];
  if (hasPvP) modes.push("PvP");

  return (
    <div>
      {/* Intro */}
      {(section.introTitle || section.intro) && (
        <Panel corners className="mb-6">
          <div className="panel-inner p-5">
            {section.introTitle && (
              <h2 className="mb-2 font-title text-base font-bold text-glow-accent">
                {section.introTitle}
              </h2>
            )}
            {section.intro && (
              <p className="text-sm leading-relaxed text-white/55">
                {section.intro}
              </p>
            )}
          </div>
        </Panel>
      )}

      {/* Tier tabs */}
      <div className="mb-5 flex flex-wrap gap-2">
        {tiers.map((t) => (
          <button
            key={t.tier}
            onClick={() => changeTier(t.tier)}
            className={`flex min-w-[52px] items-center gap-1.5 rounded border px-4 py-1.5 font-title text-xs font-bold transition ${
              (tier?.tier ?? "") === t.tier
                ? "border-accent bg-accent/15 text-accent shadow-[0_0_10px_rgba(34,224,255,0.12)]"
                : t.coming_soon
                  ? "cursor-default border-white/8 bg-white/[0.02] text-white/20"
                  : "border-white/15 bg-white/[0.03] text-white/40 hover:border-white/30 hover:text-white/65"
            }`}
          >
            {t.tier}
            {t.coming_soon && (
              <span className="text-[8px] text-white/20">🔒</span>
            )}
          </button>
        ))}
      </div>

      {tier?.coming_soon && (
        <Panel corners>
          <div className="panel-inner flex flex-col items-center gap-3 py-14 text-center">
            <span className="font-title text-3xl text-white/10">⏳</span>
            <p className="font-title text-sm font-bold text-white/30">
              {tier.tier} — {tier.label}
            </p>
            <p className="text-xs text-white/20">
              Builds no disponibles aún · Se publican cuando la temporada esté activa en el servidor
            </p>
          </div>
        </Panel>
      )}

      {tier && !tier.coming_soon && (
        <Panel corners>
          <div className="panel-inner p-4 sm:p-5">
            {/* Class tabs */}
            <div className="mb-4 flex flex-wrap gap-x-5 border-b border-white/[0.08] pb-1">
              {tier.classes.map((c) => {
                const isActive =
                  (activeClass ?? tier.classes[0]?.class) === c.class;
                return (
                  <button
                    key={c.class}
                    onClick={() => changeClass(c.class)}
                    className={`mb-2 flex items-center gap-2 border-b-2 pb-2 transition ${
                      isActive
                        ? "border-accent text-white"
                        : "border-transparent text-white/35 hover:text-white/60"
                    }`}
                  >
                    {c.icon && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={c.icon}
                        alt=""
                        className="h-5 w-5 object-contain"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display =
                            "none";
                        }}
                      />
                    )}
                    <span className="font-title text-sm font-bold">
                      {c.class_es}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Mode filter */}
            <div className="mb-5 flex items-center gap-2">
              {modes.map((m) => {
                const count =
                  m === "All"
                    ? pveCount + pvpCount
                    : m === "PvE"
                      ? pveCount
                      : pvpCount;
                return (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`rounded-full border px-3 py-1 font-title text-[11px] font-bold transition ${
                      mode === m
                        ? "border-brand bg-brand/20 text-white"
                        : "border-white/15 text-white/35 hover:text-white/60"
                    }`}
                  >
                    {m}{" "}
                    <span className="opacity-50">{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Build cards */}
            {filteredBuilds.length === 0 ? (
              <p className="py-8 text-center text-sm italic text-white/25">
                Sin builds para este filtro.
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {filteredBuilds.map((build, i) => (
                  <div
                    key={i}
                    className="rounded border border-white/[0.08] bg-white/[0.02] p-4 transition hover:border-white/[0.14]"
                  >
                    {/* Header */}
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-title text-sm font-extrabold text-white">
                        {build.name}
                      </h3>
                      <span
                        className={`rounded px-2 py-0.5 font-title text-[9px] font-bold ${
                          build.mode === "PvP"
                            ? "bg-red-400/15 text-red-300 ring-1 ring-red-400/25"
                            : "bg-brand/15 text-brand/80 ring-1 ring-brand/25"
                        }`}
                      >
                        {build.mode}
                      </span>
                    </div>

                    {/* Técnicas */}
                    <div className="mb-3">
                      <p className="mb-1.5 hud-label text-[9px] text-white/30">
                        TÉCNICAS
                      </p>
                      <div className="flex gap-1.5">
                        {build.techniques.map((sk, j) => (
                          <div key={j} className="flex flex-col items-center gap-1">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={sk.img}
                              alt={sk.name}
                              className="h-9 w-9 rounded border border-white/10 bg-black/50 object-contain p-0.5"
                            />
                            <span className="w-10 text-center text-[7px] leading-tight text-white/30 line-clamp-2">
                              {sk.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Encantos */}
                    <div className="mb-3">
                      <p className="mb-1.5 hud-label text-[9px] text-accent/40">
                        ENCANTOS
                      </p>
                      <div className="flex gap-1.5">
                        {build.enchants.map((sk, j) => (
                          <div key={j} className="flex flex-col items-center gap-1">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={sk.img}
                              alt={sk.name}
                              className="h-9 w-9 rounded border border-accent/15 bg-black/50 object-contain p-0.5 ring-1 ring-accent/10"
                            />
                            <span className="w-10 text-center text-[7px] leading-tight text-white/30 line-clamp-2">
                              {sk.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <p className="text-[11px] leading-relaxed text-white/40">
                      {build.desc}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Panel>
      )}
    </div>
  );
}
