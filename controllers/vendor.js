const sanitizeHtml = require("sanitize-html");
const Product = require("../models/product");
const usersBoughtProducts = require("../models/usersBoughtProducts");

const dashboard = (req, res) => {
    res.render('pages/vendor/dashboard');
};

const productsHistory = async (req, res) => {
    const user_id = req.session.loggedInUser.id;
  
    try {
      const products = await usersBoughtProducts.findAll({
        where: {
          user_id,
        },
      });
  
      if (!products) {
        return res.status(404).send('Products not found'); // Nu ai cumparat niciun produs
      }

      res.render('pages/vendor/boughtProducts', {products: products});
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).send('Internal Server Error');
    }
};

const getProduct = async (req, res) => {
    const {productId} = req.params;
    const user_id = req.session.loggedInUser.id;

    try {
        const product = await Product.findOne({
            where: {
                id: productId,
                user_id,
            },
        });

        if (!product) {
            return res.status(404).send('Product not found');
        }

        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
    }
};

const getProducts = async (req, res) => {
    const user_id = req.session.loggedInUser.id;

    try {
        const allProducts = await Product.findAll({ 
          where: { 
            user_id,
        } 
        });

        if (!allProducts) {
            // Nu ai niciun produs
        }

        res.render('pages/vendor/myProducts', { products: allProducts }); 
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Internal Server Error');
    }
};

const AddProduct = async (req, res) => {
    const user_id = req.session.loggedInUser.id;
    const { name, price} = req.body;

    sanitizeHtml(name);

    if (!name || !price) {
        return res.status(400).send('Name and price are required');
    }

    try {
        const newProduct = await Product.create({ name, price, user_id });

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
    dashboard,
    productsHistory,
    getProduct,
    getProducts,
    AddProduct,
    updateProduct,
    deleteProduct
};