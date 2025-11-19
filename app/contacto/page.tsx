'use client'

import { useState } from 'react'
import Navigation from '@/components/navigation'

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: '',
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [submitted, setSubmitted] = useState(false)

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (!formData.mensaje.trim()) {
      newErrors.mensaje = 'El mensaje es requerido'
    } else if (formData.mensaje.trim().length < 10) {
      newErrors.mensaje = 'El mensaje debe tener al menos 10 caracteres'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      console.log('Formulario enviado:', formData)
      setSubmitted(true)
      setFormData({ nombre: '', email: '', mensaje: '' })
      setTimeout(() => setSubmitted(false), 5000)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <Navigation />

      <main className="max-w-2xl mx-auto p-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-4 uppercase tracking-wider">
          Contacto
        </h1>
        <p className="text-gray-400 text-center mb-12">
          ¿Tienes alguna pregunta o sugerencia? Envíanos un mensaje
        </p>

        {submitted && (
          <div className="bg-green-600 text-white p-4 rounded-lg mb-6 text-center font-semibold">
            ¡Mensaje enviado exitosamente! Te responderemos pronto.
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-[#1a1a1b] rounded-lg p-8 border-2 border-[#3a3a3c]">
          <div className="mb-6">
            <label htmlFor="nombre" className="block text-white font-semibold mb-2">
              Nombre *
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={`w-full bg-[#2a2a2b] text-white border-2 rounded-lg px-4 py-3 focus:outline-none focus:border-green-600 transition-colors ${
                errors.nombre ? 'border-red-500' : 'border-[#3a3a3c]'
              }`}
              placeholder="Tu nombre"
            />
            {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
          </div>

          <div className="mb-6">
            <label htmlFor="email" className="block text-white font-semibold mb-2">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full bg-[#2a2a2b] text-white border-2 rounded-lg px-4 py-3 focus:outline-none focus:border-green-600 transition-colors ${
                errors.email ? 'border-red-500' : 'border-[#3a3a3c]'
              }`}
              placeholder="tu@email.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div className="mb-6">
            <label htmlFor="mensaje" className="block text-white font-semibold mb-2">
              Mensaje *
            </label>
            <textarea
              id="mensaje"
              name="mensaje"
              value={formData.mensaje}
              onChange={handleChange}
              rows={6}
              className={`w-full bg-[#2a2a2b] text-white border-2 rounded-lg px-4 py-3 focus:outline-none focus:border-green-600 transition-colors resize-none ${
                errors.mensaje ? 'border-red-500' : 'border-[#3a3a3c]'
              }`}
              placeholder="Escribe tu mensaje aquí..."
            />
            {errors.mensaje && <p className="text-red-500 text-sm mt-1">{errors.mensaje}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Enviar Mensaje
          </button>

          <p className="text-gray-400 text-sm text-center mt-4">* Campos requeridos</p>
        </form>
      </main>
    </div>
  )
}
