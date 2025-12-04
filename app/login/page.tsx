"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { Terminal, ShieldAlert, Brain } from "lucide-react"

export default function LoginPage() {
    const router = useRouter()
    const [acceptedTerms, setAcceptedTerms] = useState(false)
    const [acceptedAI, setAcceptedAI] = useState(false)
    const [shake, setShake] = useState(false)

    const handleLogin = () => {
        if (!acceptedTerms || !acceptedAI) {
            setShake(true)
            setTimeout(() => setShake(false), 500)
            return
        }
        // TODO: Implement Supabase Auth
        console.log("Proceeding to Google Auth...")
        router.push("/dashboard")
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-zinc-950" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-50" />

            <div className="w-full max-w-md space-y-8">
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 mb-4 shadow-[0_0_30px_-10px_rgba(124,58,237,0.3)]">
                        <Terminal className="w-8 h-8 text-violet-500" />
                    </div>
                    <h1 className="text-3xl font-mono font-bold tracking-tight text-white">
                        IDENTIFY YOURSELF
                    </h1>
                    <p className="text-zinc-400 text-sm">
                        Access to the Ghost Protocol requires neural calibration.
                    </p>
                </div>

                <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 space-y-6">
                    {/* GDPR Gate */}
                    <div className="space-y-4">
                        <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-zinc-900/50 transition-colors">
                            <Checkbox
                                id="terms"
                                checked={acceptedTerms}
                                onCheckedChange={(c) => setAcceptedTerms(c as boolean)}
                                className="mt-1 border-zinc-700 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600"
                            />
                            <div className="grid gap-1.5 leading-none">
                                <label
                                    htmlFor="terms"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-200"
                                >
                                    Accept Protocol Terms
                                </label>
                                <p className="text-xs text-zinc-500">
                                    I agree to the processing of my psychological profile for simulation purposes.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-zinc-900/50 transition-colors">
                            <Checkbox
                                id="ai"
                                checked={acceptedAI}
                                onCheckedChange={(c) => setAcceptedAI(c as boolean)}
                                className="mt-1 border-zinc-700 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600"
                            />
                            <div className="grid gap-1.5 leading-none">
                                <label
                                    htmlFor="ai"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-200"
                                >
                                    Consent to AI Simulation
                                </label>
                                <p className="text-xs text-zinc-500">
                                    I understand that my "Ghost" will interact with others autonomously.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Login Button */}
                    <button
                        onClick={handleLogin}
                        className={cn(
                            "w-full py-4 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2",
                            acceptedTerms && acceptedAI
                                ? "bg-white text-black hover:bg-zinc-200 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]"
                                : "bg-zinc-800 text-zinc-500 cursor-not-allowed",
                            shake && "animate-shake border border-rose-500/50 text-rose-500"
                        )}
                    >
                        {shake ? (
                            <>
                                <ShieldAlert className="w-5 h-5" />
                                AUTHORIZATION DENIED
                            </>
                        ) : (
                            <>
                                <Brain className="w-5 h-5" />
                                INITIATE GOOGLE LINK
                            </>
                        )}
                    </button>
                </div>

                <p className="text-center text-xs text-zinc-600 font-mono">
                    SECURE CONNECTION :: ENCRYPTED :: V.1.0.4
                </p>
            </div>
        </div>
    )
}
