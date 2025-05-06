const Stripe = require('stripe')
require('dotenv').config()
const Order = require('../../models/orderSchema')

const stripe = Stripe(process.env.STRIPE_KEY)
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const stripeCheckout = async (req, res) => {
    const { cartItems, userId } = req.body
    // console.log('cartItem are: ', cartItems)

    try {
        const newOrder = await Order.create({
            userId,
            cartItems

        })

        // 2. Create customer
        const customer = await stripe.customers.create({
            metadata: {
                userId,
                orderId: newOrder._id.toString(), // small & useful
            }
        })


        const session = await stripe.checkout.sessions.create({

            payment_method_types: ['card'],
            mode: 'payment',
            shipping_address_collection: {
                allowed_countries: ['US', 'CA', 'PK'], // customize as needed
            },
            shipping_options: [
                {
                    shipping_rate_data: {
                        type: 'fixed_amount',
                        fixed_amount: {
                            amount: 500, // $5.00 in cents
                            currency: 'usd',
                        },
                        display_name: 'Standard Shipping',
                        delivery_estimate: {
                            minimum: { unit: 'business_day', value: 3 },
                            maximum: { unit: 'business_day', value: 5 },
                        },
                    },
                },
            ],
            customer: customer.id,
            line_items: cartItems.map(item => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.model,

                    },
                    unit_amount: item.price * 100, // Stripe expects cents
                },
                quantity: item.cartQuantity,
            })),
            metadata: {
                userId: userId,
            },
            success_url: `${process.env.CLIENT_URL}/checkout-success`,
            cancel_url: `${process.env.CLIENT_URL}/cart`,
        })

        res.send({ url: session.url })
    } catch (err) {
        console.log('Stripe Checkout Error:', err)
        res.status(500).json({ error: err.message })
    }
}

// CLI//

// Raw body middleware for webhook (important!)
// const bodyParser = require('body-parser');
// router.use(bodyParser.raw({ type: 'application/json' }));



const webhook = (req, res) => {
    const sig = req.headers['stripe-signature'];
    let data;
    let eventType;

    try {
        const event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        data = event.data.object;
        eventType = event.type;
    } catch (err) {
        console.error('⚠️ Webhook signature verification failed.', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (eventType === 'checkout.session.completed') {
        stripe.customers.retrieve(data.customer)
            .then(async (customer) => {
                const orderId = customer.metadata.orderId;
                const order = await Order.findById(orderId);

                if (order) {
                    order.status = 'paid';
                    order.paymentIntentId = data.payment_intent;
                    order.paymentStatus = data.payment_status;
                    order.paymentMethod = data.payment_method_types?.[0] || 'card';
                    order.totalAmount = data.amount_total / 100;

                    await order.save();
                    console.log('✅ Order marked as paid and updated:', order);
                } else {
                    console.log('❌ Order not found for orderId:', orderId);
                }
            })
            .catch((error) => console.log('❌ Stripe customer retrieval error:', error));
    }

    res.send().end();
};




module.exports = { stripeCheckout, webhook }
