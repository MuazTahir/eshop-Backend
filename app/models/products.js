
const mongoose = require('mongoose')

const ProductsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true,
        trim: true
    },
    model: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['audio', 'video', 'mobile', 'laptop', 'accessory'] // optional: limit allowed categories
    },
    discount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})

const Products = mongoose.model('Products', ProductsSchema)
module.exports = Products