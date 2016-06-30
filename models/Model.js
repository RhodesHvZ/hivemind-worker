'use strict'
/**
 * Dependencies
 */

/**
 * Model
 */
class Model {

  static get (...args) {
    throw new Error('Get must be implemented by Model subclass')
  }

  static getRef (...args) {
    throw new Error('Get must be implemented by Model subclass')
  }

  constructor (ref) {
    this.$$ref = ref
    this.$$val = null
    this.$$loaded = new Promise((resolve, reject) => {
      this.ref.on('value', (snapshot) => { this.updateValue(snapshot) }, reject)
      this.ref.once('value', (snapshot) => { resolve(this) }, reject)
    })
  }

  updateValue (snapshot) {
    this.$$snapshot = snapshot
    this.$$val = snapshot.val()
  }

  create (opts) {
    return this.ref.set(opts)
  }

  update (opts) {
    return this.ref.update(opts)
  }

  get ref () {
    return this.$$ref
  }

  get loaded () {
    return this.$$loaded
  }

  get val () {
    return this.$$val
  }

  get snapshot () {
    return this.$$snapshot
  }

  error (err) {
    let {scope, generic, message} = err
    let generic_string = generic ? '[GENERIC]' : ''
    console.error(`${scope}${generic_string} ${message}`)
  }

}

/**
 * Exports
 */
module.exports = Model
