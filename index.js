'use strict'

/**
 * Dependencies
 */
const firebase = require('firebase')

/**
 * Initialize Firebase App
 */
firebase.initializeApp({
  databaseURL: 'https://project-4182143701827200211.firebaseio.com',
  serviceAccount: './secret.json'
})

/**
 * Example DB Fetch
 */
let ref = firebase.database().ref().child('games')

ref.once('value', function (data) {
  let val = data.val()
  Object.keys(val).forEach(function (key) {
    console.log('DATA', val[key])
  })
})
