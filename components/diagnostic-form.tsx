"use client";

import { useState, type FormEvent } from "react";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Loader2,
  MessageCircle,
  Send,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const WHATSAPP_NUMBER = "593991234567";

type FormValues = {
  phone: string;
};

const initialValues: FormValues = {
  phone: "",
};

export function DiagnosticForm() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  function update(value: string) {
    setValues({ phone: value });
  }

  function validate() {
    const phoneDigits = values.phone.replace(/\D/g, "");
    const message = !values.phone.trim() || phoneDigits.length < 7 ? "Ingresa un número de WhatsApp válido." : "";

    setError(message);
    if (message) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return false;
    }
    return true;
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending || !validate()) return;

    setSending(true);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hola Saunders Group, quiero coordinar una evaluación para mi tienda. Mi WhatsApp es ${values.phone.trim()}.`)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setSending(false);
    setValues(initialValues);
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
      <div className="mx-auto max-w-3xl text-center">
        <p className="eyebrow">Atención en Quito</p>
        <h1 className="mt-4 text-4xl font-[760] leading-[1.04] tracking-[-.045em] text-forest sm:text-5xl">
          Déjanos tu WhatsApp.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-forest/62">
          Escríbenos y coordinamos una evaluación rápida para tu tienda sin completar formularios largos.
        </p>
      </div>

      <div className="mx-auto mt-9 grid max-w-5xl gap-6 lg:grid-cols-[1fr_300px] lg:items-start">
        <form onSubmit={submit} noValidate className="rounded-2xl border border-forest/10 bg-white p-5 shadow-[0_20px_55px_rgba(19,71,55,.08)] sm:p-8 lg:p-10">
          <div id="form-error" aria-live="polite" className={cn("mb-7 items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800", error ? "flex" : "hidden")}>
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <p>{error}</p>
          </div>

          <section aria-labelledby="contact-title">
            <div className="flex items-center gap-3 border-b border-forest/10 pb-5">
              <span className="grid size-11 place-items-center rounded-xl bg-[#fff0eb] text-coral"><MessageCircle className="size-5" /></span>
              <div><h2 id="contact-title" className="text-xl font-extrabold text-forest">¿Cómo te contactamos?</h2><p className="mt-1 text-sm text-forest/48">Solo necesitamos tu WhatsApp.</p></div>
            </div>

            <div className="mt-6">
              <label className="field-label" htmlFor="phone">WhatsApp *</label>
              <Input id="phone" type="tel" inputMode="tel" autoComplete="tel" value={values.phone} onChange={(event) => update(event.target.value)} placeholder="Ej. 099 123 4567" className="app-input" />
            </div>
          </section>

          <div className="mt-8 border-t border-forest/10 pt-7">
            <div className="flex items-start gap-3 rounded-xl bg-mint/55 p-4 text-sm leading-6 text-forest/65"><ShieldCheck className="mt-0.5 size-5 shrink-0 text-forest" /><p>Solo te pedimos tu WhatsApp para coordinar la evaluación y responderte de forma rápida.</p></div>
            <Button type="submit" disabled={sending} aria-busy={sending} className="mt-5 h-13 w-full rounded-xl bg-coral px-6 text-base font-extrabold text-white hover:bg-[#d85532]">
              <Loader2 className={cn("size-5 animate-spin", sending ? "inline" : "hidden")} />
              <Send className={cn("size-5", sending ? "hidden" : "inline")} />
              <span className={sending ? "hidden" : "inline"}>Enviar por WhatsApp</span>
              <span className={sending ? "inline" : "hidden"}>Enviando...</span>
            </Button>
            <p className="mt-3 text-center text-xs text-forest/42">Sin formularios complejos, ni más preguntas.</p>
          </div>
        </form>

        <aside className="rounded-2xl bg-forest p-6 text-white lg:sticky lg:top-24">
          <CheckCircle2 className="size-7 text-lime" />
          <p className="mt-5 text-xs font-extrabold uppercase tracking-[.16em] text-lime">Rápido</p>
          <h2 className="mt-2 text-2xl font-[760] leading-tight">Te respondemos por WhatsApp.</h2>
          <div className="mt-6 space-y-4 text-sm leading-6 text-white/65">
            <p className="flex gap-3"><Check className="mt-1 size-4 shrink-0 text-lime" />Escribes tu número</p>
            <p className="flex gap-3"><Check className="mt-1 size-4 shrink-0 text-lime" />Te contactamos de inmediato</p>
            <p className="flex gap-3"><Check className="mt-1 size-4 shrink-0 text-lime" />Coordinamos la evaluación</p>
          </div>
          <div className="mt-7 border-t border-white/12 pt-6">
            <p className="text-4xl font-black tracking-[-.05em] text-white">10+</p>
            <p className="mt-1 text-sm font-bold text-white">años de experiencia en supermercados</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
