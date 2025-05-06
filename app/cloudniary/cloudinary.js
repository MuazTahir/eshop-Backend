
const cloudinay = require('cloudinary').v2
const multer = require('multer');

cloudinay.config({
    cloud_name: 'dihustbpx',
    api_key: '864224625735925',
    api_secret: 'j3TpXlrM9tnRDBmsgx-gg3kyJ6U'
})

const storage = new multer.memoryStorage();

async function ImageUploderUtil(file) {
    const result = await cloudinay.uploader.upload(file, {
        resource_type: 'auto'
    })

    return result;
}

const upload = multer({ storage })

module.exports = { upload, ImageUploderUtil }