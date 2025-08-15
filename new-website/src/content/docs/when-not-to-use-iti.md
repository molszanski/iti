---
title: When not to use ITI?
description: Learn when ITI might not be the right choice for your project
---

:::note

Please know, that the docs is still work in progress. Many features or use cases are probably already in the lib but not documented well. We are working on it.

:::

# Why ITI

<TOCInline toc={toc} />

## Questions

:::note

This guide assumes that you are familiar with Dependency Injection. If not you can read a classical [article by M. Fowler](https://martinfowler.com/articles/injection.html) or [this blog article](https://medium.com/@samueleresca/inversion-of-control-and-dependency-injection-in-typescript-3040d568aabe)

:::

### Should I use Dependency Injection?

Yes! It is a very efficient technique to decouple your code. You can read more about it in a classical [article by M. Fowler](https://martinfowler.com/articles/injection.html)

Remember, you don't need any framework to use dependency injection. The example below is a valid approach and is

```ts
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
const logger = new PinoLogger()
const userData = getUserDataFromCookies()
const ps = new PaymentService(logger, userData)
```

:::note

Dependency Injection is a [Dependency Inversion Principle](https://en.wikipedia.org/wiki/Dependency_inversion_principle) technique. And Dependency Inversion Principle is "D" in [SOLID](https://en.wikipedia.org/wiki/SOLID). So you are using well established and battle tested patterns when you use DI.

:::

### When should I use a Dependency Injection Framework?

There are two main approaches to Dependency Injection. **Manual** and a **framework**.

:::tip

Manual DI is also often called "Pure DI" or "Poor Man's DI."

:::

We don't **need** frameworks! It is possible to implement and maintain a dependency injection manually even for a relatively large project! On the other hand, a framework can make things easier, may contain other useful functionality or might be vital for bigger projects.

There is an article on the subject by one of the most respected expert on DI, Mark Seemann "[When to use a DI Container by Mark Seemann](https://blog.ploeh.dk/2012/11/06/WhentouseaDIContainer/)"

In short, you should probably use manual DI for as long as possible because it is simple. And you can move to a framework if you need some special feature or your "boilerplate" wiring code becomes too complex.

### Why do I need an async Dependency Injection Framework?

Because you have async code. Because some of your dependencies can be loaded via a dynamic import.

You might run into some trivial examples where only manual DI works. Please check [our full async example](/docs/async-di/manual-di).

**This example is unapologetically simple, but sadly, other frameworks don't offer solution to this.**

```ts
const logger =
  process.env.NODE_ENV === "production" ? new PinoLogger() : new ConsoleLogger()

const auth = new AuthService()
const userInfo = new User(await auth.getUserData())

const paymentService = new PaymentService(logger, userInfo)
paymentService.sendMoney()
```

### Which Dependency Injection Frameworks should I consider?

_wip_

## Why another library?

The main reason is that existing libraries don’t support **asynchronous code**. Iti brings hassle free and fully typed way to use async code.

Secondly, existing libraries rely on decorators and `reflect-metadata`[^1]. They **couple your application business logic with a single framework** and they tend to become unnecessarily complex. Also existing implementations will likely be incompatible with a [TC39 proposal](https://github.com/tc39/proposal-decorators).

Also it is hard to use `reflect-metadata` with starters like CRA, Next.js etc. You need to `eject` or hack starters and it is far from ideal.

[^1]: Kudos to [typed-inject](https://github.com/nicojs/typed-inject) for finding a reasonable alternative to decorators and Reflect. Sadly, it doesn't support async and there are some other limits
