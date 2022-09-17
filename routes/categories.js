var express = require('express');
const categoryController = require('../controllers/categoryController');

var router = express.Router();
/* GET home page. */
router.get('/', categoryController.categoriesList);

router.get('/create', categoryController.createCategory_get);
router.post('/create', categoryController.createCategory_post);

router.get('/:id/delete', categoryController.deleteCategory_get);
router.post('/:id/delete', categoryController.deleteCategory_post);

router.get('/:id/update', categoryController.updateCategory_get);
router.post('/:id/update', categoryController.updateCategory_post);

router.get('/:id', categoryController.detailCategory_get);

module.exports = router;
