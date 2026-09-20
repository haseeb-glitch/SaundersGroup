import { Clock3, Eye, CircleCheck } from "lucide-react";
import { STATUS_LABELS, type CaseStatus } from "@/lib/domain";
import { cn } from "@/lib/utils";

const config = {
  recibido: { icon: Clock3, className: "bg-amber-50 text-amber-800 ring-amber-200" },
  en_revision: { icon: Eye, className: "bg-blue-50 text-blue-800 ring-blue-200" },
  listo: { icon: CircleCheck, className: "bg-emerald-50 text-emerald-800 ring-emerald-200" },
};

export function StatusPill({ status }: { status: CaseStatus }) {
  const item = config[status];
  const Icon = item.icon;
  return <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-extrabold ring-1 ring-inset", item.className)}><Icon className="size-3.5" />{STATUS_LABELS[status]}</span>;
}
