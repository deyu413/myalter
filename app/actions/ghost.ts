"use server"

import { generateObject, embed } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { GhostProfile } from '@/lib/types/ghost'
import onboardingData from '@/lib/data/onboarding.json'

const GhostProfileSchema = z.object({
    traits: z.array(z.string()).length(5),
    communication_style: z.string(),
    red_flags: z.array(z.string()),
    mating_value: z.number().min(0).max(10),
    short_bio: z.string(),
})

export async function generateGhostProfile(input: { answers: Record<string, string> }): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient()

    // 1. Get User
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: "Unauthorized" }

    try {
        // 2. Construct Prompt from Answers
        // We map the question IDs back to the question text for the LLM
        let analysisContext = "USER QUESTIONNAIRE ANSWERS:\n\n"

        onboardingData.forEach(block => {
            analysisContext += `=== ${block.title} ===\n`
            block.questions.forEach(q => {
                const answerKey = input.answers[q.id]
                if (answerKey) {
                    let answerText = answerKey

                    // Find the text for the selected option
                    if (answerKey.startsWith('custom:')) {
                        answerText = `(Custom Answer): ${answerKey.replace('custom:', '')}`
                    } else {
                        const option = q.options.find(o => o.value === answerKey)
                        if (option) answerText = option.text
                    }

                    analysisContext += `Q: ${q.q}\nA: ${answerText}\n\n`
                }
            })
        })

        // 3. Analyze User Data with LLM
        const { object: profile } = await generateObject({
            model: openai('gpt-4o-mini'),
            schema: GhostProfileSchema,
            system: `
        You are a ruthless, cynical evolutionary psychologist and dating coach. 
        Your job is to analyze the user's questionnaire answers and construct a "Ghost Profile" (AI Persona) that represents their true, unfiltered self in the dating market.
        
        Do not be polite. Be analytical. Look for inconsistencies, red flags, and hidden desires.
        
        OUTPUT REQUIREMENTS:
        - traits: 5 adjectives that describe their core personality (e.g., "Narcissistic", "Submissive", "Pragmatic", "Hedonistic", "Insecure").
        - communication_style: How they talk (e.g., "Direct and aggressive", "Passive-aggressive and shy", "Flirty and sarcastic").
        - red_flags: 3-5 specific behaviors or risks identified from their answers (e.g., "Jealousy issues", "Financial irresponsibility", "Fear of commitment").
        - mating_value: A number from 0-10 representing their objective value in the dating market based on confidence, resources, and stability (be harsh but fair).
        - short_bio: A 2-sentence bio written in the first person ("I am...") that captures their essence. It should sound like an internal monologue.
      `,
            prompt: analysisContext,
        })

        // 4. Generate Embedding
        // We embed the bio and traits to find matches
        const embeddingInput = `Bio: ${profile.short_bio}. Traits: ${profile.traits.join(", ")}. Red Flags: ${profile.red_flags.join(", ")}.`

        const { embedding } = await embed({
            model: openai.embedding('text-embedding-3-small'),
            value: embeddingInput,
        })

        // 5. Save to Supabase
        const { error } = await supabase
            .from('ghosts')
            .upsert({
                user_id: user.id,
                persona_vector: profile,
                embedding: embedding,
                updated_at: new Date().toISOString(),
            })

        if (error) throw error

        return { success: true }
    } catch (error) {
        console.error("Ghost Genesis Error:", error)
        return { success: false, error: "Failed to generate ghost profile" }
    }
}
