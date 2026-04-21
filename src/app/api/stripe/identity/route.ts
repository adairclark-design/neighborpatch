import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: Request) {
  // In a real implementation:
  // 1. const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  // 2. const verificationSession = await stripe.identity.verificationSessions.create({ type: 'document' });
  // 3. Update Supabase profile `is_verified` true upon webhook success.

  return NextResponse.json({
    success: true,
    message: "Identity verification initiated",
    client_secret: "mock_client_secret_12345"
  });
}
