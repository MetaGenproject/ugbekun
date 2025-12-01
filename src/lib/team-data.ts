<<<<<<< HEAD


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
=======
export const initialTeamMembers = [
  {
    id: '1',
    name: 'Daniel Innocent',
    role: 'Project Lead',
    avatar: 'https://i.pravatar.cc/40?u=1',
    email: 'daniel@ugbekun.com',
    status: 'Active',
  },
  {
    id: '2',
    name: 'Nabila A',
    role: 'Frontend Developer',
    avatar: 'https://i.pravatar.cc/40?u=2',
    email: 'nabila@ugbekun.com',
    status: 'Active',
  },
];
>>>>>>> origin/new-feature
