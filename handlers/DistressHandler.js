'use strict'
/**
 * Dependencies
 */
const cwd = process.cwd()
const path = require('path')
const firebase = require('firebase')
const BaseHandler = require(path.join(cwd, 'handlers', 'BaseHandler'))
const User = require(path.join(cwd, 'models', 'User'))

/**
 * Scope
 */
const scope = 'DistressHandler'

/**
 * DistressHandler
 */
class DistressHandler extends BaseHandler {

  static handle (event) {
    let handler = new DistressHandler(event)

    Promise
      .resolve({handler})
  }

}

/**
 * Exports
 */
module.exports = DistressHandler