import VButton from './VButton'

import { use, registerComponent } from '../../utils/plugins'

const Plugin = {
  install(Vue) {
    registerComponent(Vue, VButton)
  }
}

use(Plugin)

export default Plugin

export {
  VButton
}
