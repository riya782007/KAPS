// ============================================================
// Edukey360 OS — realistic mock recruitment data (demo)
// ============================================================

export type Priority = "High" | "Medium" | "Low";
export type Stage =
  | "New" | "Contacted" | "Interested" | "Screened"
  | "Interview" | "Offer" | "Joining" | "Placed";

export interface School {
  id: string; name: string; board: string; loc: string;
  vacancies: number; retention: number; revenue: number; openInvoices: number;
}
export interface Recruiter {
  id: string; name: string; role: string; online: boolean;
  target: number; placed: number; calls: number; avatarHue: number;
}
export interface Employee {
  id: string; name: string; role: string; passcode: string; email?: string;
  responsibilities: string[]; target: number; active: boolean;
}
export interface Requirement {
  id: string; role: string; schoolId: string; board: string; subject: string;
  minExp: number; salaryMin: number; salaryMax: number; vacancies: number;
  joining: string; priority: Priority; status: "Open" | "Filled"; createdBy: string;
}
export interface Candidate {
  id: string; name: string; subject: string; qual: string; exp: number;
  loc: string; boards: string[]; curCTC: number; expCTC: number; notice: string;
  source: string; stage: Stage; match: number; commScore: number; trust: 0 | 1 | 2;
  reqId?: string; recruiter?: string;
}
export interface ActivityItem { t: string; text: string; kind: "ai" | "human" | "system"; }

export const SCHOOLS: School[] = [
  { id: "sch1", name: "Delhi Public School, Gurgaon", board: "CBSE", loc: "Gurgaon", vacancies: 6, retention: 91, revenue: 480000, openInvoices: 1 },
  { id: "sch2", name: "Heritage International", board: "ICSE", loc: "Gurgaon", vacancies: 3, retention: 88, revenue: 265000, openInvoices: 0 },
  { id: "sch3", name: "Little Scholars", board: "CBSE", loc: "Delhi", vacancies: 4, retention: 84, revenue: 190000, openInvoices: 2 },
  { id: "sch4", name: "Cambridge Global", board: "IB", loc: "Noida", vacancies: 2, retention: 93, revenue: 520000, openInvoices: 0 },
];

export const RECRUITERS: Recruiter[] = [
  { id: "r1", name: "Aarti Mehta", role: "Senior Recruiter", online: true, target: 12, placed: 10, calls: 61, avatarHue: 210 },
  { id: "r2", name: "Vikas Nair", role: "Recruiter", online: true, target: 10, placed: 6, calls: 48, avatarHue: 150 },
  { id: "r3", name: "Sana Kapoor", role: "Recruiter", online: false, target: 10, placed: 9, calls: 52, avatarHue: 30 },
  { id: "r4", name: "Rohan Das", role: "Telerecruiter", online: true, target: 8, placed: 4, calls: 74, avatarHue: 280 },
];

export const EMPLOYEES: Employee[] = [
  { id: "e1", name: "Varun Bahl", role: "Business Head", passcode: "VB-4821", email: "varun@edukey360.com", responsibilities: ["Strategy", "Client escalations", "Revenue"], target: 0, active: true },
  { id: "e2", name: "Aarti Mehta", role: "Senior Recruiter", passcode: "AM-7310", email: "aarti@edukey360.com", responsibilities: ["Requirement planning", "Screening quality", "Team guidance"], target: 12, active: true },
  { id: "e3", name: "Vikas Nair", role: "Recruiter", passcode: "VN-2288", responsibilities: ["Sourcing", "Interview coordination"], target: 10, active: true },
  { id: "e4", name: "Sana Kapoor", role: "Recruiter", passcode: "SK-9074", responsibilities: ["Sourcing", "Candidate engagement"], target: 10, active: false },
  { id: "e5", name: "Rohan Das", role: "Telerecruiter", passcode: "RD-5567", responsibilities: ["Calling", "Verification", "Database updates"], target: 8, active: true },
  { id: "e6", name: "Neha Sethi", role: "Business Developer", passcode: "NS-3390", responsibilities: ["Lead generation", "School onboarding", "Proposals"], target: 6, active: true },
];

export const ROLES = ["Admin", "Business Head", "Business Developer", "Senior Recruiter", "Recruiter", "Junior Recruiter", "Telerecruiter"];

