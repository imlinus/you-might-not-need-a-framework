import ViewModel from './../libs/viewmodel/index.js'

class Logo extends ViewModel.Component {
  template (html) {
    return html`
      <a href="#">
        <h1>ViewModel</h1>
      </a>
    `
  }
}

export default Logo
