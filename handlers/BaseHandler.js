'use strict'
/**
 * Dependencies
 */
const firebase = require('firebase')

/**
 * Scope
 */
const scope = 'BaseHandler'

/**
 * BaseHandler
 */
class BaseHandler {

  constructor (event) {
    this.event = event
  }

  static handle (event) {
    throw new Error('Handle must be implemented by BaseHandler subclass')
  }

  done (err) {
    // Check if event reference is possible
    if (!this.event || !this.event.id) {
      throw new Error('Event has an invalid id')
    }

    // Set event processed timestamp
    let update = {
      processed: new Date().valueOf(),
    }

    // If errors then append error message
    if (err) {
      update.void = true
      update.error = err.message
    }

    // Write changes to error
    return firebase.database().ref().child('events').child(this.event.id).update(error)
  }

  error (err) {
    let {scope, generic, message} = err
    let generic_string = generic ? '[GENERIC]' : ''
    console.error(`${scope}${generic_string} ${message}`)
    return this.done(err)
  }

  internalServerError (err) {
    let {scope} = err
    throw new Error(`${scope} Internal Server Error`)
  }

}

/**
 * Exports
 */
module.exports = BaseHandler
