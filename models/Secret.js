'use strict'
/**
 * Dependencies
 */
const cwd = process.cwd()
const path = require('path')
const firebase = require('firebase')
const Model = require(path.join(cwd, 'models', 'Model'))

/**
 * Scope
 */
const scope = 'Secret'

/**
 * Secret
 */
class Secret extends Model {

  static get (secret) {
    if (!secret) {
      return this.error({
        scope,
        message: 'secret undefined'
      })
    }

    let ref = Secret.getRef(secret)
    return new Secret(ref)
  }

  static getRef (secret) {
    return firebase
      .database()
      .ref()
      .child('secrets')
      .child(secret)
  }

  static create (val) {
    let secret = Secret.newSecret()
    let ref = Secret.getRef(secret)
    return new Promise((resolve, reject) => {
      ref.set(val).then(() => {
        resolve(Secret.get(secret))
      })
    }
  }

  static * newSecret () {
    crypto.randomBytes(3, (err, buf) => { 
      yield buf.toString('hex').toUpperCase())
    })
  }

  get uid () {
    return new Promise((resolve, reject) => {
      this.loaded.then(() => {
        resolve(this.val)
      })
    })
  }

}

/**
 * Exports
 */
module.exports = Secret
