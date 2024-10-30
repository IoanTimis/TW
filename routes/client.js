const express = require('express'); 

const router  = express.Router(); 

const { isLogged } = require('../middlewares/client');

router.use([isLogged]);

const userController = require('../controllers/client'); 

router.get('/dashboard', userController.dashboard);
router.get('/products-history', userController.productsHistory);

module.exports = router; 