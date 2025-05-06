
const express = require('express')
const { showUsers, getUserCount } = require('../../controller/Users/users-controller')

const router = express.Router()

router.get('/users', showUsers)
router.get('/userCount', getUserCount)


module.exports = router