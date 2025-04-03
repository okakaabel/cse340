/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const router = express.Router();
const expressLayouts = require("express-ejs-layouts");
const dotenv = require("dotenv").config();
const app = express();
const staticRoutes = require("./routes/static");
const baseController = require("./controllers/baseController");
const invController = require('../controllers/invController');
const inventoryRoute = require("./routes/inventoryRoute");
const accountRoute = require("./routes/accountRoute");
const errorRoute = require("./routes/errorRoute");
const utilities = require("./utilities/");
const pool = require("./database/index");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const pgSession = require("connect-pg-simple")(session);
const messages = require("express-messages");

// Define routes
router.get('/', inventoryController.getAllItems);
router.post('/', inventoryController.createItem);

module.exports = router;  // Not module.exports = { router }

/* ***********************
 * Middleware
 *************************/

// Session Middleware
app.use(
  session({
    store: new pgSession({
      createTableIfMissing: true,
      pool: pool,
    }),
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  })
);

// Flash Middleware
app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = messages(req, res);
  next();
});

// Cookie Parser
app.use(cookieParser());

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// JWT Token Validation
app.use(utilities.checkJWTToken);

// Populate Navigation for All Responses
app.use(async (req, res, next) => {
  try {
    res.locals.nav = await utilities.getNav();
    next();
  } catch (err) {
    next(err);
  }
});

// Serve Static Files
app.use(express.static("public"));

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

/* ***********************
 * Routes
 *************************/
// Public Routes
app.get("/", utilities.handleErrors(baseController.buildHome));
app.use("/account", accountRoute);

// Restricted Routes
app.use("/inventory", inventoryRoute);

// Test Route
app.get("/account/test", (req, res) => {
  res.send("Account test route is working");
});

// Intentional Error Route
app.use("/error", errorRoute);

// Flash Test Route
app.get("/test-flash", (req, res) => {
  req.flash("success", "Flash message is working!");
  res.redirect("/account/login");
});

// 404 Not Found Route - Must Be Last
app.use((req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." });
});

/* ***********************
 * Express Error Handler
 *************************/
app.use((err, req, res, next) => {
  console.error(`Error at "${req.originalUrl}": ${err.message}`);
  res.status(err.status || 500).render("errors/error", {
    title: err.status || "Server Error",
    message: err.message || "An unknown error occurred.",
    nav: res.locals.nav,
  });
});

/* ***********************
 * Server Configuration
 *************************/
const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";

app.listen(port, () => {
  console.log(`Server is running at http://${host}:${port}`);
});