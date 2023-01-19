const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 5000; // 3.when ever we use process.env we can accces properties in our env file , here we accessed port
const passport = require("passport");
const exphbs = require("express-handlebars"); //1.g 1st we bring in the handlebars
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const connectpassport = require("./config/passport");
const connectDB = require("./config/db");
const morgan = require("morgan"); //1f. basically its a logger
const { default: mongoose } = require("mongoose");
const flash = require("connect-flash");

//1. load config file
dotenv.config({ path: "./config/config.env" }); //1.we passed in an object with the path to our config file where we put all out google variables . this config funtion Loads .env file contents into process.env (env is the user environment)/**Specify a custom path if your file containing environment variables is located elsewhere. */

//passport config
connectpassport(passport);

//
connectDB();

//body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// method override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

//logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); // if we run our app in development mode bring in the morgan middleware with dev argument which is a level of logging
}

//handelbars Helpers
const {
  formatDate,
  stripTags,
  truncate,
  editIcon,
  select,
  navUserimage,
  sidenavUserimage,
  displayingerrors,
} = require("./helpers/hbs");

//handlebars
app.engine(
  "hbs",
  exphbs.engine({
    helpers: {
      formatDate,
      stripTags,
      truncate,
      editIcon,
      select,
      navUserimage,
      sidenavUserimage,
      displayingerrors,
    },
    extname: "hbs",
    defaultLayout: "main",
  })
);
app.set("view engine", ".hbs"); //here we setup up our template engine

//session
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

// connect-flash
app.use(flash());

//ser global variable
app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

//static folder
app.use(express.static(path.join(__dirname, "public"))); //k.1 we use static middleware and path to link our file in public to our server which actually also link it to our handlebars files

//routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/airdrops", require("./routes/airdrops"));

app.listen(
  PORT,
  console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
