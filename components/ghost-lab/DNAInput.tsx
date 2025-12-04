"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface DNAInputProps {
    value: string
    onChange: (value: string) => void
}

export function DNAInput({ value, onChange }: DNAInputProps) {
    const [density, setDensity] = useState(0)

    useEffect(() => {
        // Calculate "Data Density" based on length
        // Cap at 100% for ~500 characters
        const calculated = Math.min((value.length / 500) * 100, 100)
        setDensity(calculated)
    }, [value])

    return (
        <div className="space-y-3">
            <div className="flex justify-between items-end">
                <label className="text-sm font-mono text-zinc-400 uppercase tracking-wider">
                    Source Code (Bio / WhatsApp Logs)
                </label>
                <div className="text-xs font-mono text-violet-400">
                    DENSITY: {Math.round(density)}%
                </div>
            </div>

            <div className="relative group">
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Paste your raw data here. The more honest, the better the simulation..."
                    className={cn(
                        "w-full h-48 bg-zinc-950 border border-zinc-800 rounded-xl p-4 font-mono text-sm text-zinc-300 resize-none focus:outline-none focus:ring-1 focus:ring-violet-500/50 transition-all",
                        "placeholder:text-zinc-700"
                    )}
                />
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-zinc-700 rounded-tl-lg group-hover:border-violet-500 transition-colors" />
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-zinc-700 rounded-tr-lg group-hover:border-violet-500 transition-colors" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-zinc-700 rounded-bl-lg group-hover:border-violet-500 transition-colors" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-zinc-700 rounded-br-lg group-hover:border-violet-500 transition-colors" />
            </div>

            <Progress value={density} className="h-1 bg-zinc-900" />
        </div>
    )
}
