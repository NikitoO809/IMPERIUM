"use client";

// Hero de la portada (isla cliente): escudo central — dragón arriba y el
// nombre IMPERIUM debajo — con entrada escalonada por spring physics.
import Link from "next/link";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { LoginButton } from "@/components/auth/LoginButton";
import { Magnetic } from "@/components/ui/Magnetic";
import { ArrowRight, ArrowUpRight } from "@/components/ui/GlassCard";
import { DiscordIcon } from "@/components/icons";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.04 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 90, damping: 18 } },
};

export function HomeHero({ members, online }: { members: string; online: string }) {
  return (
    <section className="relative mx-auto flex min-h-[88vh] max-w-4xl flex-col items-center justify-center px-4 pb-20 pt-24 text-center sm:px-6">
      <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col items-center">
        <motion.span variants={item} className="eyebrow">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          Comunidad de Discord · ES
        </motion.span>

        {/* Dragón (arriba) con halo neutro de apoyo.
            Es el elemento LCP: NO lleva el variant `item` (opacity:0) para que
            no espere a la animación de entrada; se pinta de inmediato con priority. */}
        <div className="relative mt-8">
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: "radial-gradient(closest-side, rgba(255,255,255,0.06), transparent 70%)" }}
            aria-hidden
          />
          <Image
            src="/brand/dragon-trans.png"
            alt="Dragón de IMPERIUM"
            width={208}
            height={78}
            priority
            className="tint-emblem float relative mx-auto h-40 w-auto sm:h-52"
          />
        </div>

        {/* Nombre (debajo, tucked justo bajo el dragón) */}
        <motion.h1
          variants={item}
          className="font-display -mt-3 text-6xl leading-[0.9] tracking-tight text-white sm:text-8xl"
        >
          IMPERIUM
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-7 max-w-xl text-lg leading-relaxed text-zinc-400"
        >
          Una comunidad que juega junta. Guías paso a paso, tu progreso guardado
          y gente con quien jugar. Vota el próximo juego al que saltamos.
        </motion.p>

        <motion.div variants={item} className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Magnetic strength={0.3}>
            <LoginButton className="pill pill-primary">
              <DiscordIcon className="h-5 w-5" />
              <span>Entrar con Discord</span>
              <span className="icon-badge">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </LoginButton>
          </Magnetic>
          <Magnetic strength={0.3}>
            <Link href="/juegos" className="pill pill-ghost">
              <span>Ver las guías</span>
              <span className="icon-badge">
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </Magnetic>
        </motion.div>

        {/* Datos en vivo del Discord (línea sobria) */}
        <motion.div
          variants={item}
          className="mt-9 flex items-center gap-2.5 text-sm text-zinc-500"
        >
          <span className="live-dot h-1.5 w-1.5 rounded-full bg-gold" />
          <span className="font-num text-zinc-200">{online}</span>
          <span>en línea</span>
          <span className="text-zinc-700">·</span>
          <span className="font-num text-zinc-200">{members}</span>
          <span>miembros</span>
        </motion.div>
      </motion.div>
    </section>
  );
}
