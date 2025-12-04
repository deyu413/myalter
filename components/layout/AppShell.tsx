"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutGrid, User, Settings, LogOut, Zap, Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { PurchaseModal } from "@/components/modals/PurchaseModal"

interface AppShellProps {
    children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
    const pathname = usePathname()
    const [isPurchaseOpen, setIsPurchaseOpen] = useState(false)
    const [credits, setCredits] = useState(5) // Mock credits

    // Don't show shell on landing or login
    if (pathname === "/" || pathname === "/login") {
        return <>{children}</>
    }

    const navItems = [
        { icon: LayoutGrid, label: "Dashboard", href: "/dashboard" },
        { icon: User, label: "Ghost Profile", href: "/setup" },
        { icon: Settings, label: "Settings", href: "/settings" },
    ]

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-50 flex">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-16 hover:w-64 transition-all duration-300 border-r border-zinc-900 bg-zinc-950/50 backdrop-blur-xl z-50 group fixed h-full">
                <div className="p-4 flex items-center justify-center group-hover:justify-start gap-3 h-16 border-b border-zinc-900/50">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 shrink-0" />
                    <span className="font-mono font-bold text-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap overflow-hidden">
                        GHOST_OS
                    </span>
                </div>

                <nav className="flex-1 py-6 flex flex-col gap-2 px-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 p-3 rounded-xl transition-all",
                                    "hover:bg-zinc-900 group-hover:px-4",
                                    isActive ? "bg-zinc-900 text-violet-400" : "text-zinc-400"
                                )}
                            >
                                <item.icon className={cn("w-5 h-5 shrink-0", isActive && "fill-violet-400/20")} />
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap overflow-hidden font-medium">
                                    {item.label}
                                </span>
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-zinc-900/50">
                    <button className="flex items-center gap-3 p-3 w-full rounded-xl hover:bg-rose-500/10 hover:text-rose-500 text-zinc-400 transition-all group-hover:px-4">
                        <LogOut className="w-5 h-5 shrink-0" />
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap overflow-hidden font-medium">
                            Disconnect
                        </span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 md:ml-16 pb-24 md:pb-0 relative">
                {/* Top Bar (Mobile & Desktop) */}
                <header className="sticky top-0 z-40 w-full h-16 px-6 flex items-center justify-between bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900/50">
                    <div className="md:hidden w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600" />

                    {/* Credit Counter */}
                    <div className="ml-auto">
                        <button
                            onClick={() => setIsPurchaseOpen(true)}
                            className="group flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 transition-all"
                        >
                            <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400 group-hover:animate-pulse" />
                            <span className="font-mono font-bold text-sm text-zinc-200">
                                {credits} CR
                            </span>
                        </button>
                    </div>
                </header>

                <div className="p-6 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>

            {/* Mobile Dock */}
            <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
                <nav className="flex items-center gap-1 p-2 rounded-2xl bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 shadow-2xl shadow-black/50">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "p-3 rounded-xl transition-all",
                                    isActive ? "bg-zinc-800 text-violet-400" : "text-zinc-400"
                                )}
                            >
                                <item.icon className={cn("w-6 h-6", isActive && "fill-violet-400/20")} />
                            </Link>
                        )
                    })}
                    <div className="w-px h-8 bg-zinc-800 mx-1" />
                    <button className="p-3 rounded-xl text-zinc-400">
                        <Menu className="w-6 h-6" />
                    </button>
                </nav>
            </div>

            <PurchaseModal open={isPurchaseOpen} onOpenChange={setIsPurchaseOpen} />
        </div>
    )
}
