// export { createContainer, RootContainer } from "./library.root-container"
export type { GetContainerFormat, UnPromisify } from "./_utils"

// React
export { generateEnsureItems } from "./react/library.generate-ensure-hooks.js"
export { getContainerHooks } from "./react/library.hook-generator.js"

/**
 * @deprecated use `generateEnsureItems` instead
 */
export { generateEnsureItems as generateEnsureContainerSet } from "./react/library.generate-ensure-hooks.js"
/**
 * @deprecated use `getContainerHooks` instead
 */
export { getContainerHooks as getContainerSetHooks } from "./react/library.hook-generator.js"
