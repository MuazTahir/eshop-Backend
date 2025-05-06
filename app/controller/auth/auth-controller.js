
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const User = require('../../models/User')


//SignUp//

const SignUpUser = async (req, res) => {
    const { userName, email, password } = req.body;

    try {
        const checkUser = await User.findOne({ email })
        if (checkUser) return res.json({
            status: false,
            message: 'User already Exist!'
        })

        const hashPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            userName, email, password: hashPassword
        })

        await newUser.save();

        res.status(201).json({
            status: true,
            message: 'Account has been Created'
        })

    } catch (error) {
        console.error('SignUp error', error);
        res.status(500).json({
            status: false,
            message: "Internal server error",
            error: error.message
        })

    }
}



//Login//

const LoginUser = async (req, res) => {

    const { email, password } = req.body
    try {
        const checkUser = await User.findOne({ email })
        if (!checkUser) return res.json({
            success: false,
            message: 'Ueser is not Exist!'

        })
        const checkPassword = await bcrypt.compare(password, checkUser.password)
        if (!checkPassword) return res.json({
            success: false,
            message: 'Password is not Correct'
        })
        const token = jwt.sign({
            id: checkUser._id,
            email: checkUser.email,
            role: checkUser.role,
            user: checkUser.userName
        }, 'CLIENT_SECRET_KEY', { expiresIn: '60m' })

        res.cookie('token', token, { httpOnly: true, secure: false })
        res.status(200).json({
            success: true,
            message: 'Logged in Successfully!',
            user: {
                email: checkUser.email,
                role: checkUser.role,
                id: checkUser._id
            }
        })

    }
    catch (error) {
        console.log(error, "Login error")
        res.status(500).json({
            message: 'error',
            status: false,
            error: error.message
        })

    }
}




//logout//

const logoutUser = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: false
    }).json({
        success: true,
        message: 'Loggged out Successfully'
    })
}



//middleware//

const verify = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({
        success: false,
        message: 'Unauthraized User'
    })

    try {
        const decoded = jwt.verify(token, 'CLIENT_SECRET_KEY')
        req.user = decoded;
        next()

    } catch (error) {
        console.log(error)
        res.status(401).json({
            success: false,
            message: 'Unauthraizated User'
        })
    }
}




const getAllUsers = async (req, res) => {
    try {

        if (req.user.role !== 'admin') {
            return res.status(402).json({
                message: 'access denied',
                status: true
            })
        }

        const users = await User.find({})
        res.status(200).json({ success: true, users })

    } catch (error) {
        res.status(500).json({ message: error, success: false })
    }
}



module.exports = { SignUpUser, LoginUser, logoutUser, verify, getAllUsers }