import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import path from "node:path";
import type { CaseStatus, Recommendation, ShopCase, ShopPhoto } from "@/lib/domain";

export type ShopCaseRecord = Omit<ShopCase, "accessToken" | "updatedAt" | "photos" | "recommendations"> & {
  accessToken: string;
  updatedAt: string;
};

export type PhotoRecord = Required<Pick<ShopPhoto, "id" | "fileName" | "contentType" | "sizeBytes">> & {
  caseId: string;
  objectKey: string;
  createdAt: string;
};

export type RecommendationRecord = Omit<Recommendation, "id" | "caseId"> & {
  id: number;
  caseId: string;
  createdAt: string;
};

type CaseRow = {
  id: string;
  access_token: string;
  shop_name: string;
  owner_name: string;
  email: string;
  phone: string;
  location: string;
  shop_type: string;
  size_range: string;
  categories: string;
  challenges: string;
  objective: string;
  extra_notes: string;
  status: string;
  created_at: string;
  updated_at: string;
};

type PhotoRow = {
  id: string;
  case_id: string;
  object_key: string;
  file_name: string;
  content_type: string;
  size_bytes: number;
  created_at: string;
};

type RecommendationRow = {
  id: number;
  case_id: string;
  area: string;
  title: string;
  detail: string;
  priority: string;
  created_at: string;
};

const databasePath = process.env.DATABASE_PATH
  ? path.resolve(/*turbopackIgnore: true*/ process.env.DATABASE_PATH)
  : process.env.DATA_DIR
    ? path.join(path.resolve(/*turbopackIgnore: true*/ process.env.DATA_DIR), "ordena.sqlite")
    : path.join(process.cwd(), "data", "ordena.sqlite");

let database: DatabaseSync | null = null;

function getDatabase() {
  if (database) return database;

  mkdirSync(path.dirname(databasePath), { recursive: true });
  const nextDatabase = new DatabaseSync(databasePath);
  nextDatabase.exec(`
  PRAGMA busy_timeout = 10000;
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS shop_cases (
    id TEXT PRIMARY KEY NOT NULL,
    access_token TEXT NOT NULL UNIQUE,
    shop_name TEXT NOT NULL,
    owner_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL DEFAULT '',
    location TEXT NOT NULL,
    shop_type TEXT NOT NULL,
    size_range TEXT NOT NULL,
    categories TEXT NOT NULL DEFAULT '[]',
    challenges TEXT NOT NULL DEFAULT '[]',
    objective TEXT NOT NULL DEFAULT '',
    extra_notes TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'recibido',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS shop_photos (
    id TEXT PRIMARY KEY NOT NULL,
    case_id TEXT NOT NULL REFERENCES shop_cases(id) ON DELETE CASCADE,
    object_key TEXT NOT NULL,
    file_name TEXT NOT NULL,
    content_type TEXT NOT NULL,
    size_bytes INTEGER NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS recommendations (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    case_id TEXT NOT NULL REFERENCES shop_cases(id) ON DELETE CASCADE,
    area TEXT NOT NULL,
    title TEXT NOT NULL,
    detail TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'media',
    created_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_shop_cases_created_at
    ON shop_cases(created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_shop_photos_case_id
    ON shop_photos(case_id);
  CREATE INDEX IF NOT EXISTS idx_recommendations_case_id
    ON recommendations(case_id);
`);

  database = nextDatabase;
  return nextDatabase;
}

