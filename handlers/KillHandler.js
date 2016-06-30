'use strict'
/**
 * Dependencies
 */
const cwd = process.cwd()
const path = require('path')
const firebase = require('firebase')
const BaseHandler = require(path.join(cwd, 'handlers', 'BaseHandler'))
const Player = require(path.join(cwd, 'models', 'Player'))
const Game = require(path.join(cwd, 'models', 'Game'))
const Secret = require(path.join(cwd, 'models', 'Secret'))

/**
 * Scope
 */
const scope = 'KillHandler'

/**
 * KillHandler
 */
class KillHandler extends BaseHandler {

  static handle (event) {
    let handler = new KillHandler(event)

    Promise
      .resolve({handler})
      .then(handler.verify)
      .then(handler.kill)
      .then(handler.done)
  }

  verify (opts) {
    let {handler} = opts

    if (!handler.event || !handler.event.game) {
      return handler.error({
        scope,
        message: 'kill event must have game field'
      })
    }

    if (!handler.event || !handler.event.subject) {
      return handler.error({
        scope,
        message: 'kill event must have subject field'
      })
    }

    if (!handler.event || !handler.event.secret) {
      return handler.error({
        scope,
        message: 'kill event must have secret field'
      })
    }

    return new Promise((resolve, reject) => {
      let game = Game.get(handler.event.game)
      let killer = Player.get(handler.event.game, handler.event.subject)
      let secret = Secret.get(handler.event.secret)
      let target

      Promise.all([
        game.loaded,
        killer.loaded,
        secret.loaded
      ]).then(() => {
        if (!killer || !killer.val) {
          reject(handler.error({
            scope,
            message: `${handler.event.subject} (killer) is an invalid player`
          }))
        }

        if (killer.val.game_state !== 'zombie' && killer.val.game_state !== 'original-zombie') {
          reject(handler.error({
            scope,
            message: `${handler.event.subject} (killer) needs to be a zombie to tag a human`
          }))
        }

        if (!game || game.val.status !== 'started') {
          reject(handler.error({
            scope,
            message: `${handler.event.game} needs to have started to register a kill`
          }))
        }

        if (!secret || !secret.val) {
          reject(handler.error({
            scope,
            message: `${handler.event.secret} is an invalid secret`
          }))
        }

      }).then(() => {
        target = Player.get(handler.event.game, secret.val)
        return target.loaded
      }).then(() => {
        if (!target || !target.val) {
          reject(handler.error({
            scope,
            message: `${secret.val} (target) is an invalid player`
          }))
        }

        if (target.val.game_state !== 'human') {
          reject(handler.error({
            scope,
            message: `${secret.val} (target) needs to be human to be tagged`
          }))
        }

        resolve({
          handler,
          game,
          subject: killer,
          target
        })

      })
    })
  }

  kill (opts) {
    let {handler, game, subject, target} = opts

    return new Promise((resolve, reject) => {
      Promise.all([
        target.killedBy(subject),
        subject.kill(target)
      ]).then(() => {
        resolve(opts)
      })
    })
  }

}

/**
 * Exports
 */
module.exports = KillHandler