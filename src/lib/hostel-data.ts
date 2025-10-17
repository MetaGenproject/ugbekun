
export type ResidentStatus = "Checked-in" | "Checked-out";
export type HostelType = "Boys' Hostel" | "Girls' Hostel";

export type Resident = {
  id: string;
  name: string;
  hostel: HostelType;
  room: string;
  status: ResidentStatus;
};

export const initialResidents: Resident[] = [
  { id: "res-001", name: "David Okon", hostel: "Boys' Hostel", room: "A101", status: "Checked-in" },
  { id: "res-002", name: "Tunde Adeboye", hostel: "Boys' Hostel", room: "A102", status: "Checked-in" },
  { id: "res-003", name: "Aisha Bello", hostel: "Girls' Hostel", room: "B205", status: "Checked-in" },
  { id: "res-004", name: "Chiamaka Nwosu", hostel: "Girls' Hostel", room: "B205", status: "Checked-in" },
  { id: "res-005", name: "Emeka Okafor", hostel: "Boys' Hostel", room: "A103", status: "Checked-out" },
];
