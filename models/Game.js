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
const scope = 'Game'

/**
 * Game
 */
class Game extends Model {

  static get (game) {
    if (!game) {
      return this.error({
        scope,
        message: 'game undefined'
      })
    }

    let ref = Game.getRef(game)
    return new Game(ref)
  }

  static getRef (game) {
    return firebase
      .database()
      .ref()
      .child('games')
      .child(game)
  }

  mapPlayer (player) {
    return new Promise((resolve, reject) => {
      let update = {}
      update[`players/${player.val.uid}`] = true
      this.ref.update(update, () => {
        resolve(this)
      })
    })
  }

}

/**
 * Exports
 */
module.exports = Game
