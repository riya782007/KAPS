import { ModulePreview } from "@/components/module-preview";
import { UserCog } from "lucide-react";
export default function Page() {
  return <ModulePreview title="Recruiters" subtitle="Team performance, targets and an AI Performance Coach — so leadership sees who's ahead and who needs support."
    icon={<UserCog size={22} />} replaces="manual EOD reports and target-tracking spreadsheets"
    stats={[{ label: "Recruiters", value: "4" }, { label: "Online now", value: "3" }, { label: "Calls today", value: "235" }, { label: "Team fill rate", value: "76%" }]}
    capabilities={["Live targets vs placements per recruiter", "Calls, follow-ups and conversion tracked automatically", "AI Performance Coach flags who's behind and why", "Workload balancing suggestions across the team", "Auto-generated daily & weekly performance reports"]} />;
}
