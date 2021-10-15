const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const connectDB = require("./config/db");
const Handlebars = require("handlebars");
var dogapi = require("dogapi");
var options = {
  api_key: "ed13090bfde9541c52336ac5038bc30f",
  app_key: "b6bdff71e24013ae6f3139d81efe1b496989e430",
  // if you are on the Datadog EU site, you need to overwrite the default value of api_host key:
  // api_host: "app.datadoghq.eu"
};

const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");

const employeeController = require("./controllers/employeeController");
const contactoController = require("./controllers/contactoController");
const citaController = require("./controllers/citaController");
const notaController = require("./controllers/notaController");
// Load config
dotenv.config({ path: "./config/config.env" });

// Passport config
require("./config/passport")(passport);

connectDB();

const app = express();

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Method override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Handlebars Helpers
const {
  formatDate,
  stripTags,
  truncate,
  editIcon,
  select,
} = require("./helpers/hbs");

// Handlebars
app.engine(
  ".hbs",
  exphbs({
    helpers: {
      formatDate,
      stripTags,
      truncate,
      editIcon,
      select,
    },
    defaultLayout: "main",
    extname: ".hbs",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);
app.set("view engine", ".hbs");

// Sessions
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global var
app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

// Static folder
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/stories", require("./routes/stories"));

app.use("/contacto", contactoController);
app.use("/employee", employeeController);
app.use("/cita", citaController);
app.use("/nota", notaController);

const PORT = process.env.PORT || 5000;
dogapi.initialize(options);
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
