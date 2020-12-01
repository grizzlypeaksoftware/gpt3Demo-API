const mongoModel = require('./mongoModel');
const OpenAI = require('openai-api');

var Model = function(){};

Model.prototype.getCompletion = function(config, promptName){
    if(!promptName){promptName = "Generic Prompt"}
    const openai = new OpenAI(process.env.OPENAI_API_KEY);
    
    return new Promise(function(resolve, reject){
        openai.complete(config).then(function(response){
            // log to mongo
            mongoModel.InsertEntity("completions", {
                name: promptName, 
                prompt: config, 
                completion: response.data,
                score: 0,
                reported: false
            }).then(function(mongo_res){
                response.data.mongo_id = mongo_res.insertedIds[0];
                resolve(response);
            }).catch(function(err){
                reject(err);
            });            
          }).catch(function(err){
            reject(err);  
          })
    });
};

// open ai search request...
/*
 {        
    'engine': 'davinci',
    'documents': ["White House", "hospital", "school"],
    'query': "the president"
}
*/
Model.prototype.search = function(openai_search_request){
    const openai = new OpenAI(process.env.OPENAI_API_KEY);
    return new Promise(function(resolve, reject){
        openai.search(openai_search_request).then(function(response){
            resolve(response);
        }).catch(function(err){
            console.log(err);
            reject(err);
        });
    });
};
module.exports = new Model();