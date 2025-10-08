/// <reference types="vitest/config" />
import { defineConfig } from "vite"

export default defineConfig({
  test: {
    globals: false,
    globalSetup: ["vitest.setup.ts"],
    include: ["**/*.vi.{test,spec}.?(c|m)[jt]s?(x)"],
  },
})
