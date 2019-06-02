var express = require('express');
var router = express.Router();
var User = require('../model/user');
var Post = require('../model/post');

/* GET users listing. */
router.get('/:username', function (req, res, next) {
  console.log(req.params.username);
  User.get(req.params.username, function (err, user) {
    if (!user) {
      req.flash('error', '用户不存在');
      return res.redirect('/');
    }
    Post.get(user.name, function (err, posts) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/');
      }
      res.render('user', {
        title: user.name,
        posts: posts,
      });
    });
  });
});


module.exports = router;
