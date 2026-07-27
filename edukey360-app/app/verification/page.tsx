import { ModulePreview } from "@/components/module-preview";
import { ShieldCheck } from "lucide-react";
export default function Page() {
  return <ModulePreview title="Verification" subtitle="Track identity, education, experience, references and background checks — the Trust Layer behind your '100% Verified' promise."
    icon={<ShieldCheck size={22} />} replaces="manual document chasing and verification spreadsheets"
    stats={[{ label: "Pool verified", value: "57%" }, { label: "Blockchain-verified", value: "3" }, { label: "Avg verify time", value: "6 min" }, { label: "Fake docs caught", value: "2" }]}
    capabilities={["Identity via Aadhaar / PAN + DigiLocker", "Education & credential authentication (AICTE / blockchain)", "Experience & reference checks tracked to completion", "Tiered trust badges: self-declared → document → blockchain", "Verify once, reuse across Match, Screening and the School Portal"]} />;
}
