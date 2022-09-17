export type UnPromisify<T> = T extends Promise<infer U> ? U : T

export type GetContainerFormat<ProviderFunction extends (...args: any) => any> =
  UnPromisify<ReturnType<ProviderFunction>>

export function addGetter(object, key, fn: any) {
  Object.defineProperty(object, key, {
    get() {
      return fn()
    },
    enumerable: true,
  })
}

export type Assign4<OldContext extends object, NewContext extends object> = {
  [Token in keyof ({
    [K in keyof OldContext]: OldContext[K]
  } & {
    [K in keyof NewContext]: NewContext[K]
  })]: Token extends keyof NewContext
    ? NewContext[Token]
    : Token extends keyof OldContext
    ? OldContext[Token]
    : never
}

export type Prettify<T> = T extends infer U ? { [K in keyof U]: U[K] } : never

export type UnpackFunction<T> = T extends (...args: any) => infer U ? U : T
export type UnpackObject<T> = {
  [K in keyof T]: UnpackFunction<T[K]>
}

export type UnpromisifyObject<T> = {
  [K in keyof T]: UnPromisify<T[K]>
}
// keep
// type AssignAndUnpackObjects<O1 extends {}, O2 extends {}> = UnpromisifyObject<
//   UnpackObject<Assign4<O1, O2>>
// >

export type FullyUnpackObject<T extends {}> = UnpromisifyObject<UnpackObject<T>>

export type KeysOrCb<Context extends {}> =
  | Array<keyof Context>
  | ((t: { [K in keyof Context]: K }) => Array<keyof Context>)

export type MyRecord<O extends {}, T> = {
  [K in keyof O]: T
}
export type ContextGetter<Context extends {}> = {
  [CK in keyof Context]: UnpackFunction<Context[CK]>
}

export type UnpackFunctionReturn<T> = T extends (arg: T) => infer U ? U : T
export type ContextGetterWithCache<Context extends {}> = {
  [CK in keyof Context]: UnpackFunctionReturn<Context[CK]>
}

export function _intersectionKeys(
  needle: { [key: string]: any },
  haystack: { [key: string]: any },
) {
  let haystackKeys = Object.keys(haystack)
  let duplicates = haystackKeys.filter((x) => x in needle)
  if (duplicates.length === 0) {
    return undefined
  }
  return duplicates.join("', '")
}

// let existingTokens = Object.keys(this._disposeContext)
//     let duplicates = existingTokens.filter((x) => x in disposingContext)
//     if (duplicates.length !== 0) {
//       throw new ItiTokenError(
//         `Tokens already exist: ['${duplicates.join("', '")}']`,
//       )
//     }

// Checking if something is promise unnecessarily complicates the code, just use Promise.resolve

// Promise.resolve(valueOrPromiseItDoesntMatter).then(function(value) {

// })

// type Person = {
//   first: string
//   last: string
// }

// const tooFew = { first: "Stefan" }
// const exact = { first: "Stefan", last: "Baumgartner" }
// const tooMany = { first: "Stefan", last: "Baumgartner", age: 37 }

export type CastToShape<T, Shape> = T extends Shape
  ? Exclude<keyof T, keyof Shape> extends never
    ? Shape
    : never
  : Shape

// // Exclude<keyof T, keyof Shape> extends never
// //     ? T
// declare function savePerson<T>(person: CastToShape<T, Person>): void

// savePerson(tooFew) // ✅ doesn't work
// savePerson(exact) // ✅ satisfies the contract
// savePerson(tooMany) // 💥 doesn't work
