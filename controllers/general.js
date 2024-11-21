const Product = require("../models/product");
const usersBoughtProducts = require("../models/usersBoughtProducts");
const { Op } = require('sequelize');

const home = (req, res) => {
    res.render('pages/generalPages/index');
};

const contact = (req, res) => {
    res.render('pages/generalPages/contact');
};

const about = (req, res) => {
    res.render('pages/generalPages/about');
};

const search = async (req, res) => {
    const products = await Product.findAll();

    if (!products) {
        //TODO Nu a fost gasit niciun produs
    }
    res.render('pages/generalPages/search', { products: products });
};

const searchResults = async (req, res) => {
    const { search, maxPrice } = req.query;

    try {
        const products = await Product.searchProducts(search, maxPrice);

        if (products.length === 0) {
            //Todo: add message to the view
            // return res.render('pages/generalPages/search', { products: [], message: 'Nu au fost gasite produse.' });
        }

        res.render('pages/generalPages/search', { products: products });
    } catch (error) {
        console.error('Error searching products:', error);
        res.status(500).send('Internal Server Error');
    }
};

const buyProduct = async (req, res) => {
    const { productId } = req.params;
    const user_id = req.session.loggedInUser.id;
    
    try {
        if (user_id === undefined) {
            //Todo: Vom adauga in cos daca nu este logat
        } else {
            //Todo: Vom adauga produsul in cos si abia apoi daca este cumparat, in istoric
            const product = await Product.findByPk(productId);

            if (!product) {
                return res.status(404).send('Product not found');
            }

            const boughtProduct = await usersBoughtProducts.create({
                name: product.name,
                price: product.price,
                user_id,
                product_id: productId,
            });

            if (!boughtProduct) {
                return res.status(404).send('Product not found');
            }

            res.status(200).send('Product bought successfully');
        }
    } catch (error) {
        console.error('Error buying product:', error);
        res.status(500).send('Internal Server Error');
    }   
};

module.exports = {
    home,
    about,
    contact,
    search,
    searchResults,
    buyProduct,
};
