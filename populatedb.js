#! /usr/bin/env node

console.log('DB population script');

// Get arguments passed on command line
// const userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
const async = require('async')
const Product = require('./models/Product')
const Category = require('./models/Category')
const mongoose = require('mongoose');

const mongoDB = "mongodb+srv://student001:motdepasse@cluster0.mlcbwjt.mongodb.net/inventory_app?retryWrites=true&w=majority";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const Categories = []
const Products = []

function CategoryCreate(name, description, cb) {
   Categorydetail = { name, description }

   const category = new Category(Categorydetail);

   category.save(function (err) {
      if (err) {
         cb(err, null)
         return
      }
      console.log('New Category: ' + category);
      Categories.push(category)
      cb(null, category)
   });
}


function createCategories(cb) {
   async.series([
      function (callback) {
         CategoryCreate('Helmet', 'Head protection', callback);
      },
      function (callback) {
         CategoryCreate('Glove', 'Hand protection', callback);
      },
      function (callback) {
         CategoryCreate('Shoe', 'Feet protection', callback);
      },
      function (callback) {
         CategoryCreate('Harness', 'Fall protection', callback);
      },
      function (callback) {
         CategoryCreate('Suit', 'Body protection', callback);
      }
   ],
      // optional callback
      cb);
}


function ProductCreate(name, description, price, stock, category, cb) {
   Productdetail = { name, description, price, stock, category }

   const product = new Product(Productdetail);
   product.save(function (err) {
      if (err) {
         cb(err, null)
         return
      }
      console.log('New Product: ' + product);
      Products.push(product)
      cb(null, product)
   });
}


function createProducts(cb) {
   async.parallel([
      function (callback) {
         ProductCreate('Eyewear', 'Eyes protection', 200, 10, Categories[0], callback);
      },
      function (callback) {
         ProductCreate('Ear plugs', 'Hearing protection', 300, 5, Categories[0], callback);
      },
      function (callback) {
         ProductCreate('Refractory', 'Thermal protection', 100, 20, Categories[1], callback);
      },
      function (callback) {
         ProductCreate('Meshed', 'Cut protection', 150, 30, Categories[1], callback);
      },
      function (callback) {
         ProductCreate('Boots', 'Mud protection', 1200, 10, Categories[2], callback);
      },
      function (callback) {
         ProductCreate('Indoor', 'Dust protection', 1000, 7, Categories[2], callback);
      },
      function (callback) {
         ProductCreate('Anchorage', 'Immobility security', 2300, 3, Categories[3], callback);
      },
      function (callback) {
         ProductCreate('Suspention', 'Stability security', 2500, 3, Categories[3], callback);
      },
      function (callback) {
         ProductCreate('Workwear', 'Durt protection', 3200, 45, Categories[4], callback);
      },
      function (callback) {
         ProductCreate('Disposable wear', 'Ephemeral protection', 500, 100, Categories[4], callback);
      },
   ],
      // optional callback
      cb);
}



async.series([
   createCategories,
   createProducts
],
   // Optional callback
   function (err, results) {
      if (err) {
         console.log('FINAL ERR: ' + err);
      }
      else {
         console.log('Products: ' + Products);
         console.log('Categories: ' + Categories);

      }
      // All done, disconnect from database
      mongoose.connection.close();
   });



