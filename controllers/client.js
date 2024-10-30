const sanitizeHtml = require('sanitize-html');
const usersBoughtProducts = require('../models/usersBoughtProducts');

const dashboard = (req, res) => {
  res.render('pages/user/dashboard');
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
    res.render('pages/user/boughtProducts', {products: products});
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Internal Server Error');
  }
};


const Boughtproduct = async (req, res) => {
  const user_id = req.session.loggedInUser.id;
  const { name, price } = req.body;
  sanitizeHtml(name);
  sanitizeHtml(price);

  try {
    const product = await usersBoughtProducts.create({name, price , user_id});

    if (!product) {
      return res.status(404).send('Error adding product to user bought products');
    }
    
    res.status(201).json(product);
  }
  catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Internal Server Error');
  }

};

module.exports = {
  dashboard,
  productsHistory,
  Boughtproduct
};

