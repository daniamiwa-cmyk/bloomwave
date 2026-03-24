import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const products: Record<string, { name: string; description: string; amount: number }> = {
  'bloom-within': {
    name: 'Bloom Within — 60-Card Daily Practice Deck',
    description:
      '20 Affirmation Cards, 20 Mini-Meditation Cards, 20 Creative Prompt Cards. Printed on thick, premium stock with a soft sheen finish.',
    amount: 6500,
  },
  'coloring-book': {
    name: 'Women & Nature — Affirmation Coloring Book for Strong Women',
    description:
      'Nature-themed botanical illustrations paired with affirmations and journal prompts. Single-sided pages, suitable for all skill levels.',
    amount: 999,
  },
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const product = products[body.product]

    if (!product) {
      return NextResponse.json({ error: 'Invalid product' }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: product.amount,
          },
          quantity: 1,
        },
      ],
      shipping_address_collection: {
        allowed_countries: ['US'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 0, currency: 'usd' },
            display_name: 'Free Shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 3 },
              maximum: { unit: 'business_day', value: 5 },
            },
          },
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://bloomwave.app'}/store/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://bloomwave.app'}/store`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
