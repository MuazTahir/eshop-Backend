const express = require('express');  // ✅ Correct usage
const { SignUpUser, LoginUser, logoutUser, verify, getAllUsers } = require('../../controller/auth/auth-controller');



const router = express.Router();


router.post('/SignUp', SignUpUser);
router.post('/Login', LoginUser)
router.post('/logout', logoutUser)
router.get('/adminUser', getAllUsers)
router.get('/check-auth', verify, (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Authanticated User',
        user: req.user

    })
})

module.exports = router;