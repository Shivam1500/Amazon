const express = require("express");
const router = new express.Router();
const Products = require("../models/productSchema");
const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const authenicate = require("../middlewear/authenticate");

// get product api

router.get("/getproducts", async (req, res) => {
  try {
    const productsdata = await Products.find();
    // console.log("show the data" +productsdata);
    res.status(201).json(productsdata);
  } catch (error) {
    console.log("error" + error.message);
  }
});

//get individual data

router.get("/getproductsone/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(id)

    const individual = await Products.findOne({ id: id });
    // console.log(individual + "ind mila hai");

    res.status(201).json(individual);
  } catch (error) {
    res.status(400).json(error);
  }
});

// register the data

router.post("/register", async (req, res) => {
  // console.log(req.body);
  const { fname, email, mobile, password, cpassword } = req.body;

  if (!fname || !email || !mobile || !password || !cpassword) {
    res.status(422).json({ error: "filll the all details" });
    console.log("bhai nathi present badhi details");
  }

  try {
    const preuser = await User.findOne({ email: email });

    if (preuser) {
      res.status(422).json({ error: "This email is already exist" });
    } else if (password !== cpassword) {
      res.status(422).json({ error: "password are not matching " });
    } else {
      const finaluser = new User({
        fname,
        email,
        mobile,
        password,
        cpassword,
      });

      // yaha pe hasing krenge//bcryptjs one way hashing// password hashing

      const storedata = await finaluser.save();
      console.log(storedata + "user successfully added");
      res.status(201).json(storedata);
    }
  } catch (error) {
    console.log(
      "error the bhai catch ma for registratoin time" + error.message
    );
    res.status(422).send(error);
  }
});

// login data
router.post("/login", async (req, res) => {
  // console.log(req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "fill the details" });
  }

  try {
    const userlogin = await User.findOne({ email: email });
    console.log(userlogin);
    if (userlogin) {
      const isMatch = await bcrypt.compare(password, userlogin.password);
      console.log(isMatch);

      // token generate
      const token = await userlogin.generatAuthtoken();
      console.log(token);

      res.cookie("Amazonweb", token, {
        //cookiename,
        expires: new Date(Date.now() + 2589000),
        httpOnly: true,
      });

      if (!isMatch) {
        res.status(400).json({ error: "invalid crediential pass" });
      } else {
        res.status(201).json(userlogin);
      }
    } else {
      res.status(400).json({ error: "user not exist" });
    }
  } catch (error) {
    res.status(400).json({ error: "invalid crediential pass" });
    console.log("error the bhai catch ma for login time" + error.message);
  }
});

// add to cart api

router.post("/addcart/:id", authenicate, async (req, res) => {
  try {
    const { id } = req.params;
    const cart = await Products.findOne({ id: id });
    console.log(cart + "cart milta hain");

    const UserContact = await User.findOne({ _id: req.userID });
    console.log(UserContact + "user milta hain");

    if (UserContact) {
      const cartData = await UserContact.addcartdata(cart);

      await UserContact.save();
      console.log(cartData + " thse save wait kr");
      console.log(UserContact + "userjode save");
      res.status(201).json(UserContact);
    } else {
      res.status(401).json({ error: "invalid user" });
    }
  } catch (error) {
    res.status(401).json({ error: "invalid user" });
  }
});

//get cart details

router.get("/cartdetails", authenicate, async (req, res) => {
  try {
    const buyuser = await User.findOne({ _id: req.userID });
    res.status(201).json(buyuser);
  } catch (error) {
    console.log("error" + error);
  }
});

//get valid user

router.get("/validuser", authenicate, async (req, res) => {
  try {
    const validuserone = await User.findOne({ _id: req.userID });
    res.status(201).json(validuserone);
  } catch (error) {
    console.log("error" + error);
  }
});

//remove item from cart

router.delete("/remove/:id", authenicate, async (req, res) => {
  try {
    const { id } = req.params;
    req.rootUser.carts = req.rootUser.carts.filter((cruval) => {
      return cruval.id != id;
    });

    req.rootUser.save();
    res.status(201).json(req.rootUser);
    console.log("iteam remove");
  } catch (error) {
    console.log("error" + error);
    res.status(400).json(req.rootUser);
  }
});

//for user logout

router.get("/logout",authenicate,(req,res)=>{
  try{
req.rootUser.tokens =req.rootUser.tokens.filter((curelem)=>{
return curelem.token !== req.token
});

res.clearCookie("Amazonweb",{path:"/"});
req.rootUser.save();
res.status(201).json(req.rootUser.tokens)
console.log("user logout")
  }catch(error){
    console.log("error in logout ")
  }
})

module.exports = router;
