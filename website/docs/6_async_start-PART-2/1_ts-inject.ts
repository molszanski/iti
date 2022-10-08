import { createInjector } from "typed-inject"
// prettier-ignore
interface Logger { info: (msg: string) => void }
// prettier-ignore
class ConsoleLogger implements Logger { info(msg: string): void { console.log("[Console]:", msg) } }
// prettier-ignore
class PinoLogger    implements Logger { info(msg: string): void { console.log("[Pino]:"   , msg) } }

interface UserData {
  name: string
}

class AuthService {
  async getUserData(): Promise<UserData> {
    return { name: "Big Lebowski" }
  }
}

const Token = Object.freeze({
  logger: "logger",
  consoleLogger: "consoleLogger",
  pinoLogger: "pinoLogger",
  authService: "authService",
  user: "user",
  userData: "userData",
  paymentService: "paymentService",
} as const)

class User {
  public static inject = [Token.userData] as const
  constructor(private data: UserData) {
    console.log("constructing user")
  }
  name = () => this.data.name
}

class PaymentService {
  public static inject = [Token.logger, Token.user] as const
  constructor(private readonly logger: Logger, private readonly user: User) {}
  sendMoney() {
    this.logger.info(`Sending monery to the:     ${this.user.name()} `)
    return true
  }
}

/// INJECTING

export async function runMyApp() {
  const container = createInjector()
    .provideFactory("logger", () =>
      process.env.NODE_ENV === "production"
        ? new PinoLogger()
        : new ConsoleLogger()
    )
    .provideClass(Token.authService, AuthService)

  const authService = container.resolve(Token.authService)
  const userData = await authService.getUserData()

  const container2 = container
    .provideValue(Token.userData, userData)
    .provideClass(Token.user, User)
    .provideClass(Token.paymentService, PaymentService)

  const ps = container2.resolve(Token.paymentService)
  ps.sendMoney()
}

console.log(" ---- My App START \n\n")
runMyApp().then(() => {
  console.log("\n\n ---- My App END")
})

/**
 * There is another option where we add an async function
 * to a factory like this:
 *
 * container.provideFactory('user', async () => { name: 'Alice' })
 *
 * but then all typings go crazy and basically
 * we write in JS :/
 */
