const sanitizeHtml = require('sanitize-html');
const usersBoughtProducts = require('../models/usersBoughtProducts');

const dashboard = (req, res) => {
  res.render('pages/client/dashboard');
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
    res.render('pages/client/boughtProducts', {products: products});
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = {
  dashboard,
  productsHistory,
};

