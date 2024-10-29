const express = require('express'); 

const router  = express.Router(); 

const { isVendor } = require('../middlewares/vendor');

router.use([isVendor]);

const vendorController = require('../controllers/vendor');

router.get('/', vendorController.getProducts);
router.post('/add-product', vendorController.AddProduct);
router.put('/update-product/:productId', vendorController.updateProduct);
router.delete('/delete-product/:productId', vendorController.deleteProduct);

module.exports = router; 
