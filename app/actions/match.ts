"use server"

import { createClient } from '@/lib/supabase/server'

export async function findCandidates() {
    const supabase = await createClient()

    // 1. Get Current User's Ghost
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: myGhost } = await supabase
        .from('ghosts')
        .select('embedding')
        .eq('user_id', user.id)
        .single()

    if (!myGhost) throw new Error("Ghost not found")

    // 2. Call RPC to find matches
    // Assumes 'match_ghosts' RPC exists in Supabase
    const { data: candidates, error } = await supabase.rpc('match_ghosts', {
        query_embedding: myGhost.embedding,
        match_threshold: 0.5, // Similarity threshold
        match_count: 3,
    })

    if (error) {
        console.error("Matchmaker Error:", error)
        return []
    }

    return candidates
}
