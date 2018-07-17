const express = require('express')
const Router = express.Router
const router = Router()
const { findUserByEmail, issueToken } = require('../middleware/auth')
const User = require('../models/user')

router.post('/login', findUserByEmail, issueToken) //these two functions are middleware

//localhost:8080/auth/signup

router.post('/signup', (req, res) => {
  const { email, password } = req.body
  const user = new User({ email, password })
  user
    .save()
    .then(doc => {
      res.status(200).json({
        message: 'success',
        payload: doc
      })
    })
    .catch(err => {
      res.status(500).json({ message: err.message })
    })
})

module.exports = router
