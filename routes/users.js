const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const config = require('../config/config');

mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.model('User', config.schema.UserSchema);
const User = require('mongoose').model('User');

//middleware for create
const createUser = function (req, res, next) {
  const user = new User(req.body);

  user.save(function (err) {
    if (err) {
      next(err);
    } else {
      res.json(user);
    }
  });
};

const updateUser = function (req, res, next) {
  User.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, user) {
    if (err) {
      next(err);
    } else {
      res.json(user);
    }
  });
};

const deleteUser = function (req, res, next) {
  req.user.remove(function (err) {
    if (err) {
      next(err);
    } else {
      res.json(req.user);
    }
  });
};

const getAllUsers = function (req, res, next) {
  User.find(function (err, users) {
    if (err) {
      next(err);
    } else {
      res.json(users);
    }
  });
};

const getOneUser = function (req, res) {
  res.json(req.user);
};

const getByIdUser = function (req, res, next, id) {
  User.findOne({_id: id}, function (err, user) {
    if (err) {
      next(err);
    } else {
      req.user = user;
      next();
    }
  });
};

const getByEmail = function (req, res, next, email) {
  User.findOne({email: email}, function (err, user) {
    if (err) {
      next(err);
    } else {
      req.user = user;
      next();
    }
  });
};

const getByEmailPassword = function (req, res, next) {
  User.findOne({email: req.params.email, password: req.params.password}, function (err, user) {
    if (err) {
      next(err);
    } else {
      res.json(user);
    }
  });
};

router.route('/')
    .post(createUser)
    .get(getAllUsers);

router.route('/:userId')
    .get(getOneUser)
    .put(updateUser)
    .delete(deleteUser);

router.route('/email/:email')
    .get(getOneUser);

router.route('/email/:email/password/:password')
    .get(getByEmailPassword);

router.param('userId', getByIdUser);

router.param('email', getByEmail);

module.exports = router;
