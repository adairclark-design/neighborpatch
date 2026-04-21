import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';

export const runtime = 'edge'; // Or nodejs depending on Stripe SDK support at edge

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    // Development Bypass: If no Stripe Key exists, instantly mock success!
    if (!process.env.STRIPE_SECRET_KEY) {
      console.warn("STRIPE_SECRET_KEY missing. Using Developer Bypass.");
      
      // We automatically bump the user's profile to verified!
      if (userId) {
        await supabase.from("profiles").update({ is_verified: true }).eq("id", userId);
      }
      
      return NextResponse.json({
        success: true,
        bypassed: true,
        message: "Developer Bypass Activated: Profile marked as verified."
      });
    }

    // Real Implementation
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });

    // Create a robust VerificationSession
    const verificationSession = await stripe.identity.verificationSessions.create({
      type: 'document',
      metadata: {
        userId: userId, // so our webhook knows who to update when the passport scans pass
      },
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://neighborpatch.vercel.app'}/dashboard/settings?verified=true`,
    });

    return NextResponse.json({
      success: true,
      url: verificationSession.url
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
