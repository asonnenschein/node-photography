var express = require('express')
  , logger = require('morgan')
  , cookieParser = require('cookie-parser')
  , session = require('express-session')
  , bodyParser = require('body-parser')
  , passport = require('passport')
  , multer = require('multer')
  , config = require('./config.json')
  , database = require('./database')
  , routes = require('./routes')(database)
  , server = express();
;

server.set('port', process.env.PORT || 3040);

server.use(cookieParser('secret'));
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json({ limit: '25mb' }));

require('./passport')(passport);

server.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

server.use(passport.initialize());
server.use(passport.session());

server.enable('trust proxy');

function checkAuthorization (req, res, next) {
  if (req.isAuthenticated && req.user.id) return next();
  else res.status(401).send("Unauthorized request!");
}

// Robots.txt ==================================================================
var robots = "User-agent: *";
robots += "\nDisallow: /user/";
robots += "\nDisallow: /user/*";
robots += "\nDisallow: /admin/login/";
robots += "\nDisallow: /admin/logout/";
robots += "\nDisallow: /admin/register/";
robots += "\nDisallow: /login/";
robots += "\nDisallow: /logout/";
robots += "\nDisallow: /register/";

server.get('/robots.txt',
  function (req, res) {
    res.type('text/plain');
    res.send(robots);
  })
;

// Register, Login & Logout Routes =============================================
server.post('/admin/login/',
  passport.authenticate('login'),
  function (req, res, next) {
    var username = req.user.get('username');
    res.redirect('/users/' + username + '/');
  })
;

server.post('/admin/logout/',
  checkAuthorization,
  function (req, res, next) {
    req.logout();
    res.status(200).end();
  })
;

server.post('/admin/register/',
  passport.authenticate('register'),
  function (req, res, next) {
//    res.status(201).end();
    var username = req.user.get('username');
    res.redirect('/users/' + username + '/');
  })
;

// User Routes =================================================================
server.get('/users/:username/',
  checkAuthorization,
  function (req, res, next) {
    return next();
  }, routes.getUser)
;

server.put('/users/:username/',
  checkAuthorization,
  function (req, res, next) {
    return next();
  }, routes.updateUser)
;

// Galleries Routes ============================================================
server.get(['/galleries/', '/all/', '/recent/'],
  function (req, res, next) {
    return next();
  }, routes.getGalleries)
;

server.get('/galleries/:gallery/',
  function (req, res, next) {
    return next();
  }, routes.getGallery)
;

server.post('/galleries/',
  multer({
    dest: config.uploads,
    onFileUploadStart: function (file, req, res) {
      if (config.allowed_extensions.indexOf(file.extension) < 0) {
        return false;
      }
    }
  }),
  function (req, res, next) {
    return next();
  }, routes.createGallery)
;

server.post('/galleries/:gallery/',
  checkAuthorization,
  function (req, res, next) {
    return next();
  }, routes.HTMLFormPutDeleteGallery)
;

// Galleries Images Routes =====================================================
server.get('/galleries/:gallery/images/',
  function (req, res, next) {
    return next();
  }, routes.getGalleriesImages)
;

server.get('/galleries/:gallery/images/:image/',
  function (req, res, next) {
    return next();
  }, routes.getGalleriesImage)
;

server.post('/galleries/:gallery/images/',
  checkAuthorization,
  multer({
    dest: config.uploads,
    onFileUploadStart: function (file, req, res) {
      if (config.allowed_extensions.indexOf(file.extension) < 0) {
        return false;
      }
    }
  }),
  function (req, res, next) {
    return next();
  }, routes.createGalleriesImage)
;

server.post('/galleries/:gallery/images/:image/',
  checkAuthorization,
  function (req, res, next) {
    return next();
  }, routes.HTMLFormPutDeleteGalleriesImage)
;

// About & Contact Routes ======================================================

server.get('/about/',
  function (req, res, next) {
    return next();
  }, routes.getAbout)
;

server.get('/contact/',
  function (req, res, next) {
    return next();
  }, routes.getContact)
;

server.post('/about/',
  checkAuthorization,
  function (req, res, next) {
    return next();
  }, routes.postAbout)
;

server.post('/contact/',
  checkAuthorization,
  function (req, res, next) {
    return next();
  }, routes.postContact)
;

// Public Routes ===============================================================
server.use(express.static(__dirname + '/public/'));
server.use("/images", express.static(__dirname + '/uploads/'));
server.use("/thumbnails", express.static(__dirname + '/thumbnails/'));

server.get('/*', function (req, res) {
  res.sendFile(__dirname + '/public/dist/index.html');
});

module.exports = function (callback) {
  callback(server);
};
