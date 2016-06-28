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
const scope = 'HordeHandler'

/**
 * HordeHandler
 */
class HordeHandler extends BaseHandler {

  static handle (event) {
    let handler = new HordeHandler(event)

    Promise
      .resolve({handler})
  }

}

/**
 * Exports
 */
module.exports = HordeHandler