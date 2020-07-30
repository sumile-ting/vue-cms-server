var express = require('express');
var router = express.Router();

//mongodb
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://127.0.0.1:27017/cms');

var db = mongoose.connection;
db.once('error',() => console.log('Mongo connection error'));
db.once('open',() => console.log('Mongo connection successed'));


var Articles = new mongoose.Schema({
    id: String,
    title: String,
    content: String,
    category: String

});

var myModel = mongoose.model('articles', Articles);

/* GET listing. */
/**
 * 获取文章列表
 */
router.get('/list', function(req, res, next) {
        let a = myModel.find({category:'category1'}).sort({ id: -1}).limit(10); //其中一个栏目
        let b = myModel.find({category:'category2'}).sort({ id: -1 }).limit(10);//第二个栏目
        let c =  myModel.find({category:'category3'}).sort({ id: -1 }).limit(10); //第三个栏目
        Promise.all([a,b,c]).then(results => {
            console.log(results[0]);
            console.log(results[1]);
            console.log(results[2]);

            res.send(results);
        });
});

/**
 * 获取某个文章详情
 */
router.get('/list/category', function (req, res) {
    let query = req.query;

    console.log(query);
    myModel.count({category: query.category}, function (err, count) {
        myModel.find({category: query.category}).skip((query.pageNo - 1) * query.pageSize).limit(parseInt(query.pageSize)||20) .sort({ 'id': -1 }).exec((err, doc) => {
            if (err) {
                console.error(`/list/category::err:${JSON.stringify(err)}`);
                res.json({
                    status: 400,
                    msg: JSON.stringify(err)
                });
            } else {
                res.json({
                    status: 200,
                    result: doc,
                    total: count,
                    msg:'OK'
                });
            }
        })
    })

});

/**
 * 获取某个文章详情
 */
router.get('/list/:id', function (req, res) {
    console.log(req.params.id);
    myModel.findOne({id: req.params.id}, function (err, article) {
        console.log(article);
        res.send(article);
    })

})

/* POST articles listing. */
router.post('/publish', function(req, res, next) {
    let params = req.body;
    let newArticle = new myModel(params);
    newArticle.save(function (err) {
        if (err) {
            res.send(err);
        } else {
            res.end(JSON.stringify(params.id));
        }
    })
    // res.end(JSON.stringify(params.id));
});




module.exports = router;
