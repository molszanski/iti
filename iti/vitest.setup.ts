import * as attest from "@ark/attest"
import path from "path"

const __dirname = new URL(".", import.meta.url).pathname
const tsconfig = path.join(__dirname, "tsconfig.test.json")

export const setup = () => {
  attest.setup({
    skipTypes: false,
    benchPercentThreshold: 10,
    tsconfig: tsconfig,
  })
}
