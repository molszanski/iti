import { makeRoot } from "iti"
// prettier-ignore
interface Logger { info: (msg: string) => void }
// prettier-ignore
class ConsoleLogger implements Logger { info(msg: string): void { console.log("[Console]:", msg) } }
// prettier-ignore
class PinoLogger    implements Logger { info(msg: string): void { console.log("[Pino]:"   , msg) } }

// Part 1: Business Entities
interface UserData {
  name: string
}

class AuthService {
  async getUserData(): Promise<UserData> {
    return { name: "Big Lebowski" }
  }
}

class PaymentService {
  constructor(
    private readonly logger: Logger,
    private readonly user: UserData
  ) {}
  sendMoney() {
    this.logger.info(`Sending money to the: ${this.user.name} `)
    return true
  }
}

// Step 2: Manual DI
export async function runMyApp() {
  const logger =
    process.env.NODE_ENV === "production"
      ? new PinoLogger()
      : new ConsoleLogger()

  const auth = new AuthService()
  const userData = await auth.getUserData()

  const paymentService = new PaymentService(logger, userData)
  paymentService.sendMoney()
}

export async function runMyApp2() {
  const root = makeRoot()
    .add({
      logger: () =>
        process.env.NODE_ENV === "production"
          ? new PinoLogger()
          : new ConsoleLogger(),
      auth: () => new AuthService(),
    })
    .add((ctx) => ({
      paymentService: async () =>
        new PaymentService(ctx.logger, await ctx.auth.getUserData()),
    }))

  const paymentService = await root.containers.paymentService
  paymentService.sendMoney()
}

console.log(" ---- My App START \n\n")
runMyApp().then(() => {
  console.log("\n\n ---- My App END")
})
