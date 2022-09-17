const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
   name: { type: String, required: true },
   description: { type: String, required: true },
   price: { type: Number, min: 0, required: true },
   stock: { type: Number, min:0, required: true },
   category: { type: Schema.Types.ObjectId, ref: 'Category', required: true }
});

ProductSchema.virtual('url').get(function(){ return '/product/' + this._id });

//Export model
module.exports = mongoose.model('Product', ProductSchema);
