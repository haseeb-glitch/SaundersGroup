"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  ChevronRight,
  CircleCheck,
  Clock3,
  Eye,
  LayoutDashboard,
  MapPin,
  Search,
  Store,
} from "lucide-react";
import { Brand } from "@/components/brand";
import { StatusPill } from "@/components/status-pill";
import { DEMO_CASES, type CaseStatus, type ShopCase } from "@/lib/domain";
import { cn } from "@/lib/utils";

const filters: { label: string; value: "todos" | CaseStatus }[] = [
  { label: "Todos", value: "todos" },
  { label: "Recibidos", value: "recibido" },
  { label: "En revisión", value: "en_revision" },
  { label: "Listos", value: "listo" },
];

export function ConsultantDashboard() {
  const [cases, setCases] = useState<ShopCase[]>(DEMO_CASES);
  const [filter, setFilter] = useState<"todos" | CaseStatus>("todos");
  const [search, setSearch] = useState("");
  const [demoMode, setDemoMode] = useState(true);

  useEffect(() => {
    fetch("/api/cases")
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((payload: { cases?: ShopCase[] }) => {
        if (payload.cases?.length) {
          setCases(payload.cases);
          setDemoMode(false);
        }
      })
      .catch(() => undefined);
  }, []);

  const visible = useMemo(() => cases.filter((item) => {
    const matchesFilter = filter === "todos" || item.status === filter;
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || `${item.shopName} ${item.ownerName} ${item.location} ${item.id}`.toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  }), [cases, filter, search]);

  const counts = {
    total: cases.length,
    recibido: cases.filter((item) => item.status === "recibido").length,
    en_revision: cases.filter((item) => item.status === "en_revision").length,
    listo: cases.filter((item) => item.status === "listo").length,
  };

  return (
    <main className="min-h-screen bg-[#f5f7f4] text-forest">
      <header className="border-b border-forest/10 bg-white">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <div className="flex items-center gap-5"><Brand /><span className="hidden h-5 w-px bg-forest/15 sm:block" /><span className="hidden items-center gap-2 text-sm font-bold text-forest/60 sm:flex"><LayoutDashboard className="size-4" /> Panel consultor</span></div>
          <div className="flex items-center gap-3"><Link href="/" className="hidden text-sm font-semibold text-forest/55 hover:text-forest sm:block">Ver sitio</Link><Link href="/diagnostico" className="inline-flex h-10 items-center gap-2 rounded-full bg-forest px-4 text-xs font-bold text-white hover:bg-forest-2 sm:text-sm">Nueva solicitud <ArrowUpRight className="size-4" /></Link></div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-9 sm:px-8 lg:px-10 lg:py-12">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div><p className="eyebrow">Vista general</p><h1 className="mt-2 text-4xl font-[760] tracking-[-.045em] sm:text-5xl">Casos de tiendas</h1><p className="mt-3 text-sm text-forest/55">Revisa las fotos, documenta hallazgos y prepara el informe de cada comercio.</p></div>
          {demoMode && <div className="rounded-full border border-coral/20 bg-[#fff2ed] px-4 py-2 text-xs font-bold text-coral">Datos de demostración</div>}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Solicitudes" value={counts.total} icon={Store} color="bg-forest text-white" />
          <StatCard label="Por revisar" value={counts.recibido} icon={Clock3} color="bg-amber-100 text-amber-800" />
          <StatCard label="En análisis" value={counts.en_revision} icon={Eye} color="bg-blue-100 text-blue-800" />
          <StatCard label="Entregados" value={counts.listo} icon={CircleCheck} color="bg-emerald-100 text-emerald-800" />
        </div>

        <section className="mt-8 overflow-hidden rounded-2xl border border-forest/10 bg-white shadow-[0_18px_45px_rgba(19,71,55,.06)]">
          <div className="flex flex-col gap-4 border-b border-forest/10 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-1 overflow-x-auto rounded-xl bg-[#f3f5f2] p-1 scrollbar-none">{filters.map((item) => <button key={item.value} type="button" onClick={() => setFilter(item.value)} className={cn("whitespace-nowrap rounded-lg px-4 py-2 text-xs font-bold transition", filter === item.value ? "bg-white text-forest shadow-sm" : "text-forest/48 hover:text-forest")}>{item.label}</button>)}</div>
            <label className="relative block w-full lg:max-w-xs"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-forest/35" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar tienda, ciudad o código..." className="h-10 w-full rounded-xl border border-forest/12 bg-white pl-10 pr-4 text-sm outline-none transition placeholder:text-forest/35 focus:border-coral" /></label>
          </div>

          <div className="hidden grid-cols-[1.4fr_.85fr_.75fr_.5fr_auto] gap-5 border-b border-forest/8 bg-[#fafbf9] px-6 py-3 text-[10px] font-extrabold uppercase tracking-[.14em] text-forest/38 lg:grid">
            <span>Tienda</span><span>Ubicación</span><span>Ingreso</span><span>Estado</span><span />
          </div>

          <div className="divide-y divide-forest/8">
            {visible.map((item) => (
              <Link key={item.id} href={`/caso/${item.id}`} className="group grid gap-4 p-5 transition hover:bg-cream/45 sm:p-6 lg:grid-cols-[1.4fr_.85fr_.75fr_.5fr_auto] lg:items-center lg:gap-5">
                <div className="flex items-center gap-4"><span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-mint font-display text-lg font-semibold text-forest">{item.shopName.charAt(0)}</span><div className="min-w-0"><p className="truncate font-extrabold text-forest">{item.shopName}</p><p className="mt-1 text-xs text-forest/45">{item.shopType} · {item.id}</p></div></div>
                <div className="flex items-center gap-2 text-sm text-forest/57"><MapPin className="size-4 shrink-0 text-coral" />{item.location}</div>
                <div className="flex items-center gap-2 text-sm text-forest/57"><CalendarDays className="size-4 shrink-0" />{formatDate(item.createdAt)}</div>
                <div><StatusPill status={item.status} /></div>
                <ChevronRight className="hidden size-5 text-forest/25 transition group-hover:translate-x-1 group-hover:text-coral lg:block" />
              </Link>
            ))}
            {!visible.length && <div className="px-6 py-16 text-center"><Search className="mx-auto size-7 text-forest/25" /><p className="mt-3 font-bold text-forest">No encontramos casos</p><p className="mt-1 text-sm text-forest/45">Prueba con otra búsqueda o filtro.</p></div>}
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: typeof Store; color: string }) {
  return <article className="flex items-center justify-between rounded-2xl border border-forest/9 bg-white p-5"><div><p className="text-xs font-bold text-forest/45">{label}</p><p className="mt-1 text-3xl font-black tracking-[-.04em] text-forest">{value}</p></div><span className={cn("grid size-11 place-items-center rounded-2xl", color)}><Icon className="size-5" /></span></article>;
}

function formatDate(value: string) {
  const date = new Date(value.replace(" ", "T") + (value.includes("Z") ? "" : "Z"));
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("es-EC", {
        day: "2-digit",
        month: "short",
        timeZone: "UTC",
      }).format(date);
}
