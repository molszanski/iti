import { app } from "./app"

// Proxy Getter: Lazily creates PaymentService instance
const paymentService = await app.containers.paymentService
paymentService.sendMoney()
