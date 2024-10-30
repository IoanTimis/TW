const express = require('express'); 

const router  = express.Router(); 

const { isVendor } = require('../middlewares/vendor');

router.use([isVendor]);

const vendorController = require('../controllers/vendor');

router.get('/dashboard', vendorController.dashboard);

router.get('/products-history', vendorController.productsHistory);

router.get('/my-product/:productId', vendorController.getProduct);
router.get('/my-products', vendorController.getProducts);

router.post('/add/product', vendorController.AddProduct);
router.put('/edit/product/:productId', vendorController.updateProduct);
router.delete('/delete/product/:productId', vendorController.deleteProduct);

module.exports = router; 
