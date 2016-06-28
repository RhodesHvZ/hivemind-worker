'use strict'
/**
 * Dependencies
 */
const firebase = require('firebase')
const cwd = process.cwd()
const path = require('path')
const Logger = require('../Logger')
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

  constructor () {
    firebase.database().ref().child('events').on('child_added')
    .then(function (snapshot) {
      let event = snapshot.val()
      if (!event.processed) {
        this.dispatch(event)
      }
    })
  }

  dispatch (event) {
    if (handlers[event.type]) {
      new handlers[event.type].handle(event).then(function () {
        Logger(event)
        this.postHandle(event)
      }).catch(function (err) {
        this.postHandle(event, err)
      })
    } else {
      this.unrecognised({event})
    }
  }

  postHandle (event, err) {
    // Mark event as processed
    let update = {
      processed: new Date().valueOf()
    }

    // If err then mark event as void
    if (err) {
      console.error(err.stack || err)
      update.void = true,
      update.error = err.message || err
    }

    // Do update
    EventDispatcher.getRef(event.id).update(update)
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