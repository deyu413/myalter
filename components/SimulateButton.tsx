"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Terminal } from "lucide-react"

interface SimulateButtonProps {
    onClick?: () => void
    disabled?: boolean
}

export function SimulateButton({ onClick, disabled }: SimulateButtonProps) {
    const [loading, setLoading] = useState(false)
    const [text, setText] = useState("RUN SIMULATION")

    const loadingTexts = [
        "INITIALIZING NEURAL LINK...",
        "ANALYZING PSYCHOMETRICS...",
        "EXTRACTING DOPAMINE VECTORS...",
        "SIMULATING CONVERSATION...",
        "CALCULATING COMPATIBILITY...",
        "DETECTING RED FLAGS...",
        "FINALIZING REPORT..."
    ]

    const handleClick = () => {
        if (disabled) return
        setLoading(true)
        let step = 0

        // Simulate the slot machine effect
        const interval = setInterval(() => {
            setText(loadingTexts[step % loadingTexts.length])
            step++
        }, 150) // Fast switching

        setTimeout(() => {
            clearInterval(interval)
            setLoading(false)
            setText("RUN SIMULATION")
            if (onClick) onClick()
        }, 3000)
    }

    return (
        <button
            onClick={handleClick}
            disabled={loading || disabled}
            className={cn(
                "relative group overflow-hidden rounded-xl px-8 py-6 w-full max-w-md transition-all duration-300",
                "bg-zinc-900 border border-zinc-800 hover:border-violet-500/50",
                "hover:shadow-[0_0_30px_-5px_rgba(124,58,237,0.3)]", // Violet glow
                loading && "border-emerald-500/50 shadow-[0_0_30px_-5px_rgba(52,211,153,0.3)] cursor-wait",
                disabled && "opacity-50 cursor-not-allowed hover:border-zinc-800 hover:shadow-none"
            )}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-fuchsia-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative flex items-center justify-center gap-3">
                {loading ? (
                    <>
                        <Terminal className="w-5 h-5 text-emerald-400 animate-pulse" />
                        <span className="font-mono text-emerald-400 text-lg tracking-widest animate-pulse">
                            {text}
                        </span>
                    </>
                ) : (
                    <>
                        <span className="font-mono text-zinc-100 text-xl font-bold tracking-widest group-hover:text-violet-300 transition-colors">
                            RUN SIMULATION
                        </span>
                    </>
                )}
            </div>

            {/* Scanline effect */}
            {loading && (
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent animate-pulse" />
            )}
        </button>
    )
}
