import "reflect-metadata"
import {
  container,
  injectable,
  inject,
  singleton,
  predicateAwareClassFactory,
} from "tsyringe"
// prettier-ignore
interface Logger { info: (msg: string) => void }
// prettier-ignore
@injectable()
class ConsoleLogger implements Logger { info(msg: string): void { console.log("[Console]:", msg) } }
// prettier-ignore
@injectable()
class PinoLogger    implements Logger { info(msg: string): void { console.log("[Pino]:"   , msg) } }

interface UserData {
  name: string
}

@injectable()
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

// @singleton()
@injectable()
class User {
  constructor(@inject(Token.userData) private data: UserData) {
    console.log("constructing user")
  }
  name = () => this.data.name
}

@injectable()
class PaymentService {
  constructor(
    @inject(Token.logger) private readonly logger: Logger,
    @inject(User) private readonly user: User
  ) {}
  sendMoney() {
    this.logger.info(`Sending monery to the:     ${this.user.name()} `)
    return true
  }
}

/// INJECTING

export async function runMyApp() {
  container.register<Logger>(Token.logger, {
    useFactory: predicateAwareClassFactory<Logger>(
      (c) => {
        // c.resolve(PinoLogger)
        return process.env.NODE_ENV === "production"
      },
      ConsoleLogger,
      PinoLogger
    ),
  })

  // Danger zone 1
  const auth = container.resolve(AuthService)
  const d = await auth.getUserData()
  container.register(Token.userData, { useValue: d })

  // Dange zone 2
  container.resolve(User)
  container.resolve(User)

  const ps = container.resolve(PaymentService)
  ps.sendMoney()
}

console.log(" ---- My App START \n\n")
runMyApp().then(() => {
  console.log("\n\n ---- My App END")
})
