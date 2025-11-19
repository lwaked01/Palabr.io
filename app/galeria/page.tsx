'use client'

import Navigation from '@/components/navigation'
import Image from 'next/image'

const images = [
  {
    src: '/wordle-green-letters-correct.jpg',
    alt: 'Letras verdes indicando posición correcta',
    title: 'Letras Correctas',
  },
  {
    src: '/wordle-yellow-letters-present.jpg',
    alt: 'Letras amarillas indicando letra presente',
    title: 'Letras Presentes',
  },
  {
    src: '/wordle-game-board-completed.jpg',
    alt: 'Tablero de juego completado',
    title: 'Juego Completado',
  },
  {
    src: '/spanish-keyboard-with---key.jpg',
    alt: 'Teclado español con tecla Ñ',
    title: 'Teclado Español',
  },
  {
    src: '/game-statistics-dashboard.jpg',
    alt: 'Panel de estadísticas del juego',
    title: 'Estadísticas',
  },
  {
    src: '/dark-mode-game-interface.jpg',
    alt: 'Interfaz del juego en modo oscuro',
    title: 'Modo Oscuro',
  },
]

export default function GaleriaPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <main className="max-w-6xl mx-auto p-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-12 uppercase tracking-wider">
          Galería de Imágenes
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <div
              key={index}
              className="bg-[#1a1a1b] rounded-lg overflow-hidden border-2 border-[#3a3a3c] hover:border-green-600 transition-colors"
            >
              <div className="relative aspect-video">
                <Image
                  src={image.src || "/placeholder.svg"}
                  alt={image.alt}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-white">{image.title}</h3>
                <p className="text-gray-400 text-sm mt-1">{image.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
