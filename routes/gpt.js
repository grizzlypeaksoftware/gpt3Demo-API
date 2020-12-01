var express = require('express')
var router = express.Router()
var model = require("../models/openAIModel");

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
})

// a "query is "
router.get('/query', function(req,res){
    var query = "Q: " + req.query.query + "\nA:";

    var config = {
        engine: 'davinci',
        prompt: query,
        maxTokens: 200,
        temperature: 0.9,
        topP: 1,
        presence_penalty: .2,
        frequency_penalty: .3,
        best_of: 1,
        n: 1,
        stream: false,
        stop: ['\nA:']
    }

    model.getCompletion(config).then(function(data){
        res.send(data.data);
    }).catch(function(err){
        console.log(err);
        res.send(err)
    });  
});

router.get('/history', function(req,res){
    model.history().then(function(results){res.send(results)}).catch(function(err){res.send(err)});
});

module.exports = router