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
const scope = 'MarkHVTHandler'

/**
 * MarkHVTHandler
 */
class MarkHVTHandler extends BaseHandler {

  static handle (event) {
    let handler = new MarkHVTHandler(event)

    Promise
      .resolve({handler})
  }

}

/**
 * Exports
 */
module.exports = MarkHVTHandler