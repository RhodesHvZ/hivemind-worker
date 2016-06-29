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
      .catch(handler.internalServerError({
        scope
      }))
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
      return Promise.all([
        Game.get(handler.event.game),
        User.get(handler.event.subject)
      ]).then((game, user) => {
        if (!game) {
          return handler.error({
            scope,
            message: `${handler.event.game} is an invalid game`
          })
        }

        if (!user) {
          return handler.error({
            scope,
            message: `${handler.event.subject} is an invalid user`
          })
        }

        if (game.status !== 'registration') {
          return handler.error({
            scope,
            message: `${game.name} is not open for registration`
          })
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

    return new Promise((resolve, reject) => {
      return Player.get(handler.game.name, handler.user.uid).loaded
        .then((player) => {
          return new Promise((resolve, reject) => {
            Secret.create(player.uid)
              .then((secret) => {
                resolve({
                  secret,
                  player
                })
              })
          })
        })
        .then((opts) => {
          let {secret, player} = opts
          return player.create({
            game: game_name,
            uid: subject,
            display_name: user.username,
            picture: user.picture,
            game_state: 'human',
            secret: player.newSecret()
          })
        }).then(() => {
          resolve({
            handler,
            game,
            user,
            player
          })
        }).catch((err) => {
          return handler.error({
            scope,
            message: `Could not create player ${user.uid} in game ${game.name}`
          })
        })
    })
  }

  mapGamePlayer (opts) {
    let {handler, game, player} = opts

    return new Promise((resolve, reject) => {
      return game.mapPlayer(player)
        .then(() => {
          resolve(opts)
        }).catch((err) => {
          return handler.error({
            scope,
            message: `Could not map player to game`
          })
        })
    })
  }

}

/**
 * Exports
 */
module.exports = RegisterHandler
