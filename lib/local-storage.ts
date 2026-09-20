import path from "node:path";

export const uploadDirectory = process.env.UPLOAD_DIR
  ? path.resolve(/*turbopackIgnore: true*/ process.env.UPLOAD_DIR)
  : process.env.DATA_DIR
    ? path.join(path.resolve(/*turbopackIgnore: true*/ process.env.DATA_DIR), "uploads")
    : path.join(process.cwd(), "data", "uploads");

export function resolveUploadPath(objectKey: string) {
  const target = path.resolve(uploadDirectory, objectKey);
  const allowedPrefix = `${uploadDirectory}${path.sep}`;

  if (target !== uploadDirectory && !target.startsWith(allowedPrefix)) {
    throw new Error("Ruta de archivo inválida");
  }

  return target;
}
