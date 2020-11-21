import { config } from 'storybook-addon-designs'

export const figmaConfig = (nodeId) => config({
  type: 'figma',
  url: `https://www.figma.com/file/l4Mt3dn3Ndtrvrb4aLcwXI/Design-Library?node-id=${nodeId}`
})

/**
 * Merge function to replace Object.assign with deep merging possibility
 */
const isObject = (item) => typeof item === 'object' && !Array.isArray(item)
const mergeFn = (target, source, deep = false) => {
  if (deep || !Object.assign) {
    const isDeep = (prop) =>
      isObject(source[prop]) &&
      target !== null &&
      // eslint-disable-next-line no-prototype-builtins
      target.hasOwnProperty(prop) &&
      isObject(target[prop])
    const replaced = Object.getOwnPropertyNames(source)
      .map((prop) => ({ [prop]: isDeep(prop)
          ? mergeFn(target[prop], source[prop], deep)
          : source[prop] }))
      .reduce((a, b) => ({ ...a, ...b }), {})

    return {
      ...target,
      ...replaced
    }
  } else {
    return Object.assign(target, source)
  }
}
export const merge = mergeFn
