"use client"

import { useState, useEffect } from "react"
import { SimulateButton } from "@/components/SimulateButton"
import { SimulationCard } from "@/components/dashboard/SimulationCard"
import { Terminal, AlertCircle } from "lucide-react"
import { findCandidates } from "@/app/actions/match"
import { runSimulation } from "@/app/actions/simulation"
import { getSimulationHistory } from "@/app/actions/history"
import { useRouter } from "next/navigation"

const SCENARIO_IDS = [
    "SCN_01_NETFLIX",
    "SCN_02_ELEVATOR",
    "SCN_03_EX_WEDDING",
    "SCN_04_ROADTRIP",
    "SCN_05_FIRST_DATE_DISASTER",
    "SCN_06_OFFICE_LATE"
]

export default function DashboardPage() {
    const router = useRouter()
    const [simulations, setSimulations] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSimulating, setIsSimulating] = useState(false)

    useEffect(() => {
        loadHistory()
    }, [])

    const loadHistory = async () => {
        try {
            const history = await getSimulationHistory()
            setSimulations(history)
        } catch (error) {
            console.error("Failed to load history", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSimulate = async () => {
        setIsSimulating(true)
        try {
            // 1. Find a Candidate
            const candidates = await findCandidates()
            if (!candidates || candidates.length === 0) {
                alert("No compatible ghosts found in the sector. Try adjusting your filters (or wait for more users).")
                setIsSimulating(false)
                return
            }

            // Pick the best match (or random from top 3)
            const target = candidates[0]

            // 2. Pick a Random Scenario
            const scenarioId = SCENARIO_IDS[Math.floor(Math.random() * SCENARIO_IDS.length)]

            // 3. Run Simulation
            const result = await runSimulation(target.user_id, scenarioId)

            if (result.success) {
                // Redirect to the new simulation
                // We need the ID of the new simulation. 
                // The server action currently returns { success: true, data: result } but not the DB ID.
                // I need to update the server action to return the ID.
                // For now, let's assume I'll fix the server action.
                // If I can't fix it right now, I'll just reload the dashboard.
                // But better to fix the action.

                // Let's assume I fix the action to return { success: true, id: string }
                if (result.id) {
                    router.push(`/simulation/${result.id}`)
                } else {
                    // Fallback
                    loadHistory()
                }
            } else {
                alert("Simulation failed: " + result.error)
            }

        } catch (error) {
            console.error(error)
            alert("System Error: Neural Link Failed.")
        } finally {
            setIsSimulating(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-12">
            {/* Header / Action */}
            <div className="flex flex-col items-center justify-center py-12 space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-mono font-bold text-white tracking-tight">
                        SIMULATION DECK
                    </h1>
                    <p className="text-zinc-400">
                        Deploy your ghost into the void.
                    </p>
                </div>

                <SimulateButton onClick={handleSimulate} disabled={isSimulating} />

                {isSimulating && (
                    <div className="text-xs font-mono text-violet-400 animate-pulse">
                        ESTABLISHING NEURAL LINK...
                    </div>
                )}
            </div>

            {/* Feed */}
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                    <h2 className="text-sm font-mono text-zinc-500 uppercase tracking-wider">
                        Recent Operations
                    </h2>
                    <span className="text-xs text-zinc-600 font-mono">
                        {simulations.length} RECORDS FOUND
                    </span>
                </div>

                <div className="grid gap-4">
                    {isLoading ? (
                        <div className="text-center py-12 text-zinc-600 font-mono text-xs">LOADING DATA STREAMS...</div>
                    ) : simulations.length === 0 ? (
                        <div className="py-24 flex flex-col items-center justify-center text-zinc-600 border border-dashed border-zinc-800 rounded-xl">
                            <Terminal className="w-8 h-8 mb-4 opacity-50" />
                            <p className="font-mono text-sm">GHOST IS IDLE.</p>
                            <p className="text-xs">Deploy simulation protocol to begin.</p>
                        </div>
                    ) : (
                        simulations.map((sim) => (
                            <SimulationCard key={sim.id} {...sim} />
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
