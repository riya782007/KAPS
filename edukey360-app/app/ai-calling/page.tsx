import { ModulePreview } from "@/components/module-preview";
import { PhoneCall } from "lucide-react";
export default function Page() {
  return <ModulePreview title="AI Calling" subtitle="An AI voice agent that phones candidates, runs the screening, and updates every record — replacing hours of manual dialing."
    icon={<PhoneCall size={22} />} replaces="40–50 manual screening calls per recruiter, per day"
    stats={[{ label: "Calls automated (wk)", value: "412" }, { label: "Avg call time", value: "3m 40s" }, { label: "Connect rate", value: "68%" }, { label: "Recruiter-hrs saved", value: "54h" }]}
    capabilities={["AI introduces Edukey360 and runs a structured screen", "Captures interest, availability, expected salary, notice, location, board", "Converts the conversation into structured fields instantly", "Auto-updates the candidate record — no Excel", "Generates transcript + summary and creates the follow-up task"]} />;
}
