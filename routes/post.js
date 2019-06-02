var express = require('express');
var router = express.Router();
var Post = require('../model/post');

router.all('/', function (req, res, next) {
  if (!req.session.user) {
    req.flash('error', '未登入');
    return res.redirect('/login');
  }
  next();
})

/* GET home page. */
router.post('/', function (req, res, next) {
  var currentUser = req.session.user;
  var post = new Post(currentUser.name, req.body.post);
  post.save(function (err) {
    if (err) {
      req.flash('error', err);
      return res.redirect('/');
    }
    req.flash('success', '发表成功');
    res.redirect('/users/' + currentUser.name);
  });
});

module.exports = router;
