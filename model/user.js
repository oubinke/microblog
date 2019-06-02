var mongodb = require('./db');
var url = require('../settings').url;
var database = require('../settings').db;

function User(user) {
    this.name = user.name;
    this.password = user.password;
};

User.prototype.save = function (callback) {
    // 存入 Mongodb 的文档
    var user = {
        name: this.name,
        password: this.password,
    };
    mongodb.connect(url, function (err, mongoClient) {
        if (err) {
            return callback(err);
        }
        db = mongoClient.db(database);
        // 读取 users 集合
        db.collection('users', function (err, collection) {
            if (err) {
                mongoClient.close();
                return callback(err);
            }
            // 为 name 属性添加索引
            collection.ensureIndex('name', { unique: true });
            // 写入 user 文档
            collection.insert(user, { safe: true }, function (err, user) {
                mongoClient.close();
                callback(err, user);
            });
        });
    });
};
User.get = function (username, callback) {
    mongodb.connect(url, function (err, mongoClient) {
        if (err) {
            return callback(err);
        }
        // 读取 users 集合
        db = mongoClient.db(database);
        db.collection('users', function (err, collection) {
            if (err) {
                mongoClient.close();
                return callback(err);
            }
            // 查找 name 属性为 username 的文档
            collection.findOne({ name: username }, function (err, doc) {
                mongoClient.close();
                if (doc) {
                    // 封装文档为 User 对象
                    var user = new User(doc);
                    callback(err, user);
                } else {
                    callback(err, null);
                }
            });
        });
    });
};

module.exports = User;