var mongojs = require('mongojs');
var db       = mongojs('blog');
var cUser    = db.collection('user');
var cArticle    = db.collection('article');
var cMsg    = db.collection('msg');

exports.cUser = cUser;
exports.cArticle = cArticle;
exports.cMsg = cMsg;