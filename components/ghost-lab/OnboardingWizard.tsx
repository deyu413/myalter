"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { ArrowRight, ArrowLeft, Check } from "lucide-react"
import onboardingData from "@/lib/data/onboarding.json"

interface OnboardingWizardProps {
    onComplete: (answers: Record<string, string>) => void
}

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
    const [currentBlockIndex, setCurrentBlockIndex] = useState(0)
    const [answers, setAnswers] = useState<Record<string, string>>({})
    const [customInputs, setCustomInputs] = useState<Record<string, string>>({})

    const currentBlock = onboardingData[currentBlockIndex]
    const isLastBlock = currentBlockIndex === onboardingData.length - 1

    const handleSelect = (questionId: string, value: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }))
    }

    const handleCustomInput = (questionId: string, text: string) => {
        setCustomInputs(prev => ({ ...prev, [questionId]: text }))
        setAnswers(prev => ({ ...prev, [questionId]: `custom:${text}` }))
    }

    const handleNext = () => {
        if (isLastBlock) {
            onComplete(answers)
        } else {
            setCurrentBlockIndex(prev => prev + 1)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    const handleBack = () => {
        if (currentBlockIndex > 0) {
            setCurrentBlockIndex(prev => prev - 1)
        }
    }

    // Check if all questions in current block are answered
    const isBlockComplete = currentBlock.questions.every(q => {
        const answer = answers[q.id]
        if (!answer) return false
        if (answer.startsWith("custom:") && answer.length < 8) return false // Min length for custom
        return true
    })

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-500 uppercase tracking-wider">
                    <span>Neural Calibration</span>
                    <span>Level {currentBlockIndex + 1}/{onboardingData.length}</span>
                </div>
                <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-violet-500 transition-all duration-500 ease-out"
                        style={{ width: `${((currentBlockIndex + 1) / onboardingData.length) * 100}%` }}
                    />
                </div>
                <h2 className="text-2xl font-bold text-white">{currentBlock.title}</h2>
                <p className="text-zinc-400">{currentBlock.description}</p>
            </div>

            {/* Questions */}
            <div className="space-y-8">
                {currentBlock.questions.map((q) => (
                    <div key={q.id} className="space-y-3">
                        <h3 className="text-sm font-medium text-zinc-200">{q.q}</h3>
                        <div className="grid grid-cols-1 gap-2">
                            {q.options.map((opt) => {
                                const isSelected = answers[q.id] === opt.value || (opt.value === 'custom' && answers[q.id]?.startsWith('custom:'))

                                if (opt.value === 'custom') {
                                    return (
                                        <div key={opt.value} className="relative">
                                            <input
                                                type="text"
                                                placeholder="Write your own answer..."
                                                className={cn(
                                                    "w-full px-4 py-3 rounded-lg bg-zinc-900/50 border text-sm transition-all outline-none focus:ring-1 focus:ring-violet-500",
                                                    isSelected ? "border-violet-500 text-white" : "border-zinc-800 text-zinc-400"
                                                )}
                                                value={customInputs[q.id] || ""}
                                                onChange={(e) => handleCustomInput(q.id, e.target.value)}
                                                onFocus={() => handleSelect(q.id, `custom:${customInputs[q.id] || ""}`)}
                                            />
                                        </div>
                                    )
                                }

                                return (
                                    <button
                                        key={opt.value}
                                        onClick={() => handleSelect(q.id, opt.value)}
                                        className={cn(
                                            "w-full text-left px-4 py-3 rounded-lg border text-sm transition-all flex items-center justify-between group",
                                            isSelected
                                                ? "bg-violet-500/10 border-violet-500 text-white"
                                                : "bg-zinc-900/30 border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:border-zinc-700"
                                        )}
                                    >
                                        <span>{opt.text}</span>
                                        {isSelected && <Check className="w-4 h-4 text-violet-500" />}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-8 border-t border-zinc-800">
                <button
                    onClick={handleBack}
                    disabled={currentBlockIndex === 0}
                    className="px-6 py-3 text-sm font-mono text-zinc-500 hover:text-white disabled:opacity-0 transition-colors flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    BACK
                </button>

                <button
                    onClick={handleNext}
                    disabled={!isBlockComplete}
                    className={cn(
                        "px-8 py-3 bg-white text-black font-bold rounded-lg transition-all flex items-center gap-2",
                        !isBlockComplete && "opacity-50 cursor-not-allowed"
                    )}
                >
                    {isLastBlock ? "FINISH CALIBRATION" : "NEXT LEVEL"}
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}
