import { getCaseWithRelations } from "@/db";
import type { ShopCase } from "@/lib/domain";

export async function readCase(id: string): Promise<ShopCase | null> {
  return getCaseWithRelations(id);
}
