import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email) {
    return NextResponse.json({ message: 'Email is required' }, { status: 400 })
  }

  const res = await fetch('https://connect.mailerlite.com/api/subscribers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.MAILERLITE_API_KEY}`,
    },
    body: JSON.stringify({ email }),
  })

  if (!res.ok) {
    let message = 'Subscription failed'
    try {
      const error = await res.json()
      message = error?.message ?? message
    } catch {}
    return NextResponse.json({ message }, { status: res.status })
  }

  return NextResponse.json({ success: true })
}
