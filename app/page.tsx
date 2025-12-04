import { SimulateButton } from "@/components/SimulateButton";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 sm:p-20 font-sans relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-600/20 rounded-full blur-[120px]" />
      </div>

      <main className="flex flex-col gap-8 items-center text-center max-w-4xl z-10">
        <div className="space-y-4">
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-zinc-100 to-zinc-500">
            DATING IS BROKEN.
            <br />
            <span className="text-violet-500">SEND YOUR CLONE.</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto font-mono">
            Ghost Protocol simulates thousands of conversations between your AI persona and others.
            No swiping. No small talk. Just results.
          </p>
        </div>

        <div className="mt-12 w-full flex justify-center">
          <SimulateButton />
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-left w-full">
          <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm">
            <h3 className="text-emerald-400 font-mono mb-2 text-lg">01. UPLOAD</h3>
            <p className="text-zinc-400 text-sm">Train your Ghost on your personality and red flags.</p>
          </div>
          <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm">
            <h3 className="text-violet-400 font-mono mb-2 text-lg">02. SIMULATE</h3>
            <p className="text-zinc-400 text-sm">Your Ghost talks to thousands of others in the void.</p>
          </div>
          <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm">
            <h3 className="text-rose-400 font-mono mb-2 text-lg">03. REVEAL</h3>
            <p className="text-zinc-400 text-sm">Read the transcripts. Pay to see what they really think.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
