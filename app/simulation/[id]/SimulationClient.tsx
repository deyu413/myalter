"use client"

import { useState } from "react"
import { LogTerminal } from "@/components/simulation/LogTerminal"
import { ArrowLeft, Share2, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { SimulationResult } from "@/lib/types/ghost"

interface SimulationClientProps {
    simulation: {
        id: string
        score: number
        created_at: string
        result: SimulationResult
        target_ghost: {
            user: {
                username: string
            }
        }
    }
}

export function SimulationClient({ simulation }: SimulationClientProps) {
    const [isLocked, setIsLocked] = useState(true)

    const messages = simulation.result.dialogue.map((msg: any, index: number) => ({
        role: msg.speaker === 'A' ? 'user' : 'target',
        content: msg.text,
        timestamp: `00:0${index}:00` // Mock timestamp for now
    }))

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Link
                    href="/dashboard"
                    className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="font-mono text-sm">BACK_TO_DECK</span>
                </Link>
                <button className="p-2 rounded-full hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors">
                    <Share2 className="w-5 h-5" />
                </button>
            </div>

            {/* Score Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-1">Simulation #{simulation.id.substring(0, 6)}</h1>
                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                            <span>Subject: {simulation.target_ghost?.user?.username || "Unknown"}</span>
                            <span className="w-1 h-1 rounded-full bg-zinc-600" />
                            <span>{new Date(simulation.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-4xl font-mono font-bold text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">
                            {simulation.score}%
                        </div>
                        <div className="text-xs font-mono text-emerald-500/70">COMPATIBILITY</div>
                    </div>
                </div>

                <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm flex flex-col justify-center space-y-2">
                    <div className="flex items-center gap-2 text-rose-400 font-mono text-xs uppercase tracking-wider">
                        <AlertTriangle className="w-4 h-4" />
                        Detected Flags
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {simulation.result.flags_triggered?.map((flag: string, i: number) => (
                            <span key={i} className="px-2 py-1 rounded bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold">
                                {flag}
                            </span>
                        ))}
                        {(!simulation.result.flags_triggered || simulation.result.flags_triggered.length === 0) && (
                            <span className="text-zinc-500 text-xs italic">None detected</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Terminal */}
            <LogTerminal
                messages={messages as any}
                isLocked={isLocked}
                onUnlock={() => setIsLocked(false)}
            />
        </div>
    )
}
