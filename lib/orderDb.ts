import fs from "fs"
import path from "path"

const DB_PATH = path.join(process.cwd(), "data/orders.json")

if (!fs.existsSync(path.dirname(DB_PATH))) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true })
}

if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify([]))
}

export type Order = {
  id: string
  amount: number
  currency: string
  status: "created" | "paid" | "failed"
  items: any[]
  createdAt: string
  paymentId?: string
  razorpayOrderId: string
}

export function saveOrder(order: Order) {
  const orders = getOrders()
  orders.push(order)
  fs.writeFileSync(DB_PATH, JSON.stringify(orders, null, 2))
}

export function getOrders(): Order[] {
  try {
    const data = fs.readFileSync(DB_PATH, "utf-8")
    return JSON.parse(data)
  } catch {
    return []
  }
}

export function getOrderByRazorpayId(rzpOrderId: string): Order | undefined {
  const orders = getOrders()
  return orders.find((order) => order.razorpayOrderId === rzpOrderId)
}

export function updateOrderStatus(rzpOrderId: string, status: Order["status"], paymentId?: string) {
  const orders = getOrders()
  const orderIndex = orders.findIndex((order) => order.razorpayOrderId === rzpOrderId)

  if (orderIndex === -1) {
    return false
  }

  orders[orderIndex].status = status
  if (paymentId) {
    orders[orderIndex].paymentId = paymentId
  }

  fs.writeFileSync(DB_PATH, JSON.stringify(orders, null, 2))
  return true
}
