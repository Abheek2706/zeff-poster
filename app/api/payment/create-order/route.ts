import { NextResponse } from "next/server"
import Razorpay from "razorpay"
import { saveOrder } from "@/lib/db"

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder", // Replace with env var in prod
    key_secret: process.env.RAZORPAY_KEY_SECRET || "bucket_secret_placeholder",
})

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { items } = body

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "No items in cart" }, { status: 400 })
        }

        // Calculate total quantity
        const totalQty = items.reduce((sum: number, item: any) => sum + item.quantity, 0)

        // Calculate bulk price logic ( Backend Validation )
        // 1 -> 99
        // 5 -> 475 (95 each)
        // 10 -> 930 (93 each)

        // Logic: 
        // We can apply the bulk discount based on the TOTAL number of posters.
        // Or we can just sum up the individual item prices if the user expects mixed pricing.
        // However, the prompt says "Buy 5 Posters @ 475".
        // Let's implement a smart calculation:

        let totalAmount = 0
        let remainingQty = totalQty

        if (totalQty > 10) {
            // Capped Pricing Logic
            // First 10 @ 930
            // Additional @ 93
            totalAmount = 930 + (totalQty - 10) * 93
        } else {
            // Standard Bundle Logic
            const setsOf10 = Math.floor(remainingQty / 10)
            remainingQty -= setsOf10 * 10
            totalAmount += setsOf10 * 930

            const setsOf5 = Math.floor(remainingQty / 5)
            remainingQty -= setsOf5 * 5
            totalAmount += setsOf5 * 475

            totalAmount += remainingQty * 99
        }

        // Create Razorpay Order
        const options = {
            amount: totalAmount * 100, // amount in paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        }

        const order = await razorpay.orders.create(options)

        // Save to DB
        saveOrder({
            id: order.id, // using razorpay id as internal id for now
            razorpayOrderId: order.id,
            amount: totalAmount,
            currency: "INR",
            status: "created",
            items: items,
            createdAt: new Date().toISOString(),
        })

        return NextResponse.json({
            orderId: order.id,
            amount: totalAmount * 100,
            currency: "INR",
            keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder"
        })

    } catch (error) {
        console.error("Error creating order:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
