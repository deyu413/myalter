"use server"

import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function createCheckoutSession(packSize: 'small' | 'large') {
    const supabase = await createClient()

    // 1. Get Current User
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        throw new Error("Unauthorized")
    }

    // 2. Determine Price and Amount
    let priceId: string
    let creditsAmount: number

    if (packSize === 'small') {
        priceId = process.env.STRIPE_PRICE_ID_SMALL!
        creditsAmount = 5
    } else {
        priceId = process.env.STRIPE_PRICE_ID_LARGE!
        creditsAmount = 20
    }

    if (!priceId) {
        throw new Error("Stripe Price ID not configured")
    }

    // 3. Create Checkout Session
    const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [
            {
                price: priceId,
                quantity: 1,
            },
        ],
        metadata: {
            userId: user.id,
            creditsAmount: creditsAmount.toString(),
        },
        success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?payment=success`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?payment=cancelled`,
    })

    if (!session.url) {
        throw new Error("Failed to create checkout session")
    }

    return session.url
}
