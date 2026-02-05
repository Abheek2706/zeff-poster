import { NextResponse } from "next/server"
import crypto from "crypto"
import { updateOrderStatus } from "@/lib/db"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body

        const key_secret = process.env.RAZORPAY_KEY_SECRET || "bucket_secret_placeholder"

        // Verify Signature
        const generated_signature = crypto
            .createHmac("sha256", key_secret)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex")

        if (generated_signature === razorpay_signature) {
            // Payment Successful
            updateOrderStatus(razorpay_order_id, "paid", razorpay_payment_id)
            return NextResponse.json({ success: true })
        } else {
            // Payment Failed
            return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 })
        }

    } catch (error) {
        console.error("Error verifying payment:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
