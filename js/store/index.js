import Store from './../libs/store/index.js'

import actions from './actions.js'
import mutations from './mutations.js'
import state from './state.js'

const store = new Store({
  actions,
  mutations,
  state
})

export default store
