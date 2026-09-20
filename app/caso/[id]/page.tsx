import type { Metadata } from "next";
import { CaseWorkspace } from "@/components/case-workspace";

export const metadata: Metadata = { title: "Detalle del caso" };

export default async function CasePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CaseWorkspace id={id} />;
}
