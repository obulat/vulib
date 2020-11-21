import * as components from './components'

import { use } from './utils/plugins'
// eslint-disable-next-line no-unused-vars
let VueInstance
const setVueInstance = (Vue) => { VueInstance = Vue }

const VueVocabulary = {
  install(Vue) {
    setVueInstance(Vue)
    // Components
    for (let componentKey in components) {
      Vue.use(components[componentKey])
    }
  }
}

use(VueVocabulary)

export default VueVocabulary

// export all components as vue plugin
export * from './components'

// export helpers
export * from './utils/helpers'
