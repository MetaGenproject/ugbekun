


export type Transaction = {
  id: string;
  studentName: string;
  type: "Tuition" | "Hostel" | "Uniform" | "Books" | "Salary";
  amount: number;
  date: string;
  status: "Paid" | "Pending" | "Overdue";
  invoiceId?: string;
};

export const initialTransactions: Transaction[] = [
  { id: "trn-001", studentName: "Aisha Bello", type: "Tuition", amount: 75000, date: "2024-09-01", status: "Paid" },
  { id: "trn-002", studentName: "David Okon", type: "Hostel", amount: 50000, date: "2024-09-02", status: "Pending" },
  { id: "trn-003", studentName: "Chiamaka Nwosu", type: "Tuition", amount: 75000, date: "2024-09-03", status: "Paid" },
  { id: "trn-004", studentName: "Tunde Adeboye", type: "Books", amount: 15000, date: "2024-09-04", status: "Paid" },
  { id: "trn-005", studentName: "Fatima Aliyu", type: "Tuition", amount: 75000, date: "2024-08-15", status: "Overdue" },
  { id: "trn-006", studentName: "Emeka Okafor", type: "Tuition", amount: 82000, date: "2024-07-20", status: "Paid" },
  { id: "trn-007", studentName: "Ngozi Okeke", type: "Tuition", amount: 95000, date: "2024-06-10", status: "Paid" },
];

export type Invoice = {
    id: string;
    studentName: string;
    amount: number;
    dueDate: string;
    status: "Paid" | "Pending" | "Overdue";
}

export const initialInvoices: Invoice[] = [
    { id: "INV-0123", studentName: "Aisha Bello", amount: 75000, dueDate: "2024-09-01", status: "Paid" },
    { id: "INV-0124", studentName: "David Okon", amount: 125000, dueDate: "2024-09-01", status: "Pending" },
    { id: "INV-0125", studentName: "Chiamaka Nwosu", amount: 75000, dueDate: "2024-09-01", status: "Paid" },
    { id: "INV-0126", studentName: "Fatima Aliyu", amount: 75000, dueDate: "2024-08-15", status: "Overdue" },
]

export type Expense = {
    id: string;
    item: string;
    category: "Salaries" | "Utilities" | "Supplies" | "Maintenance" | "Marketing" | "Miscellaneous";
    amount: number;
    date: string;
}

export const initialExpenses: Expense[] = [
    { id: "exp-001", item: "Staff Salaries - August", category: "Salaries", amount: 4500000, date: "2024-08-28" },
    { id: "exp-002", item: "Diesel for Generator", category: "Utilities", amount: 150000, date: "2024-09-02" },
    { id: "exp-003", item: "Textbooks for JSS 1", category: "Supplies", amount: 350000, date: "2024-09-03" },
    { id: "exp-004", item: "Repair of School Bus", category: "Maintenance", amount: 85000, date: "2024-09-05" },
    { id: "exp-005", item: "Staff Salaries - July", category: "Salaries", amount: 4200000, date: "2024-07-28" },
    { id: "exp-006", item: "Internet Subscription", category: "Utilities", amount: 50000, date: "2024-08-01" },
    { id: "exp-007", item: "Staff Salaries - June", category: "Salaries", amount: 4150000, date: "2024-06-28" },
]


export type ScratchCard = {
    pin: string; // The unique PIN for the scratch card
    uses: number; // Number of times the card can be used
    maxUses: number; // The initial number of uses
    studentId?: string; // Optional: Link card to a specific student ID for security
}

// Mock database of scratch cards. In a real app, this would be a secure database table.
export const scratchCards: ScratchCard[] = [
    { pin: '123456789012', uses: 5, maxUses: 5, studentId: 'UC-AB-2024' },
    { pin: '234567890123', uses: 0, maxUses: 5, studentId: 'UC-DO-2024' },
    { pin: '345678901234', uses: 1, maxUses: 1 }, // A single-use, non-student-specific card
];
