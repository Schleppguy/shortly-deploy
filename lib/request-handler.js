var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');
var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');
exports.renderIndex = function(req, res) {
  res.render('index');
};
exports.signupUserForm = function(req, res) {
  res.render('signup');
};
exports.loginUserForm = function(req, res) {
  res.render('login');
};
exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};
exports.fetchLinks = function(req, res) {
  Link.find({}, function(err ,links) {
    if (err) {
      res.sendStatus(404);
    } else {
      res.send(200, links);
    }
  });
};
exports.saveLink = function(req, res) {
  var uri = req.body.url;
  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.sendStatus(404);
  }
  Link.findOne({ url: uri }, function (err, link) {
    if (err) {
      res.send(200, link);
    } else {
      util.getUrlTitle(uri, function (err, title) {
        if (err) {
          console.log(err);
          return res.send(404);
        }
        var newLink = new Link({
          url: uri,
          title: title,
          base_url: req.headers.origin
        });
        newLink.save(function (err, newLink) {
          res.send(200, newLink);
        });
      });
    }
  });
};
exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  User.findOne({username: username}, function (err, user) {
    if (err) {
      res.sendStatus(404);
    }
    if (!user) {
      res.redirect('/login');
    } else {
      user.comparePassword(password, function (match) {
        if (match) {
          util.createSession(req, res, user);
        } else {
          res.redirect('/');
        }
      })
    }
  });
};
exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  User.findOne({username: username}, function (err, user) {
    if (err) {
      res.sendStatus(404);
    }
    if (!user) {
      var newUser = new User({
        username: username,
        password: password
      });
      newUser.save(function(err, newUser) {
        if (err) {
          res.sendStatus(404);
        }
        util.createSession(req, res, newUser);
      });
    } else {
      res.redirect('/signup');
    }
  });
};
exports.navToLink = function(req, res) {
  Link.find({ code: req.params[0] }, function (err, links) {
    if (err) {
      res.sendStatus(404);
    }
    var link = links[0];
    if (!link) {
      res.redirect('/');
    } else {
      link.visits++;
      link.save(function (err, link) {
        if (err) {
          res.sendStatus(404);
        }
        return res.redirect(link.url);
      });
    }
  });
};