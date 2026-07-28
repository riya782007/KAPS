import { Chip } from "@/components/ui";
import { CandidatesTable } from "@/components/candidates-table";
import { getCandidates, dataSource } from "@/lib/db";
import { Database } from "lucide-react";

export default async function CandidatesPage({ searchParams }: { searchParams?: { q?: string } }) {
  const candidates = await getCandidates();
  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Candidates</h1>
          <p className="muted text-sm mt-1">One shared record per teacher — no duplicate data entry. Search &amp; filter by subject, experience or location.</p>
        </div>
        <Chip icon={<Database size={12} />} tone={dataSource === "Supabase" ? "green" : "blue"}>Source: {dataSource}</Chip>
      </div>
      <CandidatesTable candidates={candidates} initialQuery={searchParams?.q || ""} />
    </div>
  );
}
