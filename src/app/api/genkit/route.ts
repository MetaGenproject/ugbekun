
/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
import { NextResponse } from 'next/server';

// Note: The Genkit API handler has been temporarily replaced with a standard
// Next.js route handler to resolve a persistent build issue.
// The Genkit flows are defined but not exposed via this endpoint currently.
export async function POST(req: Request) {
  return NextResponse.json(
    { error: 'Genkit API endpoint is not configured for this build.' },
    { status: 503 }
  );
}
