"use client"

import { useEffect, useState, type ReactNode } from "react"

export interface Scene {
  node: ReactNode
  // How long the scene stays up: one full loop of its animation.
  ms: number
  // Accessible name of the dot that jumps to this scene.
  label: string
}

// Plays animated scenes one after another, with dots to jump between them.
export function SceneCarousel({ scenes }: { scenes: Scene[] }) {
  const [current, setCurrent] = useState(0)
  const count = scenes.length
  const ms = scenes[current].ms

  // Depends on primitives only: the parent builds a new scenes array on every
  // render, and that must not restart the timer.
  useEffect(() => {
    const id = window.setTimeout(() => setCurrent((c) => (c + 1) % count), ms)
    return () => window.clearTimeout(id)
  }, [current, count, ms])

  return (
    <div>
      {/* The key remounts the scene so its CSS animation starts from the beginning. */}
      <div key={current} className="animate-in fade-in duration-500 motion-reduce:animate-none">
        {scenes[current].node}
      </div>
      <div className="flex justify-center gap-1">
        {scenes.map((scene, i) => (
          <button
            key={scene.label}
            type="button"
            onClick={() => setCurrent(i)}
            aria-label={scene.label}
            aria-pressed={current === i}
            className="hit-44 flex h-6 w-6 items-center justify-center"
          >
            <span
              className={
                "block h-2 rounded-full transition-all duration-300 " +
                (current === i ? "w-5 bg-primary" : "w-2 bg-muted-foreground/40")
              }
            />
          </button>
        ))}
      </div>
    </div>
  )
}
