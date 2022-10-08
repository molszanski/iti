// Part 1: Normal Application Business Logic
interface Logger {
  info: (msg: string) => void
}

interface UserData {
  name: string
}

export class CookieStorageService {
  async getSessionToken(): Promise<{ token: string }> {
    return { token: "magicToken123" }
  }
}

export class AuthService {
  constructor(private cookieStorageService: CookieStorageService) {}
  async getUserData(): Promise<UserData> {
    const { token } = await this.cookieStorageService.getSessionToken()
    if (token === "magicToken123") {
      return { name: "Big Lebowski" }
    }
    throw new Error("Unauthorized")
  }
}

export class PaymentService {
  constructor(
    private readonly logger: Logger,
    private readonly user: UserData
  ) {}
  sendMoney() {
    this.logger.info(`Sending money to the: ${this.user.name} `)
    return true
  }
}

// Application code is free of framework dependencies like decorators
