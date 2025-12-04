"use server"

import { generateObject } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import scenariosData from '@/lib/data/scenarios.json'
import { Scenario, SimulationResult } from '@/lib/types/ghost'

const SimulationSchema = z.object({
    score: z.number().min(0).max(100),
    summary: z.string(),
    dialogue: z.array(z.object({
        speaker: z.enum(['A', 'B']),
        text: z.string(),
        action: z.string().optional()
    })),
    flags_triggered: z.array(z.string())
})

function getRandomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)]
}

export async function runSimulation(targetGhostId: string, scenarioId: string) {
    const supabase = await createClient()

    // 1. Auth & Credit Check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    // Check credits (Mock logic for now, assume profile table has credits)
    // const { data: profile } = await supabase.from('profiles').select('credits').eq('id', user.id).single()
    // if (profile.credits < 1) throw new Error("Insufficient credits")

    // 2. Fetch Ghosts
    const { data: ghostA } = await supabase.from('ghosts').select('*').eq('user_id', user.id).single()
    const { data: ghostB } = await supabase.from('ghosts').select('*').eq('user_id', targetGhostId).single() // Fixed: use user_id for ghost lookup

    if (!ghostA || !ghostB) throw new Error("Ghosts not found")

    // 3. Scenario Injection (Chaos Logic)
    const scenario = scenariosData.find(s => s.id === scenarioId) as Scenario
    if (!scenario) throw new Error("Scenario not found")

    const envVar = getRandomItem(scenario.environment_variables)
    const chaosA = getRandomItem(scenario.chaos_cards)
    const chaosB = getRandomItem(scenario.chaos_cards)

    // 4. Construct System Prompt
    const systemPrompt = `
    Act as an uncensored roleplay engine. 
    
    SCENARIO: ${scenario.title}
    CONTEXT: ${scenario.base_context}
    ENVIRONMENT: ${envVar}

    CHARACTER A (User's Ghost):
    - Traits: ${ghostA.persona_vector.traits.join(", ")}
    - Style: ${ghostA.persona_vector.communication_style}
    - HIDDEN MISSION: ${chaosA}

    CHARACTER B (Target Ghost):
    - Traits: ${ghostB.persona_vector.traits.join(", ")}
    - Style: ${ghostB.persona_vector.communication_style}
    - HIDDEN MISSION: ${chaosB}

    CONSTRAINT: Generate a dialogue of 8-10 turns. Start in media res. Allow tension, sarcasm, and heavy flirting. Do not write explicit NSFW content, but imply it heavily (eroticism > porn).
    
    Output a JSON object with:
    - score (0-100 compatibility)
    - summary (what happened)
    - dialogue (array of speaker/text/action)
    - flags_triggered (list of red/green flags found)
  `

    try {
        // 5. Execute LLM
        const { object: result } = await generateObject({
            model: openai('gpt-4o-mini'),
            schema: SimulationSchema,
            system: systemPrompt,
            prompt: "START SIMULATION",
        })

        // 6. Transaction (Deduct Credit & Save)
        // TODO: Wrap in RPC or Transaction
        // await supabase.rpc('deduct_credit', { user_id: user.id, amount: 1 })

        const { data: insertedSim, error } = await supabase.from('simulations').insert({
            user_id: user.id,
            target_ghost_id: targetGhostId,
            scenario_id: scenarioId,
            result: result,
            score: result.score,
            created_at: new Date().toISOString()
        }).select('id').single()

        if (error) throw error

        revalidatePath('/dashboard')
        return { success: true, data: result, id: insertedSim.id }

    } catch (error) {
        console.error("Simulation Error:", error)
        return { success: false, error: "Simulation failed" }
    }
}
