import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature")
  // TODO: verify signature, process event
  return NextResponse.json({ received: true })
}
