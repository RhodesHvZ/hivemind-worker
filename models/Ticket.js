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
const scope = 'Ticket'

/**
 * Ticket
 */
class Ticket extends Model {

  static get (game, ticket) {
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

    let ref = Ticket.getRef(game, ticket)
    return new Ticket(ref)
  }

  static getRef (game, ticket) {
    return firebase
      .database()
      .ref()
      .child('tickets')
      .child(game)
      .child('ticket_metadata')
      .child(ticket)
  }

  create (opts) {
    return this.ref.set(opts)
  }

  pushRef () {
    return firebase
      .database()
      .ref()
      .child('tickets')
      .child(this.val.game)
      .child('ticket_messages')
      .child(this.val.id)
      .push()
  }

  pushMessage (uid, message) {
    let ref = this.pushRef()
    let key = ref.key
    return ref.set({
      uid,
      message,
      timestamp: new Date().valueOf()
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
        resolve(User.get(this.val.owner))
      })
    })
  }

}

/**
 * Exports
 */
module.exports = Ticket
