import { createClient } from '@/lib/supabase/server'
import { SimulationClient } from './SimulationClient'
import { notFound } from 'next/navigation'

export default async function SimulationPage({ params }: { params: { id: string } }) {
    const supabase = await createClient()
    const { id } = await params

    const { data: simulation, error } = await supabase
        .from('simulations')
        .select(`
      *,
      target_ghost:ghosts!target_ghost_id (
        user:profiles!user_id (
          username,
          avatar_url
        )
      )
    `)
        .eq('id', id)
        .single()

    if (error || !simulation) {
        notFound()
    }

    return <SimulationClient simulation={simulation} />
}
