var express = require('express');
var router = express.Router();
var User = require('../model/user');
var crypto = require('crypto');

router.all('/', function (req, res, next) {
  if (req.session.user) {
    req.flash('error', '已登入');
    return res.redirect('/');
  }
  next();
})
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('login', {
    title: '用户登入',
  });
});
router.post('/', function (req, res, next) {
  //生成口令的散列值
  var md5 = crypto.createHash('md5');
  var password = md5.update(req.body.password).digest('base64');
  User.get(req.body.username, function (err, user) {
    if (!user) {
      req.flash('error', '用户不存在');
      return res.redirect('/login');
    }
    if (user.password != password) {
      req.flash('error', '用户口令错误');
      return res.redirect('/login');
    }
    req.session.user = user;
    req.flash('success', '登入成功');
    res.redirect('/');
  });
})

module.exports = router;
