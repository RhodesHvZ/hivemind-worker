'use strict'
/**
 * Dependencies
 */
const cwd = process.cwd()
const path = require('path')
const firebase = require('firebase')
const BaseHandler = require(path.join(cwd, 'handlers', 'BaseHandler'))
const User = require(path.join(cwd, 'models', 'User'))
const Game = require(path.join(cwd, 'models', 'Game'))
const Player = require(path.join(cwd, 'models', 'Player'))
const Secret = require(path.join(cwd, 'models', 'Secret'))

/**
 * Scope
 */
const scope = 'RegisterHandler'

/**
 * RegisterHandler
 */
class RegisterHandler extends BaseHandler {

  static handle (event) {
    let handler = new RegisterHandler(event)

    Promise
      .resolve({handler})
      .then(handler.validate)
      .then(handler.registerPlayer)
      .then(handler.mapGamePlayer)
      .then(handler.done)
      .catch(function (err) {
        handler.internalServerError({
          scope,
          err
        })
      })
  }
    
  validate (opts) {
    let {handler} = opts

    if (!handler.event || !handler.event.subject || !handler.event.game) {
      return handler.error({
        scope,
        message: 'registration event must have subject and game fields'
      })
    }

    return new Promise ((resolve, reject) => {
      let game = Game.get(handler.event.game)
      let user = User.get(handler.event.subject)

      Promise.all([
        game.loaded,
        user.loaded
      ]).then(() => {
        if (!game || !game.val) {
          reject(handler.error({
            scope,
            message: `${handler.event.game} is an invalid game`
          }))
        }

        if (!user || !user.val) {
          reject(handler.error({
            scope,
            message: `${handler.event.subject} is an invalid user`
          }))
        }

        if (game.val.status !== 'registration') {
          reject(handler.error({
            scope,
            message: `${game.name} is not open for registration`
          }))
        }

        resolve({
          handler,
          game,
          user
        })
      })
    })
  }

  registerPlayer (opts) {
    let {handler, game, user} = opts
    let player = Player.get(game.val.name, user.val.uid)
    let secret

    return new Promise((resolve, reject) => {
      return new Promise((resolve, reject) => {
          Secret.registerSecret(user.val.uid).then((s) => {
            secret = s
            return secret.loaded
          }).then(() => {
            resolve() // resolve registerSecret
          })

        }).then(() => {
          return player.create({
            game: game.val.name,
            uid: user.val.uid,
            display_name: user.val.username,
            picture: user.val.picture,
            game_state: 'human',
            secret: secret.snapshot.key
          })
        }).then(() => {
          resolve({
            handler,
            game,
            user,
            player: player,
            secret: secret
          }) // Resolve registerPlayer
        }).catch((err) => {
          if (err) throw err
          reject(handler.error({
            scope,
            message: `Could not create player ${user.val.uid} in game ${game.val.name}`
          }))
        })
    })
  }

  mapGamePlayer (opts) {
    let {handler, game, player} = opts

    return new Promise((resolve, reject) => {
      player.loaded.then(() => {
        return game.mapPlayer(player)
          .then(() => {
            resolve(opts) // resolve mapGamePlayer
          }).catch((err) => {
            return handler.error({
              scope,
              message: `Could not map player to game`
            })
          })
      })
    })
  }

}

/**
 * Exports
 */
module.exports = RegisterHandler
