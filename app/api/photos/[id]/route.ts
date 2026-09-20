import { readFile } from "node:fs/promises";
import { getPhoto } from "@/db";
import { resolveUploadPath } from "@/lib/local-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const photo = getPhoto(id);
    if (!photo) return new Response("No encontrada", { status: 404 });

    const bytes = await readFile(resolveUploadPath(photo.objectKey));
    const safeName = photo.fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    return new Response(new Uint8Array(bytes), {
      headers: {
        "content-type": photo.contentType,
        "content-length": String(bytes.byteLength),
        "cache-control": "private, max-age=3600",
        "content-disposition": `inline; filename="${safeName}"`,
      },
    });
  } catch (error) {
    const code = error && typeof error === "object" && "code" in error ? String(error.code) : "";
    if (code === "ENOENT") return new Response("No encontrada", { status: 404 });
    return new Response("No se pudo cargar la foto", { status: 500 });
  }
}
