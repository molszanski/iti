import {
  PaymentService,
  AuthService,
  CookieStorageService,
} from "./business-logic"
import { PinoLogger, ConsoleLogger } from "./loggers"

const logger =
  process.env.NODE_ENV === "production" ? new PinoLogger() : new ConsoleLogger()

const app = async () => {
  const cookieStorage = new CookieStorageService()
  const auth = new AuthService(cookieStorage)
  const userData = await auth.getUserData()
  const paymentService = new PaymentService(logger, userData)

  return {
    paymentService,
  }
}

app().then(({ paymentService }) => {
  paymentService.sendMoney()
})
