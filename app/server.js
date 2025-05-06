
const cookieParser = require("cookie-parser")
const express = require("express")
const mongoose = require("mongoose")
const cors = require('cors')
require('dotenv').config()



const authRouter = require('./routes/auth/auth-routes')
const productRouter = require('./routes/apiData/api-routes')
const stripeRouter = require('./routes/striperoute/stripe-router')
const usersRouter = require('./routes/Users/users-routes')
const orderReducer = require('./routes/Order/orders-route')
const adminProductRoute = require('./routes/adminProduct/adminProduct-route')




mongoose.connect('mongodb+srv://muaztahir342:muaz3342@cluster11.b5vui50.mongodb.net/')
    .then(() => console.log('MongoDB Connected'))
    .catch((error) => console.log('Mongoose connectiong error', error))

const app = express()

const PORT = process.env.PORT || 6000

app.get('/api/ping', (req, res) => {
    res.send('pong from vercel');
});


app.use(
    cors(
        {
            origin: ['CLIENT_URL', 'http://192.168.100.230:3000'],
            methods: ['GET', 'POST', 'DELETE', 'PUT'],
            allowedHeaders: [
                'Content-Type',
                'Authorization',
                'Cache-Control',
                'Pragma'
            ],
            credentials: true
        }
    )
)

app.use(cookieParser())
app.use('/api/webhook', express.raw({ type: 'application/json' }));
app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/admin', adminProductRoute)
app.use('/api', productRouter)
app.use('/api', stripeRouter)
app.use('/api', usersRouter)
app.use('/api', orderReducer)


app.listen(PORT, () => console.log(`Server is now running on PORT ${PORT}`))
// module.exports = app;