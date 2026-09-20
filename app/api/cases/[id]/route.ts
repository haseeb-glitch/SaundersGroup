import { updateShopCaseStatus } from "@/db";
import { readCase } from "@/lib/server-data";
import type { CaseStatus } from "@/lib/domain";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const item = await readCase(id);
    if (!item) return Response.json({ error: "Caso no encontrado" }, { status: 404 });

    const url = new URL(request.url);
    const token = url.searchParams.get("token");
    const consultantScope = url.searchParams.get("scope") === "consultant";
    if (!consultantScope && token !== item.accessToken) {
      return Response.json({ error: "Enlace de acceso inválido" }, { status: 403 });
    }
    return Response.json({ case: item });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Error inesperado" }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const payload = (await request.json()) as { status?: string };
    if (!payload.status || !["recibido", "en_revision", "listo"].includes(payload.status)) {
      return Response.json({ error: "Estado inválido" }, { status: 400 });
    }
    const updated = updateShopCaseStatus(id, payload.status as CaseStatus);
    if (!updated) return Response.json({ error: "Caso no encontrado" }, { status: 404 });
    return Response.json({ case: updated });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Error inesperado" }, { status: 500 });
  }
}
