import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    message: 'Statistics are stored locally in the browser'
  })
}

export async function POST(request: Request) {
  try {
    const stats = await request.json()
    return NextResponse.json({ success: true, stats })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
