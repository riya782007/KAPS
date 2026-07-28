import { supabase } from "./supabase";
import { CANDIDATES, REQUIREMENTS, SCHOOLS, RECRUITERS, EMPLOYEES, type Candidate, type Requirement, type School, type Recruiter, type Employee } from "./mock";

export async function getEmployees(): Promise<Employee[]> {
  if (!supabase) return EMPLOYEES;
  const { data, error } = await supabase.from("employees").select("*");
  if (error || !data || !data.length) return EMPLOYEES;
  return data.map((r: any): Employee => ({
    id: r.id, name: r.name, role: r.role, passcode: r.passcode, email: r.email,
    responsibilities: r.responsibilities ?? [], target: r.target ?? 0, active: r.active ?? true,
  }));
}

// Data layer: reads from Supabase when configured, else mock.
// Columns in Supabase are lowercase/snake_case; we map to the app types.

export const dataSource = supabase ? "Supabase" : "Demo data";

export async function getCandidates(): Promise<Candidate[]> {
  if (!supabase) return CANDIDATES;
  const { data, error } = await supabase.from("candidates").select("*").order("match", { ascending: false });
  if (error || !data || !data.length) return CANDIDATES;
  return data.map((r: any): Candidate => ({
    id: r.id, name: r.name, subject: r.subject, qual: r.qual, exp: r.exp, loc: r.loc,
    boards: r.boards ?? [], curCTC: r.cur_ctc ?? r.curctc ?? 0, expCTC: r.exp_ctc ?? r.expctc ?? 0,
    notice: r.notice, source: r.source, stage: r.stage, match: r.match, commScore: r.comm_score ?? r.commscore ?? 0,
    trust: r.trust ?? 0, reqId: r.req_id ?? r.reqid, recruiter: r.recruiter,
  }));
}

export async function getRequirements(): Promise<Requirement[]> {
  if (!supabase) return REQUIREMENTS;
  const { data, error } = await supabase.from("requirements").select("*");
  if (error || !data || !data.length) return REQUIREMENTS;
  return data.map((r: any): Requirement => ({
    id: r.id, role: r.role, schoolId: r.school_id ?? r.schoolid, board: r.board, subject: r.subject,
    minExp: r.min_exp ?? r.minexp ?? 0, salaryMin: r.salary_min ?? r.salarymin, salaryMax: r.salary_max ?? r.salarymax,
    vacancies: r.vacancies, joining: r.joining, priority: r.priority, status: r.status, createdBy: r.created_by ?? r.createdby ?? "—",
  }));
}

export async function getSchools(): Promise<School[]> {
  if (!supabase) return SCHOOLS;
  const { data, error } = await supabase.from("schools").select("*");
  if (error || !data || !data.length) return SCHOOLS;
  return data.map((r: any): School => ({
    id: r.id, name: r.name, board: r.board, loc: r.loc, vacancies: r.vacancies,
    retention: r.retention, revenue: r.revenue, openInvoices: r.open_invoices ?? r.openinvoices ?? 0,
  }));
}

export async function getRecruiters(): Promise<Recruiter[]> {
  if (!supabase) return RECRUITERS;
  const { data, error } = await supabase.from("recruiters").select("*");
  if (error || !data || !data.length) return RECRUITERS;
  return data.map((r: any): Recruiter => ({
    id: r.id, name: r.name, role: r.role, online: r.online, target: r.target,
    placed: r.placed, calls: r.calls, avatarHue: r.avatar_hue ?? r.avatarhue ?? 200,
  }));
}
