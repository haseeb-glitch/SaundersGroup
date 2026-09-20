import Link from "next/link";
import { Brand } from "@/components/brand";

const WHATSAPP_NUMBER = "+593 99 123 4567";
const WHATSAPP_URL = "https://wa.me/593991234567?text=Hola%20Saunders%20Group%2C%20me%20gustar%C3%ADa%20coordinar%20una%20evaluaci%C3%B3n%20de%20mi%20tienda.";

export function SiteFooter() {
  return (
    <footer className="bg-[#0b3529] px-5 py-10 text-white sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-7 sm:flex-row sm:items-center">
        <div><Brand light /><p className="mt-2 text-sm text-white/50">Evaluación personalizada para tiendas de Quito.</p></div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold text-white/65">
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="hover:text-white">WhatsApp: {WHATSAPP_NUMBER}</a>
          <span>© 2026 Saunders Group</span>
        </div>
      </div>
    </footer>
  );
}
