const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const config = require('../config/config');
const user = require('./users');

mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.model('Friends', config.schema.FriendSchema);
const Friends = require('mongoose').model('Friends');
const User = require('mongoose').model('User');



//middleware for create
const createFriend = function (req, res, next) {
  const friend = new Friends(req.body);
  User.findOne({email: req.body.emailFriend}, function (err, user) {
    if (err) {
      next(err);
    } else {
      if (user == null) {
        let newUser = new User({email: req.body.emailFriend, password: "azerty", name: "name", age: 12});
        newUser.save(function (err) {
          if (err) {
            next(err);
          }
        });
      }
      friend.save(function (err) {
        if (err) {
          next(err);
        }      
        else {
          res.json(friend);
        }
      });
    }
  });

  
};
  

const deleteFriend = function (req, res, next) {
  // console.log("YO");
  Friends.remove({ $or: [ { emailUser: req.params.emailUser, emailFriend: req.params.emailFriend }, { emailUser: req.params.emailFriend, emailFriend: req.params.emailUser } ] }, function (err) {
    if (err) {
      next(err);
    } else {
      res.json("Delete OK");
    }
  });
};

const getAllFriends = function (req, res, next) {
  Friends.find(function (err, users) {
    if (err) {
      next(err);
    } else {
      res.json(users);
    }
  });
};

const getOneFriend = function (req, res) {
  res.json(req.friend);
};

const getByIdFriend = function (req, res, next) {
  Friends.find({ $or: [ { emailUser: req.params.emailUser }, { emailFriend: req.params.emailUser } ] }, function (err, friends) {
    if (err) {
      next(err);
    } else {
      res.json(friends);
    }
  });
};

function getByEmail(email) {
  console.log("getbyemailfunc")

  User.findOne({email: email}, function (err, user) {
    if (err) {
      next(err);
    } else {
      return(user);
    }
  });
};

router.route('/')
    .post(createFriend)
    .get(getAllFriends);

router.route('/:userId')
    .get(getOneFriend);

router.route('/emailUser/:emailUser/emailFriend/:emailFriend')
    .delete(deleteFriend);

router.route('/emailUser/:emailUser')
    .get(getByIdFriend);

module.exports = router;
