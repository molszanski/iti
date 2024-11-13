/// <reference types="vitest/config" />
import { defineConfig } from "vite"

export default defineConfig({
  test: {
    globals: false,
    include: ["**/*.vi.{test,spec}.?(c|m)[jt]s?(x)"],
  },
})
