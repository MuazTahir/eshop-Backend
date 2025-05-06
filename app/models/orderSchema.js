const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  userId: String,
  cartItems: Array,
  totalAmount: Number,
  paymentIntentId: String,
  paymentStatus: String,
  paymentMethod: String,
  status: { type: String, default: 'pending' }, // pending → paid
}, { timestamps: true })

module.exports = mongoose.model('Order', orderSchema)
