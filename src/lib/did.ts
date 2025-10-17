
/**
 * Generates a mock Ethereum-style Decentralized Identifier (DID).
 * In a real application, this would involve cryptographic key pair generation.
 * @returns A DID string in the format 'did:ethr:0x...'.
 */
export function generateMockDid(): string {
    const hexChars = '0123456789abcdef';
    let address = '0x';
    for (let i = 0; i < 40; i++) {
        address += hexChars[Math.floor(Math.random() * 16)];
    }
    return `did:ethr:${address}`;
}

let studentCounter = 3; // Initial counter, start after the existing mocks

/**
 * Generates a unique, sequential student ID.
 * Example: UC-AB-2024
 * @param schoolInitials - The initials of the school (e.g., "UC").
 * @returns A unique student ID string.
 */
export function generateStudentId(schoolInitials: string): string {
    studentCounter++;
    const year = new Date().getFullYear();
    const randomChars = Math.random().toString(36).substring(2, 4).toUpperCase();
    return `${schoolInitials.toUpperCase()}-${randomChars}-${year}`;
}
