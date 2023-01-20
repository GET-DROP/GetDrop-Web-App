const express = require("express"); //1.i we create a route for our pages here with router and export to app.js
const router = express.Router();
const app = express();
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const AirDrop = require("../models/airdrops");
const User2 = require("../models/User2");

// description login page
// route GET/
router.get("/login", ensureGuest, (req, res) => {
  res.render("login", {
    layout: "login", //k.3 we specfy which views get each layout by adding an object called layout and a string containing our layout name inside our routes file for the specific route that needs that layout
    success_msg: req.flash("success_msg"),
    error_msg: req.flash("error_msg"),
    error: req.flash("error"),
  }); //2.iwe use .render to check for templates or views with that name and display them
});

// router.post("/login",(req,res,next)=>{
//        passport.authenticate('local',{
//         successRedirect:'/dashboard',
//         failureRedirect:"/comingsoon",
//         failureFlash: true
//        })(req,res,next);
router.post("/login", ensureGuest, async (req, res) => {
  const user = await User2.findOne({ email: req.body.email }).lean();
  const{ password ,emailfield } = req.body;
  let error=[];
  try {
    if ( !password  ) {
      error.push({ msg: "Please fill in all password" });}
    if ( !emailfield ) {
      error.push({ msg: "Please fill in all email" });
    }
    if(error.length>0){
         res.render('login', {error,layout:'login'})
    }
    if(user) {
      res.render("comingsoon", {
        user,
        name: user.username,
        layout: false,
      });
    } else{
      res.render('error/500')
    }
  } catch (err) {
    console.error(err);
  }
});
// })

router.get("/signup", ensureGuest, (req, res) => {
  res.render("signup", {
    layout: false, //k.3 we specfy which views get each layout by adding an object called layout and a string containing our layout name inside our routes file for the specific route that needs that layout
  }); //2.iwe use .render to check for templates or views with that name and display them
});

// description post login details
// route POST/
router.post("/signup", (req, res) => {
  const { username, email, password, password2 } = req.body;
  console.log(username, email, password, password2);
  let errors = [];

  //check fields
  if (!username || !email || !password || !password2) {
    errors.push({ msg: "Please fill in all fields" });
  }
  //check passwords match
  if (password != password2) {
    errors.push({
      msg: "Passwords do not match, you thought it was just for show eh?",
    });
  }
  //check passwords lengh
  if (password.length < 8) {
    errors.push({ msg: "Password should be at least 8 characters" });
  }
  //if there are errors do this:
  if (errors.length > 0) {
    res.render("signup", {
      errors,
      username,
      email,
      password,
      password2,
      layout: false,
    });
  } else {
    User2.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push({ msg: "Email is already Registered" });
        res.render("signup", {
          errors,
          username,
          email,
          password,
          password2,
          layout: false,
        });
      } else {
        const hashedpsw = bcrypt.hashSync(password, 13);
        const newUser = new User2({
          username,
          email,
          password: hashedpsw,
        });
        newUser
          .save()
          .then((user) => {
            req.flash(
              "success_msg",
              "you have successfully signed up and can log in"
            ); // msg will be stored in session as we redirect
            res.redirect("/login");
            req.session = ("you have successfully signed up and can log in")
          })
          .catch((err) => console.error(err));
      }
    });
  }
});

// description dashboard
// route GET /dashboard
router.get("/dashboard", ensureAuth, async (req, res) => {
  try {
    const airdrops = await AirDrop.find({ user: req.user.id }).lean();
    res.render("dashboard", {
      name: req.user.firstName,
      airdrops,
    }); // console.log(AirDrop.createdAt)
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

router.get("/", async (req, res) => {
  try {
    const airdrops = await AirDrop.find({ status: "public" })
      .populate("user")
      .sort({ createdAt: "asc" })
      .lean();
    res.render("home", {
      airdrops,
      user: req.user,
      //  userdisplayName: req.user.displayName,
      // userimage: req.user.image,
      layout: false,
    });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

module.exports = router;
