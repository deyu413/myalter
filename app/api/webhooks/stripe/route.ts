import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createClient } from "@supabase/supabase-js"
import Stripe from "stripe"

// Initialize Supabase Admin Client (Service Role)
// We use this because the webhook is not authenticated as a user
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
    const body = await req.text()
    const signature = (await headers()).get("stripe-signature") as string

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (error: any) {
        console.error(`Webhook Signature Error: ${error.message}`)
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
    }

    // Handle the event
    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session

        const userId = session.metadata?.userId
        const creditsAmount = session.metadata?.creditsAmount

        if (userId && creditsAmount) {
            console.log(`Processing payment for User ${userId}: +${creditsAmount} credits`)

            // Update User Credits
            // We use the RPC 'deduct_credit' logic but in reverse, or just direct update since we are admin
            // But wait, we don't have an 'add_credit' RPC. Let's do a direct update or upsert.

            // First, get current balance to be safe, or use an atomic increment if possible.
            // Supabase/Postgres doesn't have a simple "increment" via JS SDK without RPC usually, 
            // but we can use a custom RPC or just read-modify-write since this is a low-concurrency event per user.
            // Better: Create an RPC for adding credits to be atomic.
            // For now, let's try to do it via a direct query if possible, or just read-update.

            // Let's use a raw SQL query via rpc if we had one, but we don't.
            // Let's just read and update. It's acceptable for an MVP.

            const { data: currentCredit, error: readError } = await supabaseAdmin
                .from('user_credits')
                .select('balance')
                .eq('user_id', userId)
                .single()

            if (readError && readError.code !== 'PGRST116') { // PGRST116 is "not found"
                console.error("Error reading credits:", readError)
                return new NextResponse("Database Error", { status: 500 })
            }

            const newBalance = (currentCredit?.balance || 0) + parseInt(creditsAmount)

            const { error: updateError } = await supabaseAdmin
                .from('user_credits')
                .upsert({
                    user_id: userId,
                    balance: newBalance,
                    updated_at: new Date().toISOString()
                })

            if (updateError) {
                console.error("Error updating credits:", updateError)
                return new NextResponse("Database Update Error", { status: 500 })
            }

            console.log(`Success: User ${userId} now has ${newBalance} credits.`)
        }
    }

    return NextResponse.json({ received: true })
}
