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
      ref.on('value', this.update, reject)
      ref.once('value', (snapshot) => { resolve(this) }, reject)
    })
  }

  update (snapshot) {
    this.$$snapshot = snapshot
    this.$$val = snapshot.val()
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