export const REQUIREMENTS: Requirement[] = [
  { id: "req1", role: "PGT Physics", schoolId: "sch1", board: "CBSE", subject: "Physics", minExp: 3, salaryMin: 45, salaryMax: 60, vacancies: 2, joining: "2026-08-15", priority: "High", status: "Open", createdBy: "Aarti Mehta" },
  { id: "req2", role: "TGT Mathematics", schoolId: "sch2", board: "ICSE", subject: "Mathematics", minExp: 2, salaryMin: 30, salaryMax: 42, vacancies: 1, joining: "2026-08-20", priority: "Medium", status: "Open", createdBy: "Vikas Nair" },
  { id: "req3", role: "PRT (Primary)", schoolId: "sch3", board: "CBSE", subject: "Primary", minExp: 1, salaryMin: 22, salaryMax: 30, vacancies: 3, joining: "2026-08-05", priority: "High", status: "Open", createdBy: "Sana Kapoor" },
  { id: "req4", role: "PGT English", schoolId: "sch4", board: "IB", subject: "English", minExp: 4, salaryMin: 50, salaryMax: 68, vacancies: 1, joining: "2026-09-01", priority: "Medium", status: "Open", createdBy: "Aarti Mehta" },
  { id: "req5", role: "Vice Principal", schoolId: "sch1", board: "CBSE", subject: "Leadership", minExp: 10, salaryMin: 90, salaryMax: 120, vacancies: 1, joining: "2026-09-10", priority: "Low", status: "Open", createdBy: "Aarti Mehta" },
];

export const CANDIDATES: Candidate[] = [
  { id: "c1", name: "Ananya Sharma", subject: "Physics", qual: "M.Sc Physics, B.Ed", exp: 5, loc: "Gurgaon", boards: ["CBSE"], curCTC: 42, expCTC: 52, notice: "30 days", source: "Internal DB", stage: "Interview", match: 96, commScore: 9, trust: 1, reqId: "req1", recruiter: "Aarti Mehta" },
  { id: "c2", name: "Meera Nair", subject: "Physics", qual: "M.Sc Physics, B.Ed", exp: 8, loc: "Gurgaon", boards: ["CBSE", "ICSE"], curCTC: 58, expCTC: 80, notice: "90 days", source: "Referral", stage: "Screened", match: 88, commScore: 8, trust: 2, reqId: "req1", recruiter: "Aarti Mehta" },
  { id: "c3", name: "Arjun Reddy", subject: "Physics", qual: "B.Sc Physics, B.Ed", exp: 6, loc: "Gurgaon", boards: ["CBSE"], curCTC: 44, expCTC: 55, notice: "45 days", source: "Naukri", stage: "Contacted", match: 84, commScore: 7, trust: 1, reqId: "req1" },
  { id: "c4", name: "Sunita Rao", subject: "Mathematics", qual: "B.Sc Maths, B.Ed", exp: 3, loc: "Gurgaon", boards: ["ICSE"], curCTC: 28, expCTC: 38, notice: "Immediate", source: "WhatsApp", stage: "Interested", match: 91, commScore: 8, trust: 1, reqId: "req2" },
  { id: "c5", name: "Imran Khan", subject: "Mathematics", qual: "M.Sc Maths, B.Ed", exp: 4, loc: "Delhi", boards: ["CBSE"], curCTC: 34, expCTC: 44, notice: "30 days", source: "Internal DB", stage: "New", match: 79, commScore: 7, trust: 0, reqId: "req2" },
  { id: "c6", name: "Priya Menon", subject: "Primary", qual: "B.A, D.El.Ed, CTET", exp: 2, loc: "Delhi", boards: ["CBSE"], curCTC: 20, expCTC: 27, notice: "Immediate", source: "Apna", stage: "Offer", match: 90, commScore: 8, trust: 1, reqId: "req3", recruiter: "Sana Kapoor" },
  { id: "c7", name: "Kavya Iyer", subject: "Primary", qual: "B.Com, B.Ed, CTET", exp: 1, loc: "Noida", boards: ["CBSE"], curCTC: 18, expCTC: 24, notice: "15 days", source: "WhatsApp", stage: "Placed", match: 86, commScore: 7, trust: 2, reqId: "req3", recruiter: "Sana Kapoor" },
  { id: "c8", name: "Fatima Sheikh", subject: "English", qual: "M.A English, B.Ed", exp: 5, loc: "Noida", boards: ["CBSE", "IB"], curCTC: 48, expCTC: 62, notice: "30 days", source: "Referral", stage: "Screened", match: 93, commScore: 9, trust: 1, reqId: "req4" },
  { id: "c9", name: "Rohit Malhotra", subject: "English", qual: "M.A English, B.Ed", exp: 3, loc: "Delhi", boards: ["CBSE"], curCTC: 36, expCTC: 47, notice: "60 days", source: "Naukri", stage: "New", match: 74, commScore: 6, trust: 0, reqId: "req4" },
  { id: "c10", name: "Deepak Joshi", subject: "Leadership", qual: "M.Ed, 12 yrs admin", exp: 12, loc: "Gurgaon", boards: ["CBSE"], curCTC: 95, expCTC: 118, notice: "90 days", source: "Referral", stage: "Interview", match: 94, commScore: 9, trust: 2, reqId: "req5", recruiter: "Aarti Mehta" },
  { id: "c11", name: "Sneha Kulkarni", subject: "Mathematics", qual: "B.Sc Maths, B.Ed, CTET", exp: 3, loc: "Gurgaon", boards: ["CBSE", "ICSE"], curCTC: 31, expCTC: 40, notice: "30 days", source: "WhatsApp", stage: "Joining", match: 89, commScore: 8, trust: 1, reqId: "req2", recruiter: "Vikas Nair" },
  { id: "c12", name: "Neha Gupta", subject: "Mathematics", qual: "M.A, B.Ed", exp: 2, loc: "Gurgaon", boards: ["State"], curCTC: 26, expCTC: 33, notice: "30 days", source: "Naukri", stage: "New", match: 68, commScore: 6, trust: 0 },
];

