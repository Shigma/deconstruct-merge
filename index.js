const flatten = require('array-flatten')

module.exports = class Mergeable {
  constructor (options) {
    this._options = options
    if (options === 'assign') {
      this._value = {}
      this._merge = function (value) {
        Object.assign(this._value, value)
      }
    } else if (options === 'array' || options === 'flat') {
      this._value = []
      this._merge = function (value) {
        if (value === undefined) return
        this._value.push(value)
      }
    } else if (typeof options === 'function') {
      this._merge = function (value) {
        this._value = options(value, this._value)
      }
    } else if (Array.isArray(options)) {
      this._value = options.map(option => new Mergeable(option))
      this._merge = function (value) {
        if (!Array.isArray(value)) return
        this._value.forEach((item, index) => item.merge(value[index]))
      }
    } else if (options && typeof options === 'object') {
      this._value = {}
      for (const key in this._options) {
        this._value[key] = new Mergeable(this._options[key])
      }
      this._merge = function (value) {
        if (!value || typeof value !== 'object') return
        for (const key in options) {
          this._value[key].merge(value[key])
        }
      }
    } else {
      this._merge = function (value) {
        this._value = value
      }
    }
  }

  merge (value) {
    this._merge(value)
    return this
  }

  value () {
    if (this._options === 'flat') {
      return flatten(this._value)
    } else if (Array.isArray(this._options)) {
      return this._value.map(item => item.value())
    } else if (this._options && typeof this._options === 'object') {
      const value = {}
      for (const key in this._options) {
        value[key] = this._value[key].value()
      }
      return value
    } else {
      return this._value
    }
  }
}
