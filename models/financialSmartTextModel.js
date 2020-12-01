var openAIModel = require('./openAIModel.js');
const https = require('https');
let Parser = require('rss-parser');
let parser = new Parser();

var Model = function(){};

Model.prototype.runGPTFunction = function(query){

    var config = {
        engine: 'davinci',
        prompt: query,
        maxTokens: 100,
        temperature: 0.9,
        topP: 1,
        presence_penalty: 0,
        frequency_penalty: 0,
        best_of: 1,
        n: 1,
        stream: false,
        stop: ['\n']
      }
    return openAIModel.getCompletion(config, "Generic Function");
};

// takes a comma separated list of symbols
Model.prototype.GetQuotes = function(symbols){

    var url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=" + symbols;

    console.log(process.env.COINMARKETCAPKEY);

    var options = {
        host: 'pro-api.coinmarketcap.com',
        port: 443,
        path: '/v1/cryptocurrency/quotes/latest?symbol=' + symbols,
        method: 'GET',
        headers: { 'X-CMC_PRO_API_KEY': process.env.COINMARKETCAPKEY }
    }

    return new Promise(function(resolve, reject){
                
        https.get(options, (resp) => {
            let data = '';
        
            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
            data += chunk;
            });
        
            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                var parsed = JSON.parse(data);
                var responseObj = [];
                var syms = symbols.split(',');
                for(var i = 0; i < syms.length; i++){
                    var sym = syms[i].toUpperCase();
                    responseObj.push(parsed.data[sym]);
                }
                resolve(responseObj);
            });
        
        }).on("error", (err) => {
            reject(err);
        });
    });
};


Model.prototype.GetMarketSummaries = function(){

    return new Promise(function(resolve, reject){

        var syms = ["BTC-USD", "ETH-USD","XRP-USD", "LTC-USD", "XLM-USD"];
                
        https.get('https://api.bittrex.com/v3/markets/summaries', (resp) => {
            let data = '';
        
            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
            data += chunk;
            });
        
            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                var parsed = JSON.parse(data);
                var responseObj = [];

                for(var i = 0; i< syms.length; i++){
                    var sym = syms[i];
                    for(var j = 0; j < parsed.length; j++){
                        var obj = parsed[j];
                        if(obj.symbol == sym){
                            responseObj.push(obj);
                            break;
                        }
                    }
                }

                resolve(responseObj);
            });
        
        }).on("error", (err) => {
            reject(err);
        });
    });
}

Model.prototype.GetSmartText = function(obj){

    //  this prompt totally failed.  Smart text did not generate accurately.
    //var samplestring = "Text: " + obj.name + " changed " + obj.quote.USD.percent_change_24h.toFixed(2) + "% over the last 24 hours and is currently priced at " + obj.quote.USD.price.toFixed(2) + ".\nText:";
    var samplestring = "Q: What is " + obj.name + "?\nA:";
    var config = {
        engine: 'curie',
        prompt: samplestring,
        maxTokens: 40,
        temperature: .6,
        topP: 1,
        presence_penalty: .1,
        frequency_penalty: .1,
        best_of: 1,
        n: 1,
        stream: false,
        stop: ['\n']
      }
    return openAIModel.getCompletion(config, "Crypto Definition for " + obj.name);

};

Model.prototype.GetCoinTelegraphFeed = function(){
    return parser.parseURL('https://news.bitcoin.com/feed/');
};

Model.prototype.GetRedditFeed = function(){
    // using rss parser to simply Api-ify an rss feed.
    return parser.parseURL('https://www.reddit.com/r/CryptoCurrency/.rss'); 
};

Model.prototype.SummarizeText = function(text){

    text = text.replace(/(\r\n|\n|\r)/gm, " ");    

    var prompt = 'My second grader asked me what this passage means: "' + text + '. I rephrased it for him, in plain language a second grader can understand:';

    var config = {
        engine: 'davinci',
        prompt: prompt,
        maxTokens: 100,
        temperature: .7,
        top_p: 1,
        presencePenalty: 0,
        frequencyPenalty: 0.2,
        bestOf: 1,
        n: 1,
        stream: false,
        stop: ['understand:']
      }

      console.log(config);
    return openAIModel.getCompletion(config, "Crypto News Summary");
};

module.exports = new Model();