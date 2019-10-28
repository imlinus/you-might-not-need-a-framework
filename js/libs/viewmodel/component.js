import ViewModel from './index.js'

class Component {
  constructor (el) {
    const { components, template, mounted } = this.__proto__

    this.$name = this.constructor.name.split(/(?=[A-Z])/).join('-').toLowerCase()
    this.$parent = (el && el instanceof HTMLElement ? el : el = document.body)

    if (!template) throw new Error('You need a template, bruh')
    this.$template = this.html(template(this.values).flat(Infinity).join(''))

    if (components) {
      let data = components()
      let obj = {}

      Object.keys(data).forEach(key => {
        const kebab = key.split(/(?=[A-Z])/).join('-').toLowerCase()
        obj[kebab] = data[key]
      })

      this.$components = obj
    }

    this.nodes()
    this.render()
    this.replaceComponents(this.$template)

    if (ViewModel.store) {
      ViewModel.store.events.on('stateChange', () => {
        this.$template = this.html(template(this.values).flat(Infinity).join(''))
        this.nodes()
        this.render()
        this.replaceComponents(this.$template)
      })
    }

    if (mounted) mounted()
  }

  values (strings, ...values) {
    return strings.flatMap(str => {
      return [str].concat(values.shift())
    })
  }

  html (html) {
    if (!html) return
    const el = document.createElement('html')
    el.innerHTML = html.trim()
    return el.children[1].firstChild
  }

  render (el) {
    this.$parent.innerHTML = ''

    if (document.body.contains(this.$parent)) {
      this.$parent.localName === 'body'
        ? this.$parent.appendChild(this.$template)
        : this.$parent.parentNode.replaceChild(this.$template, this.$parent)
    }
  }
  
  nodes () {
    this.$template.parentNode.querySelectorAll('*')
      .forEach(node => this.checkAttrs(node.attributes))
  }

  replaceComponents (node) {
    if (!node) return

    node.childNodes.forEach(child => {
      if (
        child.nodeType === 1 &&
        this.$components &&
        this.$components.hasOwnProperty(child.localName)
      ) {
        new this.$components[child.localName](child)
      }
    })
  }

  checkAttrs (attrs) {
    return Object.values(attrs).reduce((n, attr) => {
      const data = { el: attr.ownerElement, key: attr.nodeValue, exp: attr.nodeName }
      const { el, key, exp } = data

      if (/@/.test(exp)) return this.on(el, key, exp)
    }, [])
  }

  on (el, key, exp) {
    const evt = exp.substr(1)

    el.addEventListener(evt, () => {
      if (this.__proto__[key]) this.__proto__[key](event)
    })
  }
}

export default Component
