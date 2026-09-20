/* eslint-disable @next/next/no-img-element -- these static assets do not need runtime image processing. */
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ClipboardCheck,
  Eye,
  LayoutGrid,
  MapPin,
  MoveRight,
  PackageSearch,
  Route,
  ShoppingBasket,
} from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const WHATSAPP_NUMBER = "+593 99 123 4567";
const WHATSAPP_URL = "https://wa.me/593991234567?text=Hola%20Saunders%20Group%2C%20me%20gustar%C3%ADa%20coordinar%20una%20evaluaci%C3%B3n%20de%20mi%20tienda.";

const reviewAreas = [
  {
    icon: Eye,
    title: "Entrada y primera impresión",
    text: "Revisamos qué ve el cliente al entrar y si los productos clave quedan visibles desde el acceso.",
  },
  {
    icon: Route,
    title: "Recorrido del cliente",
    text: "Identificamos obstáculos, pasillos confusos y zonas que reciben poca atención.",
  },
  {
    icon: LayoutGrid,
    title: "Orden por categorías",
    text: "Agrupamos productos relacionados para que encontrarlos y compararlos resulte más fácil.",
  },
  {
    icon: MoveRight,
    title: "Altura y ubicación",
    text: "Definimos qué productos conviene colocar a la altura de los ojos, arriba o en niveles bajos.",
  },
  {
    icon: PackageSearch,
    title: "Productos de baja rotación",
    text: "Buscamos nuevas posiciones y combinaciones para dar visibilidad al stock que se mueve poco.",
  },
  {
    icon: ShoppingBasket,
    title: "Zona de caja",
    text: "Aprovechamos el último punto del recorrido sin saturar el espacio de cobro.",
  },
];

