const sanitizeHtml = require("sanitize-html");
const Product = require("../models/product");
const usersBoughtProducts = require("../models/usersBoughtProducts");
const Joi = require("joi");

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

const productSchema = Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
      "string.empty": "Name is required",
      "string.min": "Name should have at least 3 characters",
      "string.max": "Name can have a maximum of 50 characters"
    }),
    price: Joi.number().positive().required().messages({
      "number.base": "Price must be a number",
      "number.positive": "Price must be a positive number",
      "any.required": "Price is required"
    }),
    csrf_token: Joi.string().required()
});

const AddProduct = async (req, res) => {
    const user_id = req.session.loggedInUser.id;
    const { name, price} = req.body;
    sanitizeHtml(name);

    try {
        const { error, value } = productSchema.validate(req.body, { abortEarly: false });

        if (error) {
          const errorMessages = error.details.map(err => err.message);
          return res.status(400).json({ errors: errorMessages });
        }

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
    const user_id = req.session.loggedInUser.id;
    const {productId} = req.params;
    const {name, price} = req.body;
    sanitizeHtml(name);

    try {
        const { error, value } = productSchema.validate(req.body, { abortEarly: false });

        if (error) {
          const errorMessages = error.details.map(err => err.message);
          return res.status(400).json({ errors: errorMessages });
        }

        const product = await Product.findOne({
            where: {
                id: productId,
                user_id,
            },
        });

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