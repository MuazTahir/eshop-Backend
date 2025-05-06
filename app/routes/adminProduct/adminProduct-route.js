
const express = require('express');
const { handleUploadImage, addProducts, editProducts, deleteProducts, fetchAllProducts } = require('../../controller/admin/adminProduct-Controller');

const { upload } = require('../../cloudniary/cloudinary')

const router = express.Router();

router.post('/upload-image', upload.single('my_file'), handleUploadImage)
router.post('/add', addProducts)
router.put('/edit/:id', editProducts)
router.delete('/delete/:id', deleteProducts)
router.get('/get', fetchAllProducts)

module.exports = router;