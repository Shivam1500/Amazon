const mongoose = require ("mongoose");


const productSchema = new mongoose.Schema({
  id:String,
  url:String,
  detailsUrl:String,
  title:Object,
price:Object,
description:String,
dicount:String,
tagline:String
});

const Products = new mongoose.model("products",productSchema); //mongoose collection name, schema define
module.exports = Products;