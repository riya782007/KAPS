import { ModulePreview } from "@/components/module-preview";
import { School } from "lucide-react";
import { SCHOOLS } from "@/lib/mock";
export default function Page() {
  const rev = SCHOOLS.reduce((a, s) => a + s.revenue, 0);
  return <ModulePreview title="Schools" subtitle="A full CRM for every partner school — hiring history, vacancies, invoices and relationship health in one place."
    icon={<School size={22} />} replaces="separate school trackers, invoice sheets and email threads"
    stats={[{ label: "Partner schools", value: String(SCHOOLS.length) }, { label: "Open vacancies", value: String(SCHOOLS.reduce((a, s) => a + s.vacancies, 0)) }, { label: "Avg retention", value: "89%" }, { label: "Revenue (Q)", value: "₹" + rev.toLocaleString("en-IN") }]}
    capabilities={["Per-school profile: vacancies, hiring history, past recruiters", "Communication timeline across WhatsApp + email", "Open invoices & payment follow-ups auto-tracked", "Retention rate & revenue per school", "AI School Relationship Manager flags renewal & upsell moments"]} />;
}
