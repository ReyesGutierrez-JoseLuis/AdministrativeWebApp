const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')

var Cli = require('../models/employee.model.js');

const Story = require('../models/Story')

// @desc    Login/Landing page
// @route   GET /
router.get('/', ensureGuest, (req, res) => {
  res.render('login', {
    layout: 'login',
  })
})

// @desc    Dashboard
// @route   GET /dashboard
router.get('/employee', ensureAuth, async (req, res) => {
  try {
   
    res.render('employee/addOrEdit', {
     
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

module.exports = router
