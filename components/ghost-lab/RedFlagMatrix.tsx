"use client"

import { cn } from "@/lib/utils"
import { AlertTriangle } from "lucide-react"

interface RedFlagMatrixProps {
    selectedFlags: string[]
    onChange: (flags: string[]) => void
}

const AVAILABLE_FLAGS = [
    "SMOKING",
    "JEALOUSY",
    "GHOSTING",
    "POLITICS",
    "BAD TEXTER",
    "CLINGY",
    "ARROGANCE",
    "CHEAP",
    "DRAMA",
    "GAMER",
    "WORKAHOLIC",
    "PARTY ANIMAL"
]

export function RedFlagMatrix({ selectedFlags, onChange }: RedFlagMatrixProps) {
    const toggleFlag = (flag: string) => {
        if (selectedFlags.includes(flag)) {
            onChange(selectedFlags.filter((f) => f !== flag))
        } else {
            onChange([...selectedFlags, flag])
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-mono text-rose-500 uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                Red Flag Matrix
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {AVAILABLE_FLAGS.map((flag) => {
                    const isActive = selectedFlags.includes(flag)
                    return (
                        <button
                            key={flag}
                            onClick={() => toggleFlag(flag)}
                            className={cn(
                                "px-4 py-3 rounded-lg border text-xs font-mono font-bold transition-all duration-200",
                                isActive
                                    ? "border-rose-500 bg-rose-500/10 text-rose-500 shadow-[0_0_15px_-5px_rgba(225,29,72,0.5)]"
                                    : "border-zinc-800 bg-zinc-900/50 text-zinc-500 hover:border-zinc-700 hover:text-zinc-400"
                            )}
                        >
                            {isActive ? `NO ${flag}` : flag}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
