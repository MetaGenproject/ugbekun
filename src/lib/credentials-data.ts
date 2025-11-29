

export type VerifiableCredential = {
  id: string;
  studentId: string; // The verifiable student ID (e.g., UC-AB-2024)
  title: string;
  issuer: string; // School name
  date: string; // Issue date
  isPublic: boolean; // Controllable by the student
};

// Initial set of mock credentials for our students
export const initialVerifiableCredentials: VerifiableCredential[] = [
    // Credentials for Aisha Bello (UC-AB-2024)
    {
        id: 'vc-001',
        studentId: 'UC-AB-2024',
        title: 'Certificate of Completion - JSS 1',
        issuer: 'Unity College',
        date: '2024-07-26',
        isPublic: true,
    },
    {
        id: 'vc-002',
        studentId: 'UC-AB-2024',
        title: 'Top Performer in Mathematics',
        issuer: 'Unity College',
        date: '2024-07-26',
        isPublic: true,
    },
    {
        id: 'vc-003',
        studentId: 'UC-AB-2024',
        title: 'Debate Club Membership Certificate',
        issuer: 'Unity College',
        date: '2024-06-15',
        isPublic: false,
    },
    // Credentials for David Okon (UC-DO-2024)
    {
        id: 'vc-004',
        studentId: 'UC-DO-2024',
        title: 'Certificate of Completion - JSS 3',
        issuer: 'Unity College',
        date: '2024-07-26',
        isPublic: true,
    },
];
