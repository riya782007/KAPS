import { ModulePreview } from "@/components/module-preview";
import { BarChart3 } from "lucide-react";
export default function Page() {
  return <ModulePreview title="Reports" subtitle="Interactive analytics generated automatically — no more end-of-day report writing."
    icon={<BarChart3 size={22} />} replaces="manually compiled EOD and MIS reports in Excel"
    stats={[{ label: "Time-to-Hire", value: "9.2 days" }, { label: "Fill Rate", value: "76%" }, { label: "Interview→Offer", value: "58%" }, { label: "Offer→Joining", value: "84%" }]}
    capabilities={["Time-to-hire, fill rate, pipeline health — live", "Recruiter performance & interview conversion", "Offer & joining ratios, revenue and school performance", "Heatmaps and trends, exportable in one click", "AI Report Generator writes the narrative for leadership"]} />;
}
