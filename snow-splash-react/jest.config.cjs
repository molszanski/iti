/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
/** @type {import('@types/jest')} */
module.exports = {
  preset: "ts-jest/presets/js-with-ts-esm",
  testEnvironment: "jsdom",
  testTimeout: 500,
}
