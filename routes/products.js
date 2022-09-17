var express = require('express');
const productController = require('../controllers/productController');

var router = express.Router();
/* GET home page. */
router.get('/', productController.productsList);

router.get('/create', productController.createProduct_get);
router.post('/create', productController.createProduct_post);

router.get('/:id/delete', productController.deleteProduct_get);
router.post('/:id/delete', productController.deleteProduct_post);

router.get('/:id/update', productController.updateProduct_get);
router.post('/:id/update', productController.updateProduct_post);

router.get('/:id', productController.detailProduct_get);

module.exports = router;
