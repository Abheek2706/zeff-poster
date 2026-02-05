"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useCart } from "../cart/CartContext"
import { toast } from "sonner"
import Script from "next/script"

declare global {
    interface Window {
        Razorpay: any
    }
}

export default function CheckoutButton() {
    const { cart, clearCart } = useCart()
    const [loading, setLoading] = useState(false)

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script")
            script.src = "https://checkout.razorpay.com/v1/checkout.js"
            script.onload = () => resolve(true)
            script.onerror = () => resolve(false)
            document.body.appendChild(script)
        })
    }

    const handlePayment = async () => {
        setLoading(true)

        const res = await loadRazorpay()

        if (!res) {
            toast.error("Razorpay SDK failed to load. Are you online?")
            setLoading(false)
            return
        }

        // 1. Create Order
        try {
            const orderRes = await fetch("/api/payment/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items: cart }),
            })

            if (!orderRes.ok) {
                const err = await orderRes.json()
                throw new Error(err.error || "Failed to create order")
            }

            const orderData = await orderRes.json()

            // 2. Open Razorpay
            const options = {
                key: orderData.keyId,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "ZEFF Posters",
                description: "Premium Poster Order",
                order_id: orderData.orderId,
                handler: async function (response: any) {
                    // 3. Verify Payment
                    try {
                        const verifyRes = await fetch("/api/payment/verify", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            }),
                        })

                        const verifyData = await verifyRes.json()

                        if (verifyData.success) {
                            toast.success("Payment Successful! Order placed.")
                            clearCart()
                            // Redirect or show success state here
                        } else {
                            toast.error("Payment Verification Failed")
                        }
                    } catch (error) {
                        toast.error("Error verifying payment")
                        console.error(error)
                    }
                },
                prefill: {
                    name: "User Name", // Ideally from user input
                    email: "user@example.com",
                    contact: "9999999999",
                },
                theme: {
                    color: "#000000",
                },
            }

            const paymentObject = new window.Razorpay(options)
            paymentObject.open()
            paymentObject.on("payment.failed", function (response: any) {
                toast.error("Payment Failed: " + response.error.description)
            })

        } catch (error: any) {
            console.error(error)
            toast.error(error.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            {/* <Script src="https://checkout.razorpay.com/v1/checkout.js" /> */}
            <Button className="w-full mt-4" onClick={handlePayment} disabled={loading}>
                {loading ? "Processing..." : "Pay Now"}
            </Button>
        </>
    )
}
