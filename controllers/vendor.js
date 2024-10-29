const sanitizeHtml = require("sanitize-html");
const Product = require("../models/product");

const dashboard = (req, res) => {};

const getProducts = async (req, res) => {
    try {
        const allProducts = await Product.findAll({ 
          where: { userId: req.session.loggedInUser.id } 
        });

        if (!allProducts) {
            // Nu ai niciun produs
        }

        res.render('pages/vendor/products', { products: allProducts }); 
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Internal Server Error');
    }
}

const AddProduct = async (req, res) => {
    const { name, price} = req.body;
    sanitizeHtml(name);
    sanitizeHtml(price);

    if (!name || !price) {
        return res.status(400).send('Name and price are required');
    }

    try {
        const newProduct = await Product.create({ name, price, userId: req.session.loggedInUser.id });

        if (!newProduct) {
            return res.status(404).send('Error creating product');
        }
        res.send(newProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).send('Internal Server Error');
    }
};

const updateProduct = async (req, res) => {
    const {productId} = req.params;
    const {name, price} = req.body;
    sanitizeHtml(name);
    sanitizeHtml(price);

    try {
        
        const product = await Product.findByPk(productId);

        if (!product) {
            return res.status(404).send('Product not found');
        }

        product.name = name;
        product.price = price;
        await product.save();
        res.send(product);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).send('Internal Server Error');
    }
};

const deleteProduct = async (req, res) => {
    const {productId} = req.params;

    try {
       
        const product = await Product.findByPk(productId);

        if (!product) {
            return res.status(404).send('Product not found');
        }

        await product.destroy();
        
        res.send('Product deleted');
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    getProducts,
    AddProduct,
    updateProduct,
    deleteProduct
};