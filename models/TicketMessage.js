'use strict'
/**
 * Dependencies
 */
const cwd = process.cwd()
const path = require('path')
const firebase = require('firebase')
const Model = require(path.join(cwd, 'models', 'Model'))
const Ticket = require(path.join(cwd, 'models', 'Ticket'))
const Game = require(path.join(cwd, 'models', 'Game'))
const User = require(path.join(cwd, 'models', 'User'))

/**
 * Scope
 */
const scope = 'TicketMessage'

/**
 * TicketMessage
 */
class TicketMessage extends Model {

  static get (game, ticket, message) {
    if (!game) {
      return this.error({
        scope,
        message: 'game undefined'
      })
    }

    if (!ticket) {
      return this.error({
        scope,
        message: 'ticket id undefined'
      })
    }

    if (!message) {
      return this.error({
        scope,
        message: 'message id undefined'
      })
    }    

    let ref = TicketMessage.getRef(game, ticket, message)
    return new TicketMessage(ref)
  }

  static getRef (game, ticket, message) {
    return firebase
      .database()
      .ref()
      .child('tickets')
      .child(game)
      .child('ticket_messages')
      .child(ticket)
      .child(message)
  }

  get ticket () {
    return new Promise((resolve, reject) => {
      this.loaded.then(() => {
        resolve(Game.get(this.val.ticket))
      })
    })
  }

  get game () {
    return new Promise((resolve, reject) => {
      this.loaded.then(() => {
        resolve(Game.get(this.val.game))
      })
    })
  }

  get owner () {
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
module.exports = TicketMessage
