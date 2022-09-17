const Category = require('../models/Category');
const Product = require('../models/Product');
const async = require('async');
const { body, validationResult, check } = require("express-validator");

exports.categoriesList = (req, res, next) => {
   Category
      .find()
      .exec((err, categories) => {
         if (err) return next(err);
         res.render('categories_list', { title: "Categories list", categories })
      })

}

exports.detailCategory_get = (req, res, next) => {
   async.parallel({
      category(cb) {
         Category.findById(req.params.id).exec(cb)
      },
      products(cb) {
         Product.find({ category: req.params.id }).exec(cb)
      }
   }, (err, results) => {
      if (err) return next(err)
      if (results.category == null) {
         const e = new Error('Category not found');
         e.status = 404
         return next(e)
      }
      res.render('category_detail', { title: "Category details", ...results })
   })
}

exports.createCategory_get = (req, res, next) => {
   res.render('category_form', { title: 'Create Category' })
}

exports.createCategory_post = [
   body('name').trim()
      .isLength({ min: 1 }).withMessage("Name must not be empty.")
      .escape(),
   body('description').trim()
      .isLength({ min: 1 }).withMessage("Description must not be empty.")
      .escape(),
   check('admin-password', 'Wrong password').equals('motdepasse'),
   (req, res, next) => {
      const errors = validationResult(req)

      const categObject = req.body;
      const category = new Category(categObject);

      if (!errors.isEmpty()) {
         res.render('category_form', { title: "Create product", errors: errors.array(), correctPass: false })
         return;
      }

      category.save(err => {
         if (err) return next(err)
         res.redirect(category.url);
      });
   }
]

exports.deleteCategory_get = (req, res, next) => {
   async.parallel({
      categProducts(cb) {
         Product.find({ category: req.params.id }).exec(cb)
      },
      category(cb) {
         Category.findById(req.params.id).exec(cb)
      }
   }, (err, results) => {
      if (err) return next(err)
      if (results.category == null) {
         const e = new Error('Category not found')
         e.status = 404
         return next(e)
      }
      res.render('category_delete', { title: 'Delete Category', ...results })
   })
}

exports.deleteCategory_post = [
   check('admin-password', 'Wrong password').equals('motdepasse'),
   (req, res, next) => {
      async.parallel({
         categProducts(cb) {
            Product.find({ category: req.params.id }).exec(cb)
         },
         category(cb) {
            Category.findById(req.params.id).exec(cb)
         }
      }, (err, results) => {
         if (err) return next(err)

         const errors = validationResult(req)

         if (results.category == null) {
            const e = new Error('Category not found')
            e.status = 404
            return next(e)
         }

         if (!errors.isEmpty()) {
            res.render('category_delete', { title: 'Delete Category', ...results, errors: errors.array(), correstPass: false })
            return;
         }

         Category.findByIdAndRemove(req.body.id, err => {
            if (err) return next(err)
            res.redirect('/category');
         })
      })
   }
]
exports.updateCategory_get = (req, res, next) => {
   Category.findById(req.params.id).exec((err, category) => {
      if (err) return next(err)
      if (category == null) {
         const e = new Error('Category not found')
         e.status = 404
         return next(e)
      }
      res.render('category_form', { title: 'Update category', category })
   })
}
exports.updateCategory_post = [
   body('name').trim()
      .isLength({ min: 1 }).withMessage("Name must not be empty.")
      .escape(),
   body('description').trim()
      .isLength({ min: 1 }).withMessage("Description must not be empty.")
      .escape(),
   check('admin-password', 'Wrong password').equals('motdepasse'),
   (req, res, next) => {
      const errors = validationResult(req)

      const categObject = req.body;
      const category = new Category({ ...categObject, _id: req.params.id });

      if (!errors.isEmpty()) {
         res.render('category_form', { title: "Update product", errors: errors.array(), correctPass: false, category })
         return;
      }

      Category.findByIdAndUpdate(req.params.id, category, {}, (err, theCategory) => {
         if (err) return next(err);
         res.redirect(theCategory.url)
      })
   }
]
