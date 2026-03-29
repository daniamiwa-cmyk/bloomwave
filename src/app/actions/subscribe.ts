'use server'

export async function subscribeToNewsletter(email: string) {
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
    throw new Error(message)
  }

  return { success: true }
}
