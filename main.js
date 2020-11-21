import * as components from './src/index.js'

const VueVocabulary = {
    install(Vue) {
    // components
    for (const componentName in components) {
      const component = components[componentName]

      Vue.component(component.name, component)
    }
  }
}

export default VueVocabulary

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(VueVocabulary)
}
