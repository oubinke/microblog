var mongodb = require('./db');
var url = require('../settings').url;
var database = require('../settings').db;

function Post(username, post, time) {
    this.user = username;
    this.post = post;
    if (time) {
        this.time = time;
    } else {
        this.time = new Date();
    }
};
module.exports = Post;
Post.prototype.save = function save(callback) {
    // 存入 Mongodb 的文档
    var post = {
        user: this.user,
        post: this.post,
        time: this.time,
    };
    mongodb.connect(url, function (err, mongoClient) {
        if (err) {
            return callback(err);
        }
        db = mongoClient.db(database);
        // 读取 posts 集合
        db.collection('posts', function (err, collection) {
            if (err) {
                mongoClient.close();
                return callback(err);
            }
            // 为 user 属性添加索引
            collection.ensureIndex('user');
            // 写入 post 文档
            collection.insert(post, { safe: true }, function (err, post) {
                mongoClient.close();
                callback(err, post);
            });
        });
    });
};
Post.get = function get(username, callback) {
    mongodb.connect(url, function (err, mongoClient) {
        if (err) {
            return callback(err);
        }
        db = mongoClient.db(database);
        // 读取 posts 集合
        db.collection('posts', function (err, collection) {
            if (err) {
                mongoClient.close();
                return callback(err);
            }
            // 查找 user 属性为 username 的文档，如果 username 是 null 则匹配全部
            var query = {};
            if (username) {
                query.user = username;
            }
            collection.find(query).sort({ time: -1 }).toArray(function (err, docs) {
                mongoClient.close();
                if (err) {
                    callback(err, null);
                }
                // 封装 posts 为 Post 对象
                var posts = [];
                docs.forEach(function (doc, index) {
                    var post = new Post(doc.user, doc.post, doc.time);
                    posts.push(post);
                });
                callback(null, posts);
            });
        });
    });
};