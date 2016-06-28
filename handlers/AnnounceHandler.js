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
const scope = 'AnnounceHandler'

/**
 * AnnounceHandler
 */
class AnnounceHandler extends BaseHandler {

  static handle (event) {
    let handler = new AnnounceHandler(event)

    Promise
      .resolve({handler})
  }

}

/**
 * Exports
 */
module.exports = AnnounceHandler