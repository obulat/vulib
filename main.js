import * as components from './src/index'
console.log('Running main')
const ComponentLibrary = {
    install(Vue) {
    console.log('Component library')

    // components
    for (const componentName in components) {
      const component = components[componentName]

      Vue.component(component.name, component)
    }
  }
}

export default ComponentLibrary

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(ComponentLibrary)
}