interface Logger {
  info: (msg: string) => void
}
export class ConsoleLogger implements Logger {
  info(msg: string): void {
    console.log("[Console]:", msg)
  }
}
export class PinoLogger implements Logger {
  info(msg: string): void {
    console.log("[Pino]:", msg)
  }
}
