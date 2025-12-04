"use client"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Lock, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
    role: "user" | "target"
    content: string
    timestamp: string
}

interface LogTerminalProps {
    messages: Message[]
    isLocked?: boolean
    onUnlock?: () => void
}

export function LogTerminal({ messages, isLocked = true, onUnlock }: LogTerminalProps) {
    return (
        <div className="relative w-full h-[600px] bg-black/40 border border-zinc-800 rounded-xl overflow-hidden backdrop-blur-sm flex flex-col">
            {/* Header */}
            <div className="px-4 py-3 bg-zinc-900/80 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <div className="text-xs font-mono text-zinc-500">
                    TRANSCRIPT_LOG_V2.txt
                </div>
            </div>

            {/* Chat Area */}
            <ScrollArea className="flex-1 p-6">
                <div className="space-y-6">
                    {messages.map((msg, index) => {
                        const isUser = msg.role === "user"
                        // Blur logic: if locked, blur everything after index 2
                        const isBlurred = isLocked && index > 2

                        return (
                            <div
                                key={index}
                                className={cn(
                                    "flex flex-col max-w-[80%]",
                                    isUser ? "ml-auto items-end" : "mr-auto items-start",
                                    isBlurred && "blur-sm opacity-50 select-none"
                                )}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] font-mono text-zinc-500">
                                        {isUser ? "MY_GHOST" : "TARGET_GHOST"}
                                    </span>
                                    <span className="text-[10px] font-mono text-zinc-600">
                                        {msg.timestamp}
                                    </span>
                                </div>
                                <div
                                    className={cn(
                                        "p-4 rounded-lg font-mono text-sm leading-relaxed",
                                        isUser
                                            ? "bg-violet-500/10 border border-violet-500/30 text-violet-100 rounded-tr-none"
                                            : "bg-zinc-800/50 border border-zinc-700 text-zinc-300 rounded-tl-none"
                                    )}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </ScrollArea>

            {/* Paywall Overlay */}
            {isLocked && (
                <div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-zinc-950 via-zinc-950/90 to-transparent flex items-center justify-center z-10">
                    <div className="text-center space-y-4 p-6">
                        <div className="w-16 h-16 mx-auto rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-2xl">
                            <Lock className="w-6 h-6 text-zinc-400" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-white">Encrypted Log</h3>
                            <p className="text-sm text-zinc-400 max-w-xs mx-auto">
                                This conversation contains sensitive emotional data. Unlock to read the full transcript.
                            </p>
                        </div>
                        <button
                            onClick={onUnlock}
                            className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 mx-auto"
                        >
                            <Zap className="w-4 h-4 fill-black" />
                            Decrypt (1 Credit)
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
