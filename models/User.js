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
const scope = 'User'

/**
 * User
 */
class User extends Model {

  static get (uid) {
    if (!uid) {
      return this.error({
        scope,
        message: 'user id undefined'
      })
    }

    let ref = User.getRef(uid)
    return new User(ref)
  }

  static getRef (uid) {
    return firebase
      .database()
      .ref()
      .child('users')
      .child(uid)
  }

}

/**
 * Exports
 */
module.exports = User
