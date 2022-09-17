var express = require('express');
var router = express.Router();
const async = require('async');
const Product = require('../models/Product')
const Category = require('../models/Category')

/* GET home page. */
router.get('/', function(req, res, next) {
  async.parallel({
    products(cb){
      Product.count(cb)
    },
    categories(cb){
      Category.count(cb)
    }
  }, (err, results) => {
    res.render('index', { title: 'Inventory App', results });
  })
});

module.exports = router;
