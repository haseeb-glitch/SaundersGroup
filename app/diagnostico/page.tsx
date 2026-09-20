import type { Metadata } from "next";
import { DiagnosticForm } from "@/components/diagnostic-form";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Contactar por WhatsApp",
  description: "Escríbenos por WhatsApp para coordinar una evaluación rápida de tu tienda en Quito.",
};

export default function DiagnosticPage() {
  return (
    <main className="min-h-screen bg-cream">
      <SiteHeader compact />
      <DiagnosticForm />
    </main>
  );
}
