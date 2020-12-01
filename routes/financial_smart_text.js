var express = require('express')
var router = express.Router()
var model = require("../models/financialSmartTextModel");

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
})

// get
router.get('/', function(req,res){
  model.Get(req.query.id).then(function(data){res.send(data);}).then(function(err){res.send(err)});  
});

router.post('/', function(req,res){
    var obj =req.body;
    model.GetSmartText(obj).then(function(data){res.send(data.data);}).then(function(err){res.send(err)});  
});

router.get('/markets', function(req, res){
    model.GetMarketSummaries().then(function(data){res.send(data);}).then(function(err){res.send(err)});
});

router.get('/quotes',function(req,res){
    model.GetQuotes(req.query.symbols).then(function(data){res.send(data);}).then(function(err){res.send(err)});
});

router.get('/reddit', function(req,res){
    model.GetRedditFeed().then(function(data){res.send(data);}).then(function(err){res.send(err)});
});

router.get('/cryptofeed', function(req,res){
    model.GetCoinTelegraphFeed().then(function(data){
        res.send(data);
    }).then(function(err){res.send(err)});
});

router.post('/summarize', function(req, res){
    model.SummarizeText(req.body.text).then(function(data){
        res.send(data.data);}
    ).then(function(err){res.send(err)});
});

// post
/*
router.post('/', function (req, res) {
  var obj =req.body;
    model.Insert(obj).then(function(data){res.send(data);}).then(function(err){res.send(err)});  
});

//put
router.put('/', function(req,res){ 
  
  var obj = {
    name: req.body.name,
    value: req.body.value,
    costbasis: req.body.costbasis,
  };
  
  model.Update(req.body._id, obj).then(function(data){res.send(data);}).then(function(err){res.send(err)});  
});

// delete

router.delete("/", function(req,res){
  console.log(req.query.id);
  model.Delete(req.query.id).then(function(data){res.send(data);}).then(function(err){res.send(err)});  
});
*/

module.exports = router