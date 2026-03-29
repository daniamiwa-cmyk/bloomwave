import { NextResponse } from 'next/server'

export async function GET() {
  const key = process.env.MAILERLITE_API_KEY
  return NextResponse.json({
    exists: !!key,
    length: key?.length ?? 0,
    preview: key ? `${key.slice(0, 10)}...${key.slice(-6)}` : null,
  })
}
