import { mkdir, rm, writeFile } from "node:fs/promises";
import { insertShopCase, listShopCases, type PhotoRecord, type ShopCaseRecord } from "@/db";
import { resolveUploadPath } from "@/lib/local-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILES = 6;
const MAX_FILE_SIZE = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function clean(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export async function GET() {
  try {
    const rows = listShopCases();
    return Response.json({
      cases: rows.map((row) => ({
        ...row,
        accessToken: undefined,
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudieron cargar los casos";
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ error: "La solicitud no contiene un formulario válido." }, { status: 400 });
  }

  try {
    const ownerName = clean(form.get("ownerName"));
    const phone = clean(form.get("phone"));
    const location = clean(form.get("location"));
    if (!ownerName || !phone || !location) {
      return Response.json({ error: "Completa tu nombre, WhatsApp y la dirección del local." }, { status: 400 });
    }
    if (phone.replace(/\D/g, "").length < 7) {
      return Response.json({ error: "Ingresa un número de WhatsApp o teléfono válido." }, { status: 400 });
    }
    if (!location.toLocaleLowerCase("es").includes("quito")) {
      return Response.json({ error: "Por el momento, el servicio está disponible únicamente en Quito." }, { status: 400 });
    }

    const files = form.getAll("photos").filter((item): item is File => item instanceof File && item.size > 0);
    if (files.length > MAX_FILES) {
      return Response.json({ error: "Puedes subir hasta 6 fotos de la tienda." }, { status: 400 });
    }
    for (const file of files) {
      if (!ALLOWED_TYPES.has(file.type) || file.size > MAX_FILE_SIZE) {
        return Response.json({ error: "Usa imágenes JPG, PNG o WebP de máximo 8 MB." }, { status: 400 });
      }
    }

    const id = `ORD-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    const accessToken = crypto.randomUUID();
    const now = new Date().toISOString();
    const caseUploadDirectory = resolveUploadPath(id);
    const photoRows: PhotoRecord[] = [];
    try {
      await mkdir(caseUploadDirectory, { recursive: true });
      for (const file of files) {
        const photoId = crypto.randomUUID();
        const objectKey = `${id}/${photoId}.${EXTENSIONS[file.type]}`;
        await writeFile(resolveUploadPath(objectKey), Buffer.from(await file.arrayBuffer()), { flag: "wx" });
        photoRows.push({
          id: photoId,
          caseId: id,
          objectKey,
          fileName: file.name,
          contentType: file.type,
          sizeBytes: file.size,
          createdAt: now,
        });
      }

      const item: ShopCaseRecord = {
        id,
        accessToken,
        shopName: clean(form.get("shopName")) || `Tienda de ${ownerName}`,
        ownerName,
        email: "",
        phone,
        location,
        shopType: "Comercio local",
        sizeRange: "Por evaluar",
        categories: [],
        challenges: [],
        objective: "",
        extraNotes: "",
        status: "recibido",
        createdAt: now,
        updatedAt: now,
      };
      insertShopCase(item, photoRows);
    } catch (error) {
      await rm(caseUploadDirectory, { recursive: true, force: true });
      throw error;
    }

    return Response.json({ id, accessToken, status: "recibido" }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo enviar la solicitud";
    return Response.json({ error: message }, { status: 500 });
  }
}
