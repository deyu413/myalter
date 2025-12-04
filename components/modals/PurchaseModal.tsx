"use client"

import { useState } from "react"
import { Zap, Lock } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { createCheckoutSession } from "@/app/actions/stripe"

interface PurchaseModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function PurchaseModal({ open, onOpenChange }: PurchaseModalProps) {
    const [selectedPlan, setSelectedPlan] = useState<"basic" | "pro">("pro")
    const [isLoading, setIsLoading] = useState(false)

    const handlePurchase = async () => {
        setIsLoading(true)
        try {
            const packSize = selectedPlan === "basic" ? "small" : "large"
            const url = await createCheckoutSession(packSize)
            if (url) {
                window.location.href = url
            }
        } catch (error) {
            console.error("Purchase failed", error)
            alert("Failed to initiate checkout. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-zinc-800">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl font-mono text-violet-400">
                        <Zap className="w-5 h-5 fill-violet-400" />
                        REFUEL YOUR GHOST
                    </DialogTitle>
                    <DialogDescription>
                        Credits are used to unlock full simulation logs and run new scenarios.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {/* Basic Plan */}
                    <div
                        onClick={() => setSelectedPlan("basic")}
                        className={cn(
                            "relative flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all",
                            selectedPlan === "basic"
                                ? "border-violet-500 bg-violet-500/10"
                                : "border-zinc-800 hover:border-zinc-700 bg-zinc-900/50"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                                <span className="font-mono text-zinc-400">5</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-zinc-200">Starter Pack</h3>
                                <p className="text-xs text-zinc-500">5 Credits</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="block font-mono text-lg text-zinc-200">2.99€</span>
                        </div>
                    </div>

                    {/* Pro Plan */}
                    <div
                        onClick={() => setSelectedPlan("pro")}
                        className={cn(
                            "relative flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all",
                            selectedPlan === "pro"
                                ? "border-emerald-500 bg-emerald-500/10 shadow-[0_0_20px_-5px_rgba(16,185,129,0.2)]"
                                : "border-zinc-800 hover:border-zinc-700 bg-zinc-900/50"
                        )}
                    >
                        {/* Best Value Badge */}
                        <div className="absolute -top-3 right-4 bg-emerald-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full">
                            BEST VALUE
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                <Zap className="w-5 h-5 text-emerald-400 fill-emerald-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-emerald-400">Power User</h3>
                                <p className="text-xs text-zinc-500">20 Credits</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="block font-mono text-lg text-emerald-400">9.99€</span>
                            <span className="text-[10px] text-emerald-500/70 line-through">11.96€</span>
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex-col sm:justify-center gap-2">
                    <button
                        onClick={handlePurchase}
                        disabled={isLoading}
                        className={cn(
                            "w-full py-3 bg-white text-black font-bold rounded-lg hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2",
                            isLoading && "opacity-50 cursor-wait"
                        )}
                    >
                        {isLoading ? (
                            "Redirecting to Stripe..."
                        ) : (
                            <>
                                <Lock className="w-4 h-4" />
                                Purchase Securely
                            </>
                        )}
                    </button>
                    <p className="text-[10px] text-center text-zinc-600 flex items-center justify-center gap-1">
                        Powered by <span className="font-bold text-zinc-500">Stripe</span>
                    </p>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
