'use strict'

/**
 * Dependencies
 */
const firebase = require('firebase')
const EventDispatcher = require('./EventDispatcher')

/**
 * Initialize Firebase App
 */
firebase.initializeApp({
  databaseURL: 'https://project-4182143701827200211.firebaseio.com',
  serviceAccount: './secret.json'
})

/**
 * Main
 */
let dispatcher = EventDispatcher.init()
