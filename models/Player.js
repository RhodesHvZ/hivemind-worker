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
 * 1 minute (DateTime)
 */
const minute = 1000*60

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
    console.log('REF', ref.key)
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

  revive () {
    if (this.game_state === 'zombie' 
      && this.val.killed 
      && this.val.killed + minute*30 > new Date() // Within 30 mins of kill
    ) {
      let revive_count = this.val.revive_count + 1 || 1
      return this.update({
        revive_count,
        game_state: 'human'
      })
    } else if (this.val.game_state === 'human') {
      return this.update({
        revive_pending: true
      })
    }  else {
      throw new Error(`Too late to revive ${this.val.uid}`)
    }
  }

  killedBy (killer) {
    let now = new Date().valueOf()
    let update = {
      game_state: 'zombie',
      'killed_by/' + killer.val.uid: now
      killed: now
    }
    
    if (this.val.revive_pending) {
      update.revive_pending = false
      update.game_state = 'human'
      update.revive_count = this.val.revive_count + 1 || 1
    }

    return this.update(update)
  }

  kill (target) {
    let points = this.val.zombie_points || 0
    let kills = this.val.kills || 0
    let target_hvt_until = target.val.hvt_until || new Date()
    let worth = target.val.worth || 1
    let now = new Date()

    if (now < target_hvt_until) {
      worth = target.val.hvt_worth || target.val.worth || 1
    }

    points += worth
    kills += 1

    return this.update({
      kills,
      zombie_points: points
    })
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
