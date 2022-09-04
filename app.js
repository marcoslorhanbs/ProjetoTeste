
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const passport = require('passport');
const setUpPassport = require('./config');
const path = require('path');
const session = require('express-session');
const ejs = require("ejs");
const redisClient = require('./App/data/redis');
const RedisStore = require("connect-redis")(session);



//swagger
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./api.yaml');
const methodSwagger = require('./App/routers/apiSwagger');

//routers
const routerForum = require('./App/routers/forum');
const routerIndex = require('./App/routers/index');
const routerTech = require('./App/routers/tech');
const routerlogin = require('./App/routers/login');
const routerDonors = require('./App/routers/relationship');
const routerUser = require('./App/routers/register'); //create
const routerProfile = require('./App/routers/profiles'); //read
const routerEdit = require('./App/routers/edit'); //update
const routerDelet = require('./App/routers/delet'); //delete
const { use } = require('passport');

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));
app.use(methodSwagger);

setUpPassport();
app.use( bodyParser.json());
app.use( bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());

//import views
app.set("views", path.join(__dirname, "App/views"));
app.set('view engine', 'ejs');

app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: "LUp$Dg?,I#i&owP3=9su+OB%`JgL4muLF5YJ~{;t",
      resave: true,
      saveUninitialized: true,
    })
  );

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.foruns = req.forum;
  res.locals.errors = req.flash("error");
  res.locals.infos = req.flash("info");
  next();
});


app.use( routerIndex );
app.use( routerTech );
app.use( routerlogin )
app.use( routerForum );
app.use( routerUser );
app.use( routerProfile );
app.use( routerDelet );
app.use( routerEdit );
app.use( routerDonors );


module.exports.app = app;
