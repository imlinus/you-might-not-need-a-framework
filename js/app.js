import ViewModel from './libs/viewmodel/index.js'
import store from './store/index.js'
import logo from './components/logo.js'

ViewModel.store = store

class App extends ViewModel.Component {
  components () {
    return {
      logo
    }
  }

  template (html) {
    const { name } = store.state

    return html`
      <div class="app">
        <logo></logo>
        <p>Hello, ${name}.</p>
        <button @click="hello">Hello</button>
      </div>
    `
  }

  hello () {
    const name = window.prompt('Whats your name?')
    store.dispatch('setName', name)
  }
}

ViewModel.mount(App)
