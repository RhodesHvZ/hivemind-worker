'use strict'
/**
 * Dependencies
 */

/**
 * Exports
 */
module.exports = function (event) {
  let now = new Date()
  console.log(`[${now.getFullYear()}:${now.getMonth()+1}:${now.getDate()+1}:${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}] HANDLE ${event.type} ${event.id} ${event.subject}`)
  return now
}
