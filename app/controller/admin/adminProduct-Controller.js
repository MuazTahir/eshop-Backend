const { ImageUploderUtil } = require("../../cloudniary/cloudinary");
const Products = require("../../models/AdminProducts");


const handleUploadImage = async (req, res) => {
    try {

        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const url = 'data:' + req.file.mimetype + ";base64," + b64
        const result = await ImageUploderUtil(url)
        res.json({
            success: true,
            result
        })

    } catch {
        console.log(error);
        res.json({
            success: false,
            message: 'Error Occurred'
        })
    }
}

//add a product

const addProducts = async (req, res) => {
    try {
        const {
            image,
            title,
            description,
            category,
            brand, price,
            salePrice,
            totalStock
        } = req.body;

        const newlyaddProducts = new Products({
            image,
            title,
            description,
            category,
            brand, price,
            salePrice,
            totalStock
        })

        await newlyaddProducts.save();
        res.status(201).json({
            success: true,
            message: 'Product is Created!',
            data: newlyaddProducts
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Error Has Occurred!'
        })
    }
}

//fetch all Product
const fetchAllProducts = async (req, res) => {
    try {
        const listOfProducts = await Products.find({});

        res.status(200).json({
            success: true,
            data: listOfProducts
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Error Has Occurred!'
        })
    }
}

//edit a product
const editProducts = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            image,
            title,
            description,
            category,
            brand, price,
            salePrice,
            totalStock
        } = req.body;

        let findProducts = await Products.findById(id);
        if (!findProducts)
            return res.status(404).json({
                success: false,
                message: 'Product Not Found'
            })

        findProducts.title = title || findProducts.title
        findProducts.image = image || findProducts.image
        findProducts.description = description || findProducts.description
        findProducts.category = category || findProducts.category
        findProducts.brand = brand || findProducts.brand
        findProducts.price = price === 0 ? '' : price
        findProducts.salePrice = salePrice === 0 ? '' : salePrice
        findProducts.totalStock = totalStock || findProducts.totalStock

        await findProducts.save();
        res.status(200).json({
            success: true,
            data: findProducts
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Error Has Occurred!'
        })
    }
}

//delete a product
const deleteProducts = async (req, res) => {
    try {

        const { id } = req.params;

        const product = await Products.findByIdAndDelete(id);
        if (!product)
            return res.status(404).json({
                success: false,
                message: 'Product Not Found'
            })

        res.status(200).json({
            success: true,
            message: 'Product Deleted Successfully!'
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Error Has Occurred!'
        })
    }
}

module.exports = { handleUploadImage, addProducts, fetchAllProducts, editProducts, deleteProducts }