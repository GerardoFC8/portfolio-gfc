"use client"

import React, { useEffect, useRef } from 'react'

/**
 * Componente que renderiza una animación de "lluvia de código" tipo Matrix en un canvas.
 * Se posiciona de forma fija en el fondo de la página.
 */
const MatrixRain = () => {
  // Referencia al elemento <canvas>
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  // Usamos useRef para el ID del intervalo para poder limpiarlo
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Utilizamos la aserción de no-nulo (!) después de la verificación para satisfacer a TypeScript
    // Se asume que si la función no retorna, el canvas y el contexto son válidos.
    const nonNullCanvas = canvasRef.current! 
    const ctx = nonNullCanvas.getContext('2d')!

    // Array para almacenar la posición 'y' de cada gota
    let drops: number[] = []

    // Símbolos de programación para la lluvia
    const chars = "01;{}[]()=>.<,$:&'!"
    const charArray = chars.split('')
    const fontSize = 14
    
    let columns = 0

    /**
     * Configura o resetea el canvas y las gotas de lluvia.
     * Se llama al inicio y en cada redimensionamiento de ventana.
     */
    const setup = () => {
      // Ajustar el tamaño del canvas al de la ventana
      nonNullCanvas.width = window.innerWidth
      nonNullCanvas.height = window.innerHeight

      // Calcular el número de columnas basado en el ancho
      columns = nonNullCanvas.width / fontSize

      // Reiniciar el array de gotas
      drops = []
      for (let x = 0; x < columns; x++) {
        drops[x] = 1
      }
    }

    /**
     * Dibuja un solo fotograma de la animación.
     */
    function draw() {
      // Comprobar si el modo oscuro está activo
      const isDarkMode = document.documentElement.classList.contains('dark')

      // Fondo semi-transparente para crear el efecto de estela
      // Usamos un fondo claro para light mode y oscuro para dark mode
      ctx.fillStyle = isDarkMode ? 'rgba(17, 24, 39, 0.05)' : 'rgba(249, 250, 251, 0.05)' // bg-gray-900 vs bg-gray-50
      ctx.fillRect(0, 0, nonNullCanvas.width, nonNullCanvas.height)

      // Color de los caracteres de la lluvia (basado en tu lógica original)
      ctx.fillStyle = isDarkMode ? '#2dd4bf' : '#0f7fff' // Verde azulado para oscuro, celeste para claro
      ctx.font = `${fontSize}px monospace`

      // Dibujar cada gota
      for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)]
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        // Resetear la gota al principio de forma aleatoria
        if (drops[i] * fontSize > nonNullCanvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }

        // Incrementar la posición 'y'
        drops[i]++
      }
    }

    // --- Configuración y Limpieza ---

    // Configuración inicial
    setup()

    // Iniciar la animación
    // Limpiamos cualquier intervalo anterior por si acaso
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    intervalRef.current = window.setInterval(draw, 40)

    // Función para manejar el redimensionamiento de la ventana
    const handleResize = () => {
      setup()
    }

    // Añadir el listener para redimensionar
    window.addEventListener('resize', handleResize)

    // Función de limpieza que se ejecuta cuando el componente se desmonta
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      window.removeEventListener('resize', handleResize)
    }
  }, []) // El array vacío asegura que este efecto se ejecute solo una vez (al montar)

  return (
    <canvas
      id="matrix-canvas"
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 bg-background"
      // -z-10 lo pone detrás de todo el contenido.
      // bg-background da un color de fondo inicial consistente con tu tema.
    />
  )
}

export default MatrixRain