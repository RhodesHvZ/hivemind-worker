'use strict'
/**
 * Dependencies
 */
const cwd = process.cwd()
const path = require('path')
const firebase = require('firebase')
const Model = require(path.join(cwd, 'models', 'Model'))
const Game = require(path.join(cwd, 'models', 'Game'))
const User = require(path.join(cwd, 'models', 'User'))

/**
 * Scope
 */
const scope = 'Player'

/**
 * Player
 */
class Player extends Model {

  static get (game, uid) {
    if (!game) {
      return this.error({
        scope,
        message: 'game undefined'
      })
    }

    if (!uid) {
      return this.error({
        scope,
        message: 'uid undefined'
      })
    }

    let ref = Player.getRef(game, uid)
    return new Player(ref)
  }

  static getRef (game, uid) {
    return firebase
      .database()
      .ref()
      .child('players')
      .child(game)
      .child(uid)
  }

  * newSecret () {
    crypto.randomBytes(3, (err, buf) => { 
      yield buf.toString('hex').toUpperCase())
    })
  }

  create (opts) {
    return this.ref.set(opts)
  }

  get game () {
    return new Promise((resolve, reject) => {
      this.loaded.then(() => {
        resolve(Game.get(this.val.game))
      })
    })
  }

  get user () {
    return new Promise((resolve, reject) => {
      this.loaded.then(() => {
        resolve(User.get(this.val.uid))
      })
    })
  }

}

/**
 * Exports
 */
module.exports = Player
