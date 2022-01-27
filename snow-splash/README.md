> Warning lib in heavy dev

# Snow Splash

> Tiny 1kB inversion of control container for Typescript/Javascrith with a focus on async flow

- **fully async:** merges async and constructor injection via an asynchronous Factory (async function)
- **pure:** does not pollute business logic with decorators or magic properties
- **typesafe:** works well with typescript
- **react:** has useful react bindings
- **lightweight:** doesn't rely on 'reflect-metadata' or decorators
- **tiny:** ~1kB

## About

`snow-splash` is a tyiny inversion of control (IoC) container for TypeScript and JavaScript apps. An IoC container provides a way to combine async flow and construction injection

## Motivation

Inversion of Control (IoC) is a great way to decouple the application and the most popular pattern of IoC is dependency injection (DI) [but it is not limited to one](https://martinfowler.com/articles/injection.html).

In JavaScript there is not way to create a dependency injection without polluting business logic with a specific IoC library code, or hacking a compiler.

`snow-splash` provides a pattern to use constructor injection that works in async JS world with all the flexibility you might need at the cost of manually defining providers (async functions) for your code

## Usage

```js
// TBC
```

## old notes

Subjects:

- event emitter: Rather domain scoped
- hidden agenda / goal: share containeres and stores between projects

Containers:

- what about instances shared between multiple containers? No!
- Can we create "combined" contaners? Ok!

Notable inspirations:

- https://github.com/inversify/InversifyJS
- https://github.com/microsoft/tsyringe

Notes:

Sometimes we will need mobx transaction feature
