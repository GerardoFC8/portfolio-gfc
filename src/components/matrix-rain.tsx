"use client"

import { useEffect, useRef } from "react"

const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    if (reduceMotion) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const chars = "01;{}[]()=>.<,$:&'!".split("")
    const fontSize = 14
    let drops: number[] = []
    let columns = 0
    let intervalId: number | null = null

    const setup = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      columns = Math.ceil(canvas.width / fontSize)
      drops = new Array(columns).fill(1)
    }

    const draw = () => {
      const isDarkMode = document.documentElement.classList.contains("dark")
      ctx.fillStyle = isDarkMode
        ? "rgba(17, 24, 39, 0.05)"
        : "rgba(249, 250, 251, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = isDarkMode ? "#2dd4bf" : "#0f7fff"
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    const start = () => {
      if (intervalId !== null) return
      intervalId = window.setInterval(draw, 40)
    }

    const stop = () => {
      if (intervalId === null) return
      clearInterval(intervalId)
      intervalId = null
    }

    const handleVisibility = () => {
      if (document.hidden) stop()
      else start()
    }

    setup()
    start()
    window.addEventListener("resize", setup)
    document.addEventListener("visibilitychange", handleVisibility)

    return () => {
      stop()
      window.removeEventListener("resize", setup)
      document.removeEventListener("visibilitychange", handleVisibility)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="fixed top-0 left-0 w-full h-full -z-10 bg-background"
    />
  )
}

export default MatrixRain
