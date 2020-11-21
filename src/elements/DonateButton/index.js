import DonateButton from './DonateButton'

import { use, registerComponent } from '../../utils/plugins'

const Plugin = {
  install(Vue) {
    registerComponent(Vue, DonateButton)
  }
}

use(Plugin)

export default Plugin

export {
  DonateButton
}
