"use server"

import { createClient } from '@/lib/supabase/server'

export async function getSimulationHistory() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data: simulations, error } = await supabase
        .from('simulations')
        .select(`
      id,
      score,
      created_at,
      target_ghost:ghosts!target_ghost_id (
        user:profiles!user_id (
          username,
          avatar_url
        )
      )
    `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error("Error fetching history:", error)
        return []
    }

    // Transform to match UI component props
    return simulations.map((sim: any) => ({
        id: sim.id,
        targetName: sim.target_ghost?.user?.username || "Unknown Ghost",
        score: sim.score,
        status: "completed", // All saved sims are completed
        date: new Date(sim.created_at).toLocaleDateString()
    }))
}
