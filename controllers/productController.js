const Product = require('../models/Product');
const Category = require('../models/Category');
const async = require('async');

exports.productsList = (req, res, next) => {
   Product
      .find()
      .populate('category')
      .exec((err, products) => {
         if (err) return next (err);
         res.render('products_list', { title : "Products list", products })
      })

}

exports.detailProduct_get = (req, res, next) => {
   Product.findById(req.params.id).populate('category').exec((err, prod) => {
      if (err) return next(err);
      if (prod == null) {
         const e = new Error('Product not found');
         e.status = 404
         return next(e)
      }
      res.render('product_detail', { title : 'Product details', product: prod })

   })
}

exports.createProduct_get = (req, res, next) => {
   Category.find().exec((err, categories) => {
      if (err) return next(err)
      res.render('product_form', { title: 'Create Product', categories })
   })
}

const { body, validationResult, check } = require("express-validator");

exports.createProduct_post = [
   body('name').trim()
      .isLength({ min: 1 }).withMessage("Name must not be empty.")
      .escape(),
   body('category').trim()
      .isLength({ min: 1 }).withMessage("Category must not be empty.")
      .isAlphanumeric().withMessage("Category must be in letters")
      .escape(),
   body('price').trim()
      .isLength({ min: 1 }).withMessage("Price must not be empty.")
      .isFloat().withMessage("Price must be a number")
      .escape(),
   body('stock').trim()
      .isLength({ min: 1 }).withMessage("Stock must not be empty.")
      .isInt().withMessage("Stock must be an Integer")
      .escape(),
   body('description').trim()
      .isLength({ min: 1 }).withMessage("Description must not be empty.")
      .escape(),
   check('admin-password', 'Wrong password').equals('motdepasse'),
   (req, res, next) => {
      const errors = validationResult(req)

      const prodObject = req.body;
      const product = new Product(prodObject);

      if(!errors.isEmpty()){
         Category.find().exec((err, categories) => {
            if (err) return next(err);
            res.render('product_form', { title: "Create product", categories, errors: errors.array(), correctPass: false })
         })
         return;
      }

      product.save(err => {
         if (err) return next(err)
         res.redirect(product.url);
      });
   }
]

exports.deleteProduct_get = (req, res, next) => {
   Product.findById(req.params.id).populate('category').exec((err, prod) => {
      if (err) return next(err)
      if (prod == null) {
         const e = new Error('Product not found')
         e.status = 404
         return next(e)
      }
      res.render('product_delete', { title: "Delete product", product: prod })
   })
}
exports.deleteProduct_post = [
   check('admin-password', 'Wrong password').equals('motdepasse'),
   (req, res, next) => {
      const errors = validationResult(req)

      if(!errors.isEmpty()){
         Product.findById(req.body.id).populate('category').exec((err, prod) => {
            if (err) return next(err)
            if (prod == null) {
               const e = new Error('Product not found')
               e.status = 404
               return next(e)
            }
            res.render('product_delete', { title: "Delete product", product: prod, correctPass: false, errors: errors.array() })
         })
         return;
      }

      Product.findByIdAndRemove(req.body.id, err => {
         if (err) return next(err)
         res.redirect('/product');
      })
   }
]

exports.updateProduct_get = (req, res, next) => {
   async.parallel({
      categories(callback){
         Category.find(callback)
      },
      product(callback){
         Product.findById(req.params.id).populate('category').exec(callback)
      }
   }, (err, results) => {
      if(err) return next(err)
      if(results.product == null) {
         const e = new Error('Product not found')
         e.status = 404
         return next(e)
      }
      res.render('product_form', { title: 'Update product', categories: results.categories, product: results.product })
   })
}
exports.updateProduct_post = [
   body('name').trim()
      .isLength({ min: 1 }).withMessage("Name must not be empty.")
      .escape(),
   body('category').trim()
      .isLength({ min: 1 }).withMessage("Category must not be empty.")
      .isAlphanumeric().withMessage("Category must be in letters")
      .escape(),
   body('price').trim()
      .isLength({ min: 1 }).withMessage("Price must not be empty.")
      .isFloat().withMessage("Price must be a number")
      .escape(),
   body('stock').trim()
      .isLength({ min: 1 }).withMessage("Stock must not be empty.")
      .isInt().withMessage("Stock must be an Integer")
      .escape(),
   body('description').trim()
      .isLength({ min: 1 }).withMessage("Description must not be empty.")
      .escape(),
   check('admin-password', 'Wrong password').equals('motdepasse'),

   (req, res, next) => {
      const errors = validationResult(req)

      const prodObject = req.body;
      const product = new Product({ ...prodObject, _id: req.params.id });

      if(!errors.isEmpty()){
         Category.find().exec((err, categories) => {
            if (err) return next(err);
            res.render('product_form', { title: "Update product", product, categories, errors: errors.array(), correctPass: false })
         })
         return;
      }


      Product.findByIdAndUpdate(req.params.id, product, {}, err => {
         if (err) return next(err)
         res.redirect(product.url);
      })
   }
]
