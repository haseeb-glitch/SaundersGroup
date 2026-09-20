/* eslint-disable @next/next/no-img-element -- authenticated uploaded photos are served by the app API. */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Camera,
  ClipboardList,
  Copy,
  Loader2,
  MapPin,
  MessageCircle,
  Plus,
  Send,
  Sparkles,
  Store,
  User,
} from "lucide-react";
import { Brand } from "@/components/brand";
import { StatusPill } from "@/components/status-pill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getDemoCase, type Recommendation, type ShopCase } from "@/lib/domain";
import { cn } from "@/lib/utils";

const blankRecommendation: Recommendation = { area: "", title: "", detail: "", priority: "media" };

export function CaseWorkspace({ id }: { id: string }) {
  const demoCase = getDemoCase(id);
  const [item, setItem] = useState<ShopCase | null>(demoCase || null);
  const [loading, setLoading] = useState(!demoCase);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState<Recommendation>(blankRecommendation);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (demoCase) return;
    fetch(`/api/cases/${id}?scope=consultant`)
      .then(async (response) => {
        const payload = await response.json() as { case?: ShopCase; error?: string };
        if (!response.ok || !payload.case) throw new Error(payload.error || "No se pudo abrir el caso.");
        setItem(payload.case);
      })
      .catch((caught) => setError(caught instanceof Error ? caught.message : "No se pudo abrir el caso."))
      .finally(() => setLoading(false));
  }, [id, demoCase]);

  async function addRecommendation() {
    if (!draft.title.trim() || !draft.detail.trim()) {
      setError("Añade un título y una recomendación antes de guardar.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      let created: Recommendation = { ...draft, id: Date.now(), area: draft.area || "Área general" };
      if (!demoCase) {
        const response = await fetch(`/api/cases/${id}/recommendations`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(draft) });
        const payload = await response.json() as { recommendation?: Recommendation; error?: string };
        if (!response.ok || !payload.recommendation) throw new Error(payload.error || "No se pudo guardar.");
        created = payload.recommendation;
      }
      setItem((current) => current ? { ...current, recommendations: [...(current.recommendations || []), created] } : current);
      setDraft(blankRecommendation);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  }

  async function publishReport() {
    if (!item?.recommendations?.length) {
      setError("Añade por lo menos una recomendación antes de marcar el informe como listo.");
      return;
    }
    setSaving(true);
    try {
      if (!demoCase) {
        const response = await fetch(`/api/cases/${id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ status: "listo" }) });
        if (!response.ok) throw new Error("No se pudo actualizar el estado.");
      }
      setItem((current) => current ? { ...current, status: "listo" } : current);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No se pudo actualizar el estado.");
    } finally {
      setSaving(false);
    }
  }

  async function copyReportLink() {
    if (!item) return;
    const path = `/informe/${item.id}?token=${item.accessToken || "demo"}`;
    await navigator.clipboard.writeText(`${window.location.origin}${path}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  if (loading) return <div className="grid min-h-screen place-items-center bg-[#f5f7f4] text-forest"><Loader2 className="size-7 animate-spin" /></div>;
  if (!item) return <div className="grid min-h-screen place-items-center bg-[#f5f7f4] px-5 text-center"><div><p className="text-xl font-bold text-forest">Caso no disponible</p><p className="mt-2 text-sm text-red-700">{error}</p><Link href="/consultor" className="mt-5 inline-flex text-sm font-bold text-coral">Volver al panel</Link></div></div>;

  const recommendations = item.recommendations || [];

  return (
    <main className="min-h-screen bg-[#f5f7f4] text-forest">
      <header className="border-b border-forest/10 bg-white">
        <div className="mx-auto flex h-18 max-w-[1450px] items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-5"><Brand /><span className="hidden h-5 w-px bg-forest/15 sm:block" /><Link href="/consultor" className="hidden items-center gap-2 text-sm font-bold text-forest/55 hover:text-forest sm:flex"><ArrowLeft className="size-4" /> Casos</Link></div>
          <div className="flex items-center gap-2"><Button type="button" variant="outline" onClick={copyReportLink} className="h-10 rounded-full border-forest/12 bg-white px-4 text-xs text-forest"><Copy className="size-4" />{copied ? "Copiado" : "Copiar enlace"}</Button><Link href={`/informe/${item.id}?token=${item.accessToken || "demo"}`} target="_blank" className="inline-flex h-10 items-center gap-2 rounded-full bg-forest px-4 text-xs font-bold text-white">Ver informe <ArrowUpRight className="size-4" /></Link></div>
        </div>
      </header>

      <div className="mx-auto max-w-[1450px] px-5 py-8 sm:px-8">
        <div className="flex flex-col justify-between gap-5 border-b border-forest/10 pb-7 md:flex-row md:items-end">
          <div><div className="flex items-center gap-3"><StatusPill status={item.status} /><span className="font-mono text-xs font-bold text-forest/38">{item.id}</span></div><h1 className="mt-3 text-4xl font-[760] tracking-[-.045em] sm:text-5xl">{item.shopName}</h1><p className="mt-2 flex items-center gap-2 text-sm text-forest/52"><MapPin className="size-4 text-coral" />{item.location}</p></div>
          <Button type="button" onClick={publishReport} disabled={saving || item.status === "listo"} className="h-11 rounded-full bg-coral px-5 text-white hover:bg-[#d85532]"><Send className="size-4" />{item.status === "listo" ? "Informe entregado" : "Marcar informe como listo"}</Button>
        </div>

        {error && <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>}

        <div className="mt-7 grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
          <div className="space-y-6">
            <section className="rounded-xl border border-forest/9 bg-white p-5 sm:p-6">
              <div className="flex items-center justify-between"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-mint"><Camera className="size-5" /></span><div><h2 className="font-extrabold">Fotos de la tienda</h2><p className="text-xs text-forest/43">{item.photos?.length || 0} imágenes</p></div></div></div>
              {item.photos?.length ? <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">{item.photos.map((photo) => <a key={photo.id} href={`/api/photos/${photo.id}`} target="_blank" className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-cream"><img src={`/api/photos/${photo.id}`} alt={photo.fileName} className="size-full object-cover transition duration-300 group-hover:scale-105" /></a>)}</div> : <div className="mt-5 grid min-h-48 place-items-center rounded-2xl border border-dashed border-forest/14 bg-cream/45 text-center"><div><Camera className="mx-auto size-6 text-forest/25" /><p className="mt-2 text-sm font-bold text-forest/45">No se adjuntaron fotos</p><p className="mt-1 text-xs text-forest/35">Coordina una visita al local para realizar la evaluación.</p></div></div>}
            </section>

            <section className="rounded-xl border border-forest/9 bg-white p-5 sm:p-6">
              <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-[#fff0eb] text-coral"><ClipboardList className="size-5" /></span><div><h2 className="font-extrabold">Datos para coordinar</h2><p className="text-xs text-forest/43">Información básica enviada por el propietario</p></div></div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2"><Info icon={User} label="Contacto" value={item.ownerName} /><Info icon={MessageCircle} label="WhatsApp / teléfono" value={item.phone || "No indicado"} /><Info icon={MapPin} label="Dirección del local" value={item.location} wide /></div>
              <div className="mt-5 rounded-2xl bg-cream/60 p-5"><p className="text-xs font-extrabold uppercase tracking-[.13em] text-coral">Siguiente paso</p><p className="mt-2 leading-7 text-forest/70">Contacta al propietario para revisar el caso y coordinar una visita presencial si hace falta. El diagnóstico lo realiza el consultor.</p></div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-xl border border-forest/9 bg-white p-5 sm:p-6">
              <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-lime/45 text-forest"><Sparkles className="size-5" /></span><div><h2 className="font-extrabold">Recomendaciones</h2><p className="text-xs text-forest/43">{recommendations.length} {recommendations.length === 1 ? "acción preparada" : "acciones preparadas"}</p></div></div>
              <div className="mt-5 space-y-3">{recommendations.map((recommendation, index) => <div key={recommendation.id || index} className="rounded-2xl border border-forest/9 bg-cream/45 p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-extrabold uppercase tracking-[.14em] text-coral">{recommendation.area}</p><h3 className="mt-1 font-extrabold leading-5">{recommendation.title}</h3></div><span className={cn("rounded-full px-2 py-1 text-[9px] font-black uppercase", recommendation.priority === "alta" ? "bg-red-100 text-red-700" : recommendation.priority === "baja" ? "bg-slate-100 text-slate-600" : "bg-amber-100 text-amber-700")}>{recommendation.priority}</span></div><p className="mt-3 text-sm leading-6 text-forest/58">{recommendation.detail}</p></div>)}</div>
              {!recommendations.length && <div className="mt-5 rounded-2xl border border-dashed border-forest/14 px-5 py-8 text-center"><p className="text-sm font-bold text-forest/45">Aún no hay recomendaciones</p><p className="mt-1 text-xs text-forest/35">Añade la primera acción abajo.</p></div>}
            </section>

            <section className="rounded-xl bg-forest p-5 text-white sm:p-6">
              <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-white/10"><Plus className="size-5 text-lime" /></span><div><h2 className="font-extrabold">Nueva recomendación</h2><p className="text-xs text-white/45">Escribe una acción concreta y aplicable</p></div></div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2"><div><label className="mb-1.5 block text-xs font-bold text-white/60">Área</label><Input value={draft.area} onChange={(event) => setDraft({ ...draft, area: event.target.value })} placeholder="Ej. Entrada" className="h-11 rounded-xl border-white/12 bg-white/8 text-white placeholder:text-white/30" /></div><div><label className="mb-1.5 block text-xs font-bold text-white/60">Prioridad</label><select value={draft.priority} onChange={(event) => setDraft({ ...draft, priority: event.target.value as Recommendation["priority"] })} className="h-11 w-full rounded-xl border border-white/12 bg-white/8 px-3 text-sm text-white outline-none"><option className="text-forest" value="alta">Alta</option><option className="text-forest" value="media">Media</option><option className="text-forest" value="baja">Baja</option></select></div></div>
              <div className="mt-4"><label className="mb-1.5 block text-xs font-bold text-white/60">Título de la acción</label><Input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder="Ej. Mueve bebidas al nivel de los ojos" className="h-11 rounded-xl border-white/12 bg-white/8 text-white placeholder:text-white/30" /></div>
              <div className="mt-4"><label className="mb-1.5 block text-xs font-bold text-white/60">Detalle</label><Textarea value={draft.detail} onChange={(event) => setDraft({ ...draft, detail: event.target.value })} placeholder="Explica qué cambiar, dónde y por qué..." className="min-h-28 rounded-xl border-white/12 bg-white/8 text-white placeholder:text-white/30" /></div>
              <Button type="button" onClick={addRecommendation} disabled={saving} className="mt-4 h-11 w-full rounded-xl bg-lime font-extrabold text-forest hover:bg-[#d8ee75]">{saving ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />} Añadir al informe</Button>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Info({ icon: Icon, label, value, wide = false }: { icon: typeof Store; label: string; value: string; wide?: boolean }) {
  return <div className={cn("flex gap-3 rounded-xl border border-forest/8 p-4", wide && "sm:col-span-2")}><Icon className="mt-0.5 size-4 shrink-0 text-coral" /><div><p className="text-[10px] font-extrabold uppercase tracking-[.12em] text-forest/38">{label}</p><p className="mt-1 text-sm font-semibold leading-6 text-forest/70">{value}</p></div></div>;
}
