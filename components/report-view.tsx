"use client";

import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  Clock3,
  Download,
  Eye,
  Lightbulb,
  MapPin,
  PackageCheck,
  Sparkles,
} from "lucide-react";
import { Brand } from "@/components/brand";
import { StatusPill } from "@/components/status-pill";
import { Button } from "@/components/ui/button";
import type { ShopCase } from "@/lib/domain";
import { cn } from "@/lib/utils";

const timeline = [
  { status: "recibido", title: "Solicitud recibida", text: "Guardamos tus datos de contacto y las fotos que hayas adjuntado.", icon: Check },
  { status: "en_revision", title: "Evaluación del consultor", text: "Te contactamos y coordinamos una visita presencial si hace falta.", icon: Eye },
  { status: "listo", title: "Informe listo", text: "Tus recomendaciones están disponibles para aplicar.", icon: PackageCheck },
] as const;

export function ReportView({ item, submitted = false }: { item: ShopCase | null; submitted?: boolean }) {
  if (!item) return <div className="grid min-h-screen place-items-center bg-cream px-5 text-center"><div className="max-w-sm"><AlertCircle className="mx-auto size-10 text-coral" /><h1 className="mt-4 text-2xl font-extrabold text-forest">No pudimos abrir el informe</h1><p className="mt-3 text-sm leading-6 text-forest/55">Revisa que estés usando el enlace privado completo.</p><Link href="/" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-coral"><ArrowLeft className="size-4" /> Volver al inicio</Link></div></div>;

  const recommendations = item.recommendations || [];
  const currentIndex = item.status === "listo" ? 2 : item.status === "en_revision" ? 1 : 0;

  return (
    <main className="min-h-screen bg-cream text-forest">
      <header className="no-print border-b border-forest/10 bg-white">
        <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-5 sm:px-8"><Brand /><div className="flex items-center gap-3"><span className="hidden text-xs font-bold text-forest/38 sm:block">{item.id}</span><Button type="button" variant="outline" onClick={() => window.print()} className="h-10 rounded-full border-forest/12 bg-white px-4 text-xs text-forest"><Download className="size-4" /> Guardar PDF</Button></div></div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        {submitted && (
          <section role="status" className="mb-7 flex items-start gap-4 rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-950">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-emerald-600 text-white"><Check className="size-5" /></span>
            <div><p className="font-extrabold">Solicitud enviada correctamente</p><p className="mt-1 text-sm leading-6 text-emerald-900/70">Recibimos tus datos. Te contactaremos por WhatsApp o teléfono para coordinar la evaluación de tu tienda en Quito.</p></div>
          </section>
        )}
        <section className="relative overflow-hidden rounded-2xl bg-forest p-7 text-white shadow-[0_24px_60px_rgba(19,71,55,.16)] sm:p-10">
          <div className="absolute -right-12 -top-12 size-52 rounded-full bg-coral/18" /><div className="absolute -bottom-20 right-32 size-48 rounded-full bg-lime/8" />
          <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
            <div><p className="text-xs font-extrabold uppercase tracking-[.17em] text-lime">Diagnóstico de tienda</p><h1 className="mt-3 text-4xl font-[760] tracking-[-.045em] sm:text-5xl">{item.shopName}</h1><p className="mt-4 flex items-center gap-2 text-sm text-white/58"><MapPin className="size-4 text-coral" />{item.location} · {item.shopType}</p></div>
            <div className="w-fit rounded-2xl bg-white p-4 text-forest"><p className="text-[10px] font-extrabold uppercase tracking-[.13em] text-forest/38">Estado actual</p><div className="mt-2"><StatusPill status={item.status} /></div></div>
          </div>
        </section>

        <section className="mt-7 rounded-xl border border-forest/9 bg-white p-5 sm:p-7">
          <div className="flex items-center gap-3"><Clock3 className="size-5 text-coral" /><h2 className="font-extrabold">Avance de tu diagnóstico</h2></div>
          <div className="mt-6 grid gap-3 md:grid-cols-3">{timeline.map((stage, index) => { const Icon = stage.icon; const complete = index <= currentIndex; return <div key={stage.status} className={cn("relative rounded-2xl border p-4", complete ? "border-forest/10 bg-mint/45" : "border-forest/8 bg-[#fafbf9] opacity-58")}><div className={cn("grid size-9 place-items-center rounded-xl", complete ? "bg-forest text-white" : "bg-forest/7 text-forest/38")}><Icon className="size-4" /></div><p className="mt-4 text-sm font-extrabold">{stage.title}</p><p className="mt-1 text-xs leading-5 text-forest/50">{stage.text}</p></div>; })}</div>
        </section>

        {item.status !== "listo" ? (
          <section className="mt-7 rounded-xl border border-forest/9 bg-white p-8 text-center sm:p-12">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-[#fff0eb] text-coral"><Sparkles className="size-7" /></span>
            <h2 className="mt-5 text-3xl font-[760] tracking-[-.035em]">Estamos trabajando en tu tienda.</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-forest/55">Te contactaremos para revisar el caso y, si corresponde, coordinar una visita al local. Después, este enlace mostrará tus recomendaciones.</p>
          </section>
        ) : (
          <>
            <section className="mt-12"><div className="max-w-2xl"><p className="eyebrow">Tu plan de acción</p><h2 className="mt-3 text-4xl font-[760] tracking-[-.045em] sm:text-5xl">Cambios concretos para empezar hoy.</h2><p className="mt-4 leading-7 text-forest/58">Aplica primero las acciones de prioridad alta. Después continúa con las mejoras de impacto medio y bajo.</p></div>
              <div className="mt-7 grid gap-5 lg:grid-cols-2">{recommendations.map((recommendation, index) => <article key={recommendation.id || index} className="print-card rounded-xl border border-forest/9 bg-white p-6 shadow-[0_16px_40px_rgba(19,71,55,.06)]"><div className="flex items-start justify-between gap-4"><span className="grid size-10 place-items-center rounded-lg bg-forest text-lg font-extrabold text-white">{index + 1}</span><span className={cn("rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-wide", recommendation.priority === "alta" ? "bg-red-100 text-red-700" : recommendation.priority === "baja" ? "bg-slate-100 text-slate-600" : "bg-amber-100 text-amber-700")}>Prioridad {recommendation.priority}</span></div><p className="mt-6 text-[10px] font-extrabold uppercase tracking-[.15em] text-coral">{recommendation.area}</p><h3 className="mt-2 text-xl font-extrabold leading-7">{recommendation.title}</h3><p className="mt-3 text-sm leading-7 text-forest/60">{recommendation.detail}</p></article>)}</div>
            </section>
            <section className="mt-7 flex flex-col gap-5 rounded-xl bg-[#ffe7dd] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8"><div className="flex gap-4"><span className="grid size-11 shrink-0 place-items-center rounded-lg bg-white text-coral"><Lightbulb className="size-5" /></span><div><h3 className="font-extrabold">Haz un cambio a la vez</h3><p className="mt-1 max-w-2xl text-sm leading-6 text-forest/58">Toma una foto antes y otra después. Así podrás comparar el cambio y observar cómo reaccionan tus clientes.</p></div></div><Button type="button" variant="outline" onClick={() => window.print()} className="no-print h-11 shrink-0 rounded-lg border-forest/12 bg-white px-5 text-forest"><Download className="size-4" /> Guardar informe</Button></section>
          </>
        )}

        <footer className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-forest/10 py-7 sm:flex-row sm:items-center"><div><Brand /><p className="mt-1 text-xs text-forest/42">Tu tienda, mejor organizada.</p></div><p className="text-xs text-forest/38">Informe preparado para {item.ownerName}</p></footer>
      </div>
    </main>
  );
}
