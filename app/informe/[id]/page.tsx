import type { Metadata } from "next";
import { ReportView } from "@/components/report-view";
import { getDemoCase } from "@/lib/domain";
import { readCase } from "@/lib/server-data";

export const metadata: Metadata = { title: "Informe de tienda", robots: { index: false, follow: false } };

export default async function ReportPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string; enviado?: string }>;
}) {
  const [{ id }, { token, enviado }] = await Promise.all([params, searchParams]);
  const demo = getDemoCase(id);
  const stored = demo || await readCase(id);
  const authorized = Boolean(stored && (demo || token === stored.accessToken));
  const item = authorized && stored ? { ...stored, accessToken: undefined } : null;

  return <ReportView item={item} submitted={enviado === "1"} />;
}
