import { insertRecommendation } from "@/db";
import type { Recommendation } from "@/lib/domain";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const payload = (await request.json()) as {
      area?: string;
      title?: string;
      detail?: string;
      priority?: string;
    };
    const area = payload.area?.trim() || "Área general";
    const title = payload.title?.trim() || "";
    const detail = payload.detail?.trim() || "";
    const priority: Recommendation["priority"] =
      payload.priority === "alta" || payload.priority === "baja" ? payload.priority : "media";
    if (!title || !detail) {
      return Response.json({ error: "Añade un título y una recomendación." }, { status: 400 });
    }
    const created = insertRecommendation(id, { area, title, detail, priority });
    if (!created) return Response.json({ error: "Caso no encontrado" }, { status: 404 });
    return Response.json({ recommendation: created }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Error inesperado" }, { status: 500 });
  }
}
