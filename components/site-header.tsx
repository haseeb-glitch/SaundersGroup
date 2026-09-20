"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { Brand } from "@/components/brand";

const WHATSAPP_NUMBER = "+593 99 123 4567";
const WHATSAPP_URL = "https://wa.me/593991234567?text=Hola%20Saunders%20Group%2C%20me%20gustar%C3%ADa%20coordinar%20una%20evaluaci%C3%B3n%20de%20mi%20tienda.";

export function SiteHeader({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="no-print sticky top-0 z-40 border-b border-forest/10 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-17 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <Brand />
        <nav className="hidden items-center gap-7 md:flex" aria-label="Navegación principal">
          {!compact && <><Link href="/#analisis" className="text-sm font-semibold text-forest/68 transition hover:text-coral">Qué analizamos</Link><Link href="/#como-funciona" className="text-sm font-semibold text-forest/68 transition hover:text-coral">Cómo funciona</Link></>}
        </nav>
        <div className="flex items-center gap-2">
          {compact ? <Link href="/" className="hidden h-10 items-center rounded-lg border border-forest/15 px-4 text-sm font-bold text-forest transition hover:bg-cream sm:inline-flex">Volver al sitio</Link> : <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="hidden h-10 items-center gap-2 rounded-lg bg-forest px-5 text-sm font-bold text-white transition hover:bg-forest-2 sm:inline-flex">WhatsApp <span className="opacity-80">{WHATSAPP_NUMBER}</span> <ArrowRight className="size-4" /></a>}
          <button type="button" onClick={() => setOpen((value) => !value)} aria-label={open ? "Cerrar menú" : "Abrir menú"} aria-expanded={open} className="grid size-10 place-items-center rounded-lg border border-forest/12 bg-white text-forest md:hidden">{open ? <X className="size-5" /> : <Menu className="size-5" />}</button>
        </div>
      </div>
      {open && <nav className="border-t border-forest/10 bg-white px-5 py-4 md:hidden" aria-label="Navegación móvil"><div className="mx-auto flex max-w-7xl flex-col gap-1">{!compact && <><Link href="/#analisis" onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-sm font-bold text-forest/70">Qué analizamos</Link><Link href="/#como-funciona" onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-sm font-bold text-forest/70">Cómo funciona</Link></>}{compact ? <Link href="/" className="mt-2 inline-flex h-11 items-center justify-center rounded-lg border border-forest/15 text-sm font-bold text-forest">Volver al sitio</Link> : <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-forest text-sm font-bold text-white">Contactar por WhatsApp <ArrowRight className="size-4" /></a>}</div></nav>}
    </header>
  );
}
