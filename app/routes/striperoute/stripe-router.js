
const express = require('express');
const { stripeCheckout, webhook } = require('../../controller/stripe/stripeController');
const route = express.Router()

route.post('/create-checkout-session', stripeCheckout);
route.post('/webhook', webhook)

module.exports = route;