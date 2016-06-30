'use strict'
/**
 * Dependencies
 */
const firebase = require('firebase')
const cwd = process.cwd()
const path = require('path')
const Logger = require('./Logger')
const handlers = {
  kill: require(path.join(cwd, 'handlers', 'KillHandler')),
  revive: require(path.join(cwd, 'handlers', 'ReviveHandler')),
  redeem: require(path.join(cwd, 'handlers', 'RedeemHandler')),
  ticket: require(path.join(cwd, 'handlers', 'TicketHandler')),
  mark_hvt: require(path.join(cwd, 'handlers', 'MarkHVTHandler')),
  distress: require(path.join(cwd, 'handlers', 'DistressHandler')),
  horde: require(path.join(cwd, 'handlers', 'HordeHandler')),
  announce: require(path.join(cwd, 'handlers', 'AnnounceHandler')),
  register: require(path.join(cwd, 'handlers', 'RegisterHandler')),
}

/**
 * Scope
 */
const scope = 'EventDispatcher'

/**
 * EventDispatcher
 */
class EventDispatcher {

  static getRef (event) {
    return firebase
      .database()
      .ref()
      .child('events')
      .child(event)
  }

  static init () {
    let dispatcher = new EventDispatcher()
    firebase.database().ref().child('events').orderByChild('processed').endAt(null)
      .on('child_added', function (snapshot) {
        let event = snapshot.val()
        console.log(event.id)
        if (!event.processed) {
          dispatcher.dispatch(event)
        }
      })
    return dispatcher
  }

  dispatch (event) {
    if (handlers[event.type]) {
      handlers[event.type].handle(event)
    } else {
      this.unrecognised({event})
    }
  }

  error (err) {
    let {scope, message, generic} = err
    let generic_string = generic ? '[GENERIC]' : ''
    console.error(`[${scope}]${generic_string} ${message}`)
  }

  unrecognised (err) {
    let {event} = err
    if (event && event.id && event.type) {
      return error({
        scope,
        message: `Event ${event.type} (${event.id}) unrecognised`
      })
    } else {
      return error({
        scope,
        generic: true,
        message: 'Event unrecognised'
      })
    }
  }

}

/**
 * Exports
 */
module.exports = EventDispatcher