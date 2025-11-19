'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()

  const links = [
    { href: '/', label: 'Juego' },
    { href: '/galeria', label: 'Galería' },
    { href: '/contacto', label: 'Contacto' },
  ]

  return (
    <nav className="bg-[#1a1a1b] border-b-2 border-[#3a3a3c] py-4 px-6">
      <div className="max-w-6xl mx-auto flex justify-center gap-8">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-lg font-semibold transition-colors ${
              pathname === link.href
                ? 'text-green-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
