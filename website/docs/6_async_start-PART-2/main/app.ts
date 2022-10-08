// Part 2: ITI boilerplate. Manual DI alternative
import { makeRoot } from "iti"
import {
  PaymentService,
  AuthService,
  CookieStorageService,
} from "./business-logic"
import { PinoLogger, ConsoleLogger } from "./loggers"

export const app = makeRoot()
  .add({
    // Add token `logger` and assign some logger instance
    logger: () =>
      process.env.NODE_ENV === "production"
        ? new PinoLogger()
        : new ConsoleLogger(),
    // Add token `cookieStorage` ...
    cookieStorage: () => new CookieStorageService(),
  })
  .add((ctx) => ({
    auth: () => new AuthService(ctx.cookieStorage),
  }))
  .add((ctx) => ({
    userData: async () => await ctx.auth.getUserData(),
  }))
  .add((ctx) => ({
    paymentService: async () =>
      new PaymentService(ctx.logger, await ctx.userData),
  }))
