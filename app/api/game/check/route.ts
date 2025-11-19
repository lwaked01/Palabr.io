import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { guess, target } = await request.json()
    
    const normalizedGuess = guess.toUpperCase()
    const normalizedTarget = target.toUpperCase()
    
    const isCorrect = normalizedGuess === normalizedTarget
    
    const feedback = normalizedGuess.split('').map((letter, index) => {
      if (letter === normalizedTarget[index]) {
        return 'correct'
      } else if (normalizedTarget.includes(letter)) {
        return 'present'
      } else {
        return 'absent'
      }
    })
    
    return NextResponse.json({ isCorrect, feedback })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
