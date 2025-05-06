const orderSchema = require("../../models/orderSchema")

const orderShow = async (req, res) => {
    try {
        const orderShowCase = await orderSchema.find({})
        if (!orderShowCase || orderShowCase === 0) {
            return res.status(404).json({ message: 'Orders not found' })
        }

        res.status(200).json({ success: true, orderShowCase })
    } catch (error) {
        res.status(500).json({
            message: 'server error',
            success: false
        })
    }
}

module.exports = { orderShow }