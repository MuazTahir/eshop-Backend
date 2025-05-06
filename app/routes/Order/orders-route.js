
const express = require('express')
const { orderShow } = require('../../controller/Orders/order-controller')

const router = express.Router()

router.get('/orders', orderShow)

module.exports = router