const steps = [
  {
    number: "01",
    icon: ClipboardCheck,
    title: "Déjanos tu WhatsApp",
    text: "Solo necesitamos tu nombre, número de contacto y la dirección del local en Quito. Las fotos son opcionales.",
  },
  {
    number: "02",
    icon: Check,
    title: "Coordinamos la evaluación",
    text: "Un consultor te contacta, revisa el local y, si hace falta, agenda una visita presencial antes de preparar las recomendaciones.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <SiteHeader />

      <section className="border-b border-forest/10 bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-12 sm:px-8 lg:grid-cols-[.92fr_1.08fr] lg:px-10 lg:py-18">
          <div className="max-w-xl">
            <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.16em] text-coral">
              <MapPin className="size-3.5" /> Atención personalizada en Quito
            </p>
            <h1 className="mt-5 text-[clamp(2.75rem,5vw,4.6rem)] font-[780] leading-[.98] tracking-[-.055em] text-forest">
              Organiza mejor tu tienda. Facilita cada compra.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-forest/65">
              Déjanos tu WhatsApp y coordinamos una evaluación de tu local. Nosotros identificamos las oportunidades y te damos recomendaciones concretas para organizar mejor tu tienda.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-forest px-6 text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(18,72,55,.16)] transition hover:-translate-y-0.5 hover:bg-forest-2">
                Contactar por WhatsApp <ArrowRight className="size-4" />
              </a>
              <a href="#informe" className="inline-flex h-12 items-center justify-center rounded-lg border border-forest/16 bg-white px-6 text-sm font-extrabold text-forest transition hover:bg-cream">
                Ver ejemplo de informe
              </a>
            </div>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-coral underline-offset-4 hover:underline">
              {WHATSAPP_NUMBER}
            </a>
            <p className="mt-5 text-sm font-medium text-forest/45">Solo tres datos · Sin preguntas técnicas · Servicio disponible únicamente en Quito.</p>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-forest/10 bg-[#d9c9b3] shadow-[0_24px_55px_rgba(18,72,55,.16)]">
              <img src="/og.png" alt="Interior ordenado de una tienda de barrio" className="h-[430px] w-full scale-[1.28] object-cover object-[100%_center] sm:h-[520px]" />
            </div>
            <div className="absolute bottom-4 left-4 right-4 border border-forest/10 bg-white/95 p-4 shadow-lg backdrop-blur sm:bottom-6 sm:left-6 sm:right-auto sm:w-[330px] sm:p-5">
              <p className="text-xs font-extrabold uppercase tracking-[.13em] text-coral">Atención personal en Quito</p>
              <p className="mt-1 text-base font-extrabold text-forest">Evaluación con visita al local</p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-forest/55">
                <span className="flex items-center gap-1.5"><Check className="size-3.5 text-forest" /> WhatsApp</span>
                <span className="flex items-center gap-1.5"><Check className="size-3.5 text-forest" /> Fotos opcionales</span>
                <span className="flex items-center gap-1.5"><Check className="size-3.5 text-forest" /> Visita presencial</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-forest/10 bg-cream">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-forest/10 px-5 sm:px-8 md:grid-cols-4 md:divide-y-0 lg:px-10">
          {["Distribución", "Categorías", "Rotación", "Recorrido"].map((label, index) => (
            <div key={label} className="px-4 py-6 text-center md:py-7">
              <p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-coral">0{index + 1}</p>
              <p className="mt-1 text-sm font-extrabold text-forest">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="experiencia" className="relative overflow-hidden bg-forest py-16 text-white sm:py-20">
        <div className="absolute -right-24 -top-28 size-72 rounded-full border border-white/10" />
        <div className="absolute -bottom-36 right-20 size-64 rounded-full bg-coral/10" />
        <div className="relative mx-auto grid max-w-7xl gap-9 px-5 sm:px-8 lg:grid-cols-[.58fr_1.42fr] lg:items-center lg:px-10">
          <div className="border-b border-white/12 pb-8 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-12">
            <p className="text-[clamp(4.8rem,10vw,8rem)] font-black leading-none tracking-[-.075em] text-lime">10+</p>
            <p className="mt-2 text-base font-extrabold uppercase tracking-[.14em] text-white">años de experiencia</p>
          </div>
          <div className="max-w-3xl">
            <p className="text-xs font-extrabold uppercase tracking-[.18em] text-coral">Experiencia en supermercados</p>
            <h2 className="mt-4 text-3xl font-[760] leading-[1.08] tracking-[-.04em] sm:text-4xl">Conocemos cómo una mejor exhibición facilita la compra y ayuda a vender más.</h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/62">Contamos con más de una década de experiencia en el sector de supermercados. Ahora llevamos ese conocimiento directamente a minimarkets, bodegas y pequeñas tiendas de Quito, con recomendaciones realistas para cada espacio.</p>
          </div>
        </div>
      </section>

      <section id="analisis" className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="grid gap-7 lg:grid-cols-[.75fr_1.25fr] lg:items-end">
            <div>
              <p className="eyebrow">Qué analizamos</p>
              <h2 className="section-title mt-4">Seis zonas que influyen en la compra.</h2>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-forest/60 lg:justify-self-end">
              No tienes que decirnos qué está mal. Revisamos las fotos y, cuando corresponde, visitamos tu local para identificar cambios realistas que puedas aplicar con tu mobiliario y surtido.
            </p>
          </div>

          <div className="mt-12 grid border-t border-forest/12 md:grid-cols-2">
            {reviewAreas.map(({ icon: Icon, title, text }, index) => (
              <article key={title} className={`grid grid-cols-[auto_1fr] gap-4 border-b border-forest/12 py-6 md:gap-5 ${index % 2 === 0 ? "md:border-r md:pr-8" : "md:pl-8"}`}>
                <span className="grid size-10 place-items-center rounded-lg bg-mint text-forest"><Icon className="size-5" /></span>
                <div><h3 className="text-base font-extrabold text-forest">{title}</h3><p className="mt-2 max-w-md text-sm leading-6 text-forest/55">{text}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="como-funciona" className="border-y border-forest/10 bg-[#f3f5f1] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="max-w-2xl">
            <p className="eyebrow">Proceso</p>
            <h2 className="section-title mt-4">Tres datos. Después, nosotros nos encargamos.</h2>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {steps.map(({ number, icon: Icon, title, text }) => (
              <article key={number} className="border border-forest/10 bg-white p-6 sm:p-7">
                <div className="flex items-center justify-between"><span className="text-xs font-black tracking-[.15em] text-coral">{number}</span><Icon className="size-5 text-forest/45" /></div>
                <h3 className="mt-10 text-xl font-extrabold tracking-[-.02em] text-forest">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-forest/55">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="informe" className="bg-forest py-20 text-white sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[.78fr_1.22fr] lg:items-center lg:px-10">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[.17em] text-lime">El entregable</p>
            <h2 className="mt-4 text-4xl font-[760] leading-[1.04] tracking-[-.045em] sm:text-5xl">Un informe claro para actuar, no un documento para archivar.</h2>
            <p className="mt-6 max-w-lg leading-8 text-white/62">Después de evaluar tu tienda, cada recomendación indica la zona, el cambio sugerido, su explicación y la prioridad. Puedes consultar el informe desde un enlace privado y guardarlo como PDF.</p>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="mt-8 inline-flex h-12 items-center gap-2 rounded-lg bg-lime px-6 text-sm font-extrabold text-forest transition hover:bg-[#d9ed7d]">Dejar mi WhatsApp <ArrowRight className="size-4" /></a>
          </div>

          <div className="bg-white p-5 text-forest shadow-[0_24px_60px_rgba(0,0,0,.18)] sm:p-7">
            <div className="flex items-start justify-between gap-4 border-b border-forest/10 pb-5">
              <div><p className="text-[10px] font-extrabold uppercase tracking-[.15em] text-coral">Informe de tienda</p><p className="mt-1 text-lg font-extrabold">Mini Market La Esquina</p></div>
              <span className="bg-mint px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide">3 acciones</span>
            </div>
            <div className="mt-2 divide-y divide-forest/10">
              {[
                ["01", "Entrada", "Libera el primer metro de acceso", "Alta"],
                ["02", "Góndola central", "Agrupa snacks por ocasión de consumo", "Media"],
                ["03", "Caja", "Activa compras de último minuto", "Media"],
              ].map(([number, area, title, priority]) => (
                <div key={number} className="grid grid-cols-[auto_1fr_auto] items-center gap-4 py-5">
                  <span className="grid size-9 place-items-center rounded-lg bg-cream text-xs font-black text-coral">{number}</span>
                  <div><p className="text-[10px] font-extrabold uppercase tracking-[.12em] text-forest/40">{area}</p><p className="mt-1 text-sm font-extrabold leading-5">{title}</p></div>
                  <span className="text-[9px] font-black uppercase tracking-wide text-forest/45">{priority}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-7 border border-forest/12 bg-cream px-6 py-8 sm:px-9 sm:py-10 md:flex-row md:items-center">
          <div><p className="eyebrow">¿Tienes una tienda en Quito?</p><h2 className="mt-3 text-3xl font-[760] tracking-[-.04em] text-forest sm:text-4xl">Déjanos tu WhatsApp y coordinamos la evaluación.</h2></div>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="inline-flex h-12 shrink-0 items-center gap-2 rounded-lg bg-coral px-6 text-sm font-extrabold text-white transition hover:bg-[#d95733]">Contactar por WhatsApp <ArrowRight className="size-4" /></a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
