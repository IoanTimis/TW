const express = require('express'); 

const router  = express.Router(); 

const generalController = require('../controllers/general');

router.get('/', generalController.home); 
router.get('/about', generalController.about);
router.get('/contact', generalController.contact);

router.get('/search', generalController.search);
router.get('/search-results', generalController.searchResults);

router.post('/buy/product/:productId', generalController.buyProduct);

module.exports = router; 