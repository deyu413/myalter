"use client"

import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

interface TraitEqualizerProps {
    traits: {
        introvert_extrovert: number
        diplomatic_ruthless: number
        traditional_chaos: number
    }
    onChange: (key: string, value: number) => void
}

export function TraitEqualizer({ traits, onChange }: TraitEqualizerProps) {
    return (
        <div className="space-y-8 p-6 bg-zinc-900/30 border border-zinc-800 rounded-xl backdrop-blur-sm">
            <h3 className="text-sm font-mono text-zinc-400 uppercase tracking-wider mb-6">
                Personality Equalizer
            </h3>

            {/* Introvert <-> Spotlight Hungry */}
            <div className="space-y-4">
                <div className="flex justify-between text-xs font-mono text-zinc-500">
                    <span>INTROVERT</span>
                    <span>SPOTLIGHT HUNGRY</span>
                </div>
                <Slider
                    value={[traits.introvert_extrovert]}
                    onValueChange={(val) => onChange("introvert_extrovert", val[0])}
                    max={100}
                    step={1}
                    className={cn(
                        "[&>.relative>.absolute]:bg-gradient-to-r [&>.relative>.absolute]:from-cyan-500 [&>.relative>.absolute]:to-violet-500",
                        "[&>span:last-child]:border-zinc-800 [&>span:last-child]:bg-zinc-950"
                    )}
                />
            </div>

            {/* Diplomatic <-> Ruthless */}
            <div className="space-y-4">
                <div className="flex justify-between text-xs font-mono text-zinc-500">
                    <span>DIPLOMATIC</span>
                    <span>RUTHLESS</span>
                </div>
                <Slider
                    value={[traits.diplomatic_ruthless]}
                    onValueChange={(val) => onChange("diplomatic_ruthless", val[0])}
                    max={100}
                    step={1}
                    className={cn(
                        "[&>.relative>.absolute]:bg-gradient-to-r [&>.relative>.absolute]:from-emerald-500 [&>.relative>.absolute]:to-rose-500",
                        "[&>span:last-child]:border-zinc-800 [&>span:last-child]:bg-zinc-950"
                    )}
                />
            </div>

            {/* Traditional <-> Chaos Agent */}
            <div className="space-y-4">
                <div className="flex justify-between text-xs font-mono text-zinc-500">
                    <span>TRADITIONAL</span>
                    <span>CHAOS AGENT</span>
                </div>
                <Slider
                    value={[traits.traditional_chaos]}
                    onValueChange={(val) => onChange("traditional_chaos", val[0])}
                    max={100}
                    step={1}
                    className={cn(
                        "[&>.relative>.absolute]:bg-gradient-to-r [&>.relative>.absolute]:from-blue-500 [&>.relative>.absolute]:to-orange-500",
                        "[&>span:last-child]:border-zinc-800 [&>span:last-child]:bg-zinc-950"
                    )}
                />
            </div>
        </div>
    )
}
