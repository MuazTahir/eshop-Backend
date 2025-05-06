
const mongoose = require('mongoose')
const products = require('../../models/products')
const axios = require('axios');

// POST /api/apiData
const saveProduct = async (req, res) => {
    try {
        const { title, image, price, brand, description, model, category, color } = req.body

        // Optional: Check if already exists
        const exists = await products.findOne({ title, price })
        if (exists) {
            return res.status(400).json({ message: 'Product already exists' })
        }

        const newProduct = new products({ title, image, price, brand, description, model, category, color })
        await newProduct.save()
        console.log('Saved Product:', newProduct); // Log the saved product

        res.status(201).json({ message: 'Product saved successfully', product: newProduct })
    } catch (error) {
        console.error('Error saving product:', error.message)
        res.status(500).json({ message: 'Server error' })
    }
}

// get all product form mongoose


const getAllProducts = async (req, res) => {
    try {
        let allProducts = await products.find();

        if (allProducts.length === 0) {
            // Fetch from FakeStoreAPI if DB is empty
            const response = await axios.get('https://fakestoreapi.in/api/products');
            const apiProducts = response.data.products;

            // Optional: Transform data to match your schema
            const formattedProducts = apiProducts.map(p => ({
                title: p.title,
                image: p.image || p.images?.[0],
                price: p.price,
                description: p.description || "No description",
                brand: p.brand || "Unknown",
                model: p.model || "Standard",
                color: p.color || "Black",
                category: "accessory", // or map from p.category
                discount: p.discount || 0,
            }));

            // Insert into MongoDB
            await products.insertMany(formattedProducts);

            allProducts = await products.find(); // re-fetch after insert
            console.log("Inserted fake products into DB");
        }

        res.json(allProducts);
    } catch (err) {
        console.error('Error in getAllProducts:', err.message);
        res.status(500).json({ message: 'Failed to fetch products' });
    }
}



// {id}
const getProductByid = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('product id:', id)

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }

        const product = await products.findById(id);
        console.log('fetch product:', product);

        if (!product) {
            return res.status(404).json({
                message: 'Product not Found'
            })
        }
        res.json(product)

    } catch (error) {
        console.log('The error is:', error.message)
        res.status(500).json({
            message: 'server error'
        })
    }

}

module.exports = { saveProduct, getProductByid, getAllProducts }