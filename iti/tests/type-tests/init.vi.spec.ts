import { attest } from "@ark/attest"
import { describe, it, expect } from "vitest"
import { type } from "arktype"

// @ark/attest assertions can be made from any unit test framework with a global setup/teardown
describe("attest features", () => {
  it("type and value assertions", () => {
    // const even = type("number%2")
    // asserts even.infer is exactly number
    let a = 12
    attest<number>(a)
    // make assertions about types and values seamlessly
    // attest(even.infer).type.toString.snap("number")
    // // including object literals- no more long inline strings!
    // attest(even.json).snap({
    //   intersection: [{ domain: "number" }, { divisor: 2 }],
    // })
  })
})
// describe("init", () => {
//   it("should be able to init", () => {

//     let a = init("324rd")
//     // console.log(attest(a))

//     const even = type("number%2")
// 		console.log("even.infer", even.infer)
// 		attest(even.infer).type.toString.snap("number")
//     // attest<number>(even.infer)
// 		// asserts even.infer is exactly number
// 		// attest<number>(a)
//     expect(a).toBe(12)
//   })

//   // it("type and value assertions", () => {
// 	// 	const Even = type("number%2")
// 	// 	// asserts even.infer is exactly number
// 	// 	attest<number>(even.infer)
// 	// 	// make assertions about types and values seamlessly
// 	// 	attest(even.infer).type.toString.snap("number")
// 	// 	// including object literals- no more long inline strings!
// 	// 	attest(even.json).snap({
// 	// 		intersection: [{ domain: "number" }, { divisor: 2 }]
// 	// 	})
// 	// })

// })
