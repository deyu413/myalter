"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Brain, Activity, Save } from "lucide-react"
import { generateGhostProfile } from "@/app/actions/ghost"
import { cn } from "@/lib/utils"
import { OnboardingWizard } from "@/components/ghost-lab/OnboardingWizard"

export default function GhostLabPage() {
    const router = useRouter()
    const [isSaving, setIsSaving] = useState(false)
    const [wizardCompleted, setWizardCompleted] = useState(false)

    const handleWizardComplete = async (answers: Record<string, string>) => {
        setWizardCompleted(true)
        setIsSaving(true)

        try {
            const result = await generateGhostProfile({
                answers: answers
            })

            if (result.success) {
                router.push("/dashboard")
            } else {
                alert("Failed to generate ghost. " + (result.error || "Unknown error"))
                setIsSaving(false)
                setWizardCompleted(false)
            }
        } catch (error) {
            console.error(error)
            alert("An error occurred while connecting to the neural core.")
            setIsSaving(false)
            setWizardCompleted(false)
        }
    }

    if (isSaving) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-6">
                <div className="relative w-24 h-24">
                    <div className="absolute inset-0 border-4 border-zinc-800 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-violet-500 rounded-full border-t-transparent animate-spin"></div>
                    <Brain className="absolute inset-0 m-auto w-8 h-8 text-violet-400 animate-pulse" />
                </div>
                <div className="text-center space-y-2">
                    <h2 className="text-xl font-mono font-bold text-white">COMPILING NEURAL GHOST</h2>
                    <p className="text-zinc-500 text-sm">Analyzing psychological patterns...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto py-12 px-4">
            <div className="flex items-center gap-4 mb-12">
                <div className="w-12 h-12 rounded-xl bg-violet-600/20 flex items-center justify-center border border-violet-500/30">
                    <Brain className="w-6 h-6 text-violet-400" />
                </div>
                <div>
                    <h1 className="text-2xl font-mono font-bold text-white">GHOST LAB</h1>
                    <p className="text-zinc-400 text-sm">Configure your neural clone parameters.</p>
                </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 md:p-8">
                <OnboardingWizard onComplete={handleWizardComplete} />
            </div>
        </div>
    )
}
