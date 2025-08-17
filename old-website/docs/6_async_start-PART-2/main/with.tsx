import { app } from "./app"

// Proxy Getter: Lazily creates PaymentService instance
const paymentService = await app.items.paymentService
paymentService.sendMoney()
