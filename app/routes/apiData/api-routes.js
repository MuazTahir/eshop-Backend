
const express = require('express');
// const { apiProduct } = require('../../controller/apiData/apiData-controller');
const { saveProduct, getProductByid, getAllProducts } = require('../../controller/apiData/apiData-controller')

const router = express.Router();


router.post('/apiData', saveProduct)
router.get('/apiData/:id', getProductByid)
router.get('/getAllProducts', getAllProducts)


module.exports = router