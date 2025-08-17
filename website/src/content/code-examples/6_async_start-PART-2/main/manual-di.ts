const logger =
  process.env.NODE_ENV === "production" ? new PinoLogger() : new ConsoleLogger()

const auth = new AuthService()
const userData = await auth.getUserData()

const paymentService = new PaymentService(logger, userData)