export const ACTIVITY: ActivityItem[] = [
  { t: "2m", text: "AI Calling Agent screened Ananya Sharma → Interview Ready", kind: "ai" },
  { t: "6m", text: "AI Matcher ranked 9 candidates for PGT Physics (DPS Gurgaon)", kind: "ai" },
  { t: "14m", text: "Interview Coordinator scheduled Deepak Joshi · Fri 11:30", kind: "ai" },
  { t: "20m", text: "Aarti Mehta moved Meera Nair → Screened", kind: "human" },
  { t: "32m", text: "WhatsApp Agent sent interview reminder to Priya Menon", kind: "ai" },
  { t: "40m", text: "Resume Analyzer extracted 12 fields from Fatima Sheikh's CV", kind: "ai" },
  { t: "1h", text: "Verification Agent completed identity + degree check for Kavya Iyer", kind: "ai" },
  { t: "1h", text: "Invoice auto-raised ₹47,200 on Kavya Iyer joining (Little Scholars)", kind: "system" },
];

export const AI_ACTIONS: ActivityItem[] = [
  { t: "just now", text: "Requirement Analyzer built a 14-day hiring plan for TGT Mathematics", kind: "ai" },
  { t: "3m", text: "Candidate Matcher auto-shortlisted 5 teachers, 3 above 90% match", kind: "ai" },
  { t: "9m", text: "Recruiter Copilot drafted 4 WhatsApp outreach messages", kind: "ai" },
  { t: "18m", text: "Report Generator compiled today's EOD report — no manual entry", kind: "ai" },
  { t: "26m", text: "Calling Agent completed 8 screening calls, updated all records", kind: "ai" },
];

export function schoolName(id: string) { return SCHOOLS.find(s => s.id === id)?.name ?? "—"; }

export const STAGES: Stage[] = ["New", "Contacted", "Interested", "Screened", "Interview", "Offer", "Joining", "Placed"];

export const KPIS = () => {
  const c = CANDIDATES;
  const interviews = c.filter(x => x.stage === "Interview").length;
  const pipeline = c.filter(x => !["Placed"].includes(x.stage)).length;
  const placements = c.filter(x => x.stage === "Placed").length;
  const offers = c.filter(x => x.stage === "Offer").length;
  const joining = c.filter(x => x.stage === "Joining").length;
  const followups = 7;
  const revenue = SCHOOLS.reduce((a, s) => a + s.revenue, 0);
  const activeReqs = REQUIREMENTS.filter(r => r.status === "Open").length;
  const online = RECRUITERS.filter(r => r.online).length;
  return { interviews, pipeline, placements, offers, joining, followups, revenue, activeReqs, online };
};
