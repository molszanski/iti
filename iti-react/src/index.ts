// export { createContainer, RootContainer } from "./library.root-container"
export type { GetContainerFormat, UnPromisify } from "./_utils"

// React
export { generateEnsureItemSet } from "./react/library.generate-ensure-hooks.js"
export { getItemSetHooks } from "./react/library.hook-generator.js"

/**
 * @deprecated use `generateEnsureItemSet` instead
 */
export { generateEnsureItemSet as generateEnsureContainerSet } from "./react/library.generate-ensure-hooks.js"
/**
 * @deprecated use `getItemSetHooks` instead
 */
export { getItemSetHooks as getContainerSetHooks } from "./react/library.hook-generator.js"
