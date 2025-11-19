import { NextResponse } from 'next/server'

const WORD_LIST = [
  'SUELO', 'CAMPO', 'MUNDO', 'LIBRO', 'PAPEL', 'PLUMA', 'CARTA', 'RADIO', 
  'TORRE', 'MONTE', 'VERDE', 'ROJO', 'AZUL', 'BANCO', 'BARCO', 'TREN',
  'AVION', 'COCHE', 'MOTO', 'BICI', 'CASA', 'PISO', 'HOTEL', 'PLAZA'
]

export async function GET() {
  const today = new Date()
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
  const wordIndex = dayOfYear % WORD_LIST.length
  
  return NextResponse.json({ word: WORD_LIST[wordIndex] })
}
