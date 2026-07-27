import { ModulePreview } from "@/components/module-preview";
import { FileText } from "lucide-react";
export default function Page() {
  return <ModulePreview title="Documents" subtitle="Upload resume, degree, ID and certificates — AI extracts every field, flags what's missing, and shows verification progress."
    icon={<FileText size={22} />} replaces="manual resume reading and document checklists"
    stats={[{ label: "Docs processed", value: "1,240" }, { label: "Auto-extracted fields", value: "14 / CV" }, { label: "Completeness", value: "92%" }, { label: "Missing flagged", value: "31" }]}
    capabilities={["AI extracts all information from any uploaded document", "Verifies completeness and highlights missing documents", "Progress across identity, education, experience, references, background", "Résumé → structured candidate profile automatically", "Feeds the Verification Trust Layer and Candidate record"]} />;
}