function parseList(value: string) {
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function normalizeStatus(value: string): CaseStatus {
  return value === "en_revision" || value === "listo" ? value : "recibido";
}

function normalizePriority(value: string): Recommendation["priority"] {
  return value === "alta" || value === "baja" ? value : "media";
}

function mapCase(row: CaseRow): ShopCaseRecord {
  return {
    id: row.id,
    accessToken: row.access_token,
    shopName: row.shop_name,
    ownerName: row.owner_name,
    email: row.email,
    phone: row.phone,
    location: row.location,
    shopType: row.shop_type,
    sizeRange: row.size_range,
    categories: parseList(row.categories),
    challenges: parseList(row.challenges),
    objective: row.objective,
    extraNotes: row.extra_notes,
    status: normalizeStatus(row.status),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapPhoto(row: PhotoRow): PhotoRecord {
  return {
    id: row.id,
    caseId: row.case_id,
    objectKey: row.object_key,
    fileName: row.file_name,
    contentType: row.content_type,
    sizeBytes: Number(row.size_bytes),
    createdAt: row.created_at,
  };
}

function mapRecommendation(row: RecommendationRow): RecommendationRecord {
  return {
    id: Number(row.id),
    caseId: row.case_id,
    area: row.area,
    title: row.title,
    detail: row.detail,
    priority: normalizePriority(row.priority),
    createdAt: row.created_at,
  };
}

export function listShopCases() {
  const rows = getDatabase().prepare("SELECT * FROM shop_cases ORDER BY created_at DESC LIMIT 100").all();
  return rows.map((row) => mapCase(row as unknown as CaseRow));
}

export function getShopCase(id: string) {
  const row = getDatabase().prepare("SELECT * FROM shop_cases WHERE id = ? LIMIT 1").get(id);
  return row ? mapCase(row as unknown as CaseRow) : null;
}

export function getCaseWithRelations(id: string): ShopCase | null {
  const item = getShopCase(id);
  if (!item) return null;

  const photos = getDatabase()
    .prepare("SELECT * FROM shop_photos WHERE case_id = ? ORDER BY created_at ASC")
    .all(id)
    .map((row) => mapPhoto(row as unknown as PhotoRow));
  const recommendations = getDatabase()
    .prepare("SELECT * FROM recommendations WHERE case_id = ? ORDER BY id ASC")
    .all(id)
    .map((row) => mapRecommendation(row as unknown as RecommendationRow));

  return { ...item, photos, recommendations };
}

export function getPhoto(id: string) {
  const row = getDatabase().prepare("SELECT * FROM shop_photos WHERE id = ? LIMIT 1").get(id);
  return row ? mapPhoto(row as unknown as PhotoRow) : null;
}

export function insertShopCase(item: ShopCaseRecord, photos: PhotoRecord[]) {
  const db = getDatabase();
  const insertCase = db.prepare(`
    INSERT INTO shop_cases (
      id, access_token, shop_name, owner_name, email, phone, location, shop_type,
      size_range, categories, challenges, objective, extra_notes, status, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertPhoto = db.prepare(`
    INSERT INTO shop_photos (
      id, case_id, object_key, file_name, content_type, size_bytes, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  db.exec("BEGIN IMMEDIATE");
  try {
    insertCase.run(
      item.id,
      item.accessToken,
      item.shopName,
      item.ownerName,
      item.email,
      item.phone,
      item.location,
      item.shopType,
      item.sizeRange,
      JSON.stringify(item.categories),
      JSON.stringify(item.challenges),
      item.objective,
      item.extraNotes,
      item.status,
      item.createdAt,
      item.updatedAt,
    );
    for (const photo of photos) {
      insertPhoto.run(
        photo.id,
        photo.caseId,
        photo.objectKey,
        photo.fileName,
        photo.contentType,
        photo.sizeBytes,
        photo.createdAt,
      );
    }
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

export function updateShopCaseStatus(id: string, status: CaseStatus) {
  const updatedAt = new Date().toISOString();
  const result = getDatabase()
    .prepare("UPDATE shop_cases SET status = ?, updated_at = ? WHERE id = ?")
    .run(status, updatedAt, id);
  return Number(result.changes) > 0 ? getShopCase(id) : null;
}

export function insertRecommendation(
  caseId: string,
  input: Pick<Recommendation, "area" | "title" | "detail" | "priority">,
) {
  if (!getShopCase(caseId)) return null;
  const createdAt = new Date().toISOString();
  const result = getDatabase()
    .prepare(`
      INSERT INTO recommendations (case_id, area, title, detail, priority, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
    .run(caseId, input.area, input.title, input.detail, input.priority, createdAt);

  return {
    id: Number(result.lastInsertRowid),
    caseId,
    ...input,
    createdAt,
  } satisfies RecommendationRecord;
}
