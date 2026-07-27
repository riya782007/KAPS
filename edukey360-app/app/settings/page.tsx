import { ModulePreview } from "@/components/module-preview";
import { Settings } from "lucide-react";
export default function Page() {
  return <ModulePreview title="Settings" subtitle="Team, roles, integrations and AI configuration for Edukey360."
    icon={<Settings size={22} />} replaces="scattered logins and manual access management"
    capabilities={["Team & role management (BD, Senior/Junior Recruiter, Telerecruiter)", "Integrations: WhatsApp, email, calendar, verification, payments", "AI model & agent configuration", "Data privacy & consent (DPDP-aligned)", "Branding, notifications and SLA policies"]} />;
}
