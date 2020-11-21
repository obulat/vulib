import SlotRenderer from './SlotRenderer'

import { use, registerComponent } from '../../utils/plugins'

const Plugin = {
  install(Vue) {
    registerComponent(Vue, SlotRenderer)
  }
}

use(Plugin)

export default Plugin

export {
  SlotRenderer
}
