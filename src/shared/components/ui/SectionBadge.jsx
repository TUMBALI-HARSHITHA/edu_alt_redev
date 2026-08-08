import { memo } from "react";
const SectionBadge = memo(({ icon, label }) => <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold uppercase tracking-widest text-[10px]">
    {icon}
    {label}
  </div>);
SectionBadge.displayName = "SectionBadge";
export {
  SectionBadge
};
