

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: string;
  department: "Leadership" | "Engineering" | "Marketing" | "Operations";
  status: "Active" | "On Leave" | "Inactive";
};

export const initialTeamMembers: TeamMember[] = [
    { id: "sa-01", name: "Daniel Innocent", email: "daniel@ugbekun.com", role: "Founder & CEO", department: "Leadership", status: "Active" },
    { id: "sa-02", name: "John Doe", email: "john@ugbekun.com", role: "Lead Developer", department: "Engineering", status: "Active" },
    { id: "sa-03", name: "Jane Smith", email: "jane@ugbekun.com", role: "Head of Marketing", department: "Marketing", status: "Active" },
    { id: "sa-04", name: "Peter Jones", email: "peter@ugbekun.com", role: "Operations Manager", department: "Operations", status: "On Leave" },
];
