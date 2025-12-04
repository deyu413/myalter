"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { Activity, CheckCircle2, XCircle, Clock } from "lucide-react"

interface SimulationCardProps {
    id: string
    targetName: string
    score: number
    status: "completed" | "failed" | "in_progress"
    date: string
}

export function SimulationCard({ id, targetName, score, status, date }: SimulationCardProps) {
    return (
        <Link href={`/simulation/${id}`}>
            <div className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 transition-all hover:border-zinc-700 hover:bg-zinc-900">
                <div className="flex items-center gap-4">
                    {/* Avatar Orb */}
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-zinc-950">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-80 blur-sm" />
                        <div className="absolute inset-0 flex items-center justify-center font-mono text-[10px] font-bold text-white/90">
                            {targetName.substring(0, 2).toUpperCase()}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-zinc-200 truncate">
                                Subject: {targetName}
                            </h4>
                            {status === "completed" && score > 80 && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                    MATCH
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-zinc-500 font-mono">
                            <span>ID: #{id.substring(0, 6)}</span>
                            <span>•</span>
                            <span>{date}</span>
                        </div>
                    </div>

                    {/* Score / Status */}
                    <div className="text-right shrink-0">
                        {status === "in_progress" ? (
                            <div className="flex flex-col items-end gap-1">
                                <Activity className="w-5 h-5 text-violet-500 animate-pulse" />
                                <span className="text-[10px] text-violet-500 font-mono">RUNNING</span>
                            </div>
                        ) : status === "failed" ? (
                            <div className="flex flex-col items-end gap-1">
                                <XCircle className="w-5 h-5 text-zinc-600" />
                                <span className="text-[10px] text-zinc-600 font-mono">ERROR</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-end">
                                <span className={cn(
                                    "text-2xl font-mono font-bold leading-none",
                                    score >= 80 ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" :
                                        score >= 50 ? "text-yellow-400" :
                                            "text-rose-500"
                                )}>
                                    {score}%
                                </span>
                                <span className="text-[10px] text-zinc-500 font-mono mt-1">COMPATIBILITY</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Hover Glow */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>
        </Link>
    )
}
