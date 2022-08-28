const Products =require("./models/productSchema");
const productsdata = require("./constant/productsdata");

const DefaultData =async()=>{
  try {
    await Products.deleteMany({});// baar baar data add na ho isiliye aur extr data ko remove kar de
     const storeData = await Products.insertMany(productsdata);//store data in mongodb database
     console.log(storeData);
  }catch (error){
    console.log("error"+ error.message);

  }

};
module.exports = DefaultData