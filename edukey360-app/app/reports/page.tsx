import { ReportsView } from "@/components/reports-view";
import { getCandidates, getRequirements, getRecruiters, getSchools } from "@/lib/db";

export default async function ReportsPage() {
  const [candidates, requirements, recruiters, schools] = await Promise.all([
    getCandidates(), getRequirements(), getRecruiters(), getSchools(),
  ]);
  return <ReportsView candidates={candidates} requirements={requirements} recruiters={recruiters} schools={schools} />;
}
