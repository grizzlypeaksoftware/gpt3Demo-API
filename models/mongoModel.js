const { MongoClient } = require('mongodb');

var DataAccess = function () {
	this.MongoClient = require('mongodb').MongoClient
		, assert = require('assert');
    this.Mongo = require('mongodb');
	this.DBConnectionString = process.env.MONGO_CONNECTION.replace(/\\/g, "");
	this.Database = process.env.DATABASE;
};

DataAccess.prototype.MakeMongoId = function(id){
	return this.Mongo.ObjectID(id);
};

DataAccess.prototype.ObjectID = function(id){
	return this.Mongo.ObjectID(id);
};

DataAccess.prototype.Get = function(coll, id){
    var that = this;
    return this.GetEntities(coll, {_id: that.ObjectID(id)});
}

DataAccess.prototype.GetEntities = function(coll, query, sort, limit){
	var that = this; 
	
	if(!query){
		query = {};
	}

	if(!sort){
		sort = {"_id":1};
	}

	var queryParams = {
		sort : sort	
	}

	if(limit){
		queryParams.limit = limit;
	}

	return new Promise( function(fulfill, reject){	
		that.MongoClient.connect(that.DBConnectionString)
		.then(function(db){
			var database = db.db(that.Database);
			var collection = database.collection(coll);
			collection.find(query, queryParams).toArray(function (err, docs) {	
				db.close();
				if(err){
					reject(err);
				} else {
					fulfill(docs);
				}
			});
		}).catch(function(err){
			reject(err);
		});
	});	
};

DataAccess.prototype.InsertEntity = function(coll, entity){
	var that = this;
	return new Promise( function(fulfill, reject){
		that.MongoClient.connect(that.DBConnectionString)
		.then(function(db){
			var database = db.db(that.Database);
			var collection = database.collection(coll);
			var toInsert = []; 
			toInsert.push(entity);
			collection.insertMany(toInsert, function (err, result) {
				db.close();
				if(err){
					reject(err);
				} else {
					fulfill(result);
				}
			});
		}).catch(function(err){
			reject(err);
		});
	});
};

DataAccess.prototype.DeleteById = function(coll,id){
	var that = this;
	return new Promise(function(fulfill, reject){
		that.MongoClient.connect(that.DBConnectionString)
		.then(function(db){
			var database = db.db(that.Database);
			var collection = database.collection(coll);
			collection.deleteOne({_id: new that.Mongo.ObjectID(id)}, function (err, result) {
				db.close();
				if(err){
					reject(err);
				} else {
					fulfill(result);
				}
			});
		}).catch(function(err){
			reject(err);
		});
	});
}

DataAccess.prototype.DeleteEntity = function(coll, id, res){
	
	var that = this;	
	this.MongoClient.connect(this.DBConnectionString, function (err, db) {
		assert.equal(null, err);	
		
		var database = db.db(that.Database);
		var collection = database.collection(coll);
		
 		collection.deleteOne({_id: new that.Mongo.ObjectID(id)}, function(err, results) {
			if (err){				
				res.send("error", err);	
			}

			if(res){
				res.send(results);
			}		
		});
		db.close();
	});
};

DataAccess.prototype.Update = function(coll, query, entity){
	var that = this;
    
	return new Promise(function(fulfill, reject){
		that.MongoClient.connect(that.DBConnectionString)
		.then(function(db){
			var database = db.db(that.Database);
            var collection = database.collection(coll);
			collection.updateOne(query, entity, function (err, result) {
				db.close();
				if(err){
					console.log(err);
					reject(err);
				} else {
					fulfill(result);
				}
			});
		}).catch(function(err){
			reject(err);
		});
	});
};

DataAccess.prototype.SumItemsInCollection = function(coll, field){
	// items must be numerical, clearly
	var fieldKey = "$" + field;
	var query = {
		$group: {
			_id: '',
			sum: { $sum: fieldKey }
		}
	};

	var that = this;
	return new Promise(function(fulfill, reject){
		that.MongoClient.connect(that.DBConnectionString)
		.then(function(db){
			var database = db.db(that.Database);
            var collection = database.collection(coll);
			collection.aggregate(query, function(error, result){
				if(error) reject(error);
				result.next(function(err, res){
					if(err) console.log(err);
					fulfill(res);
					db.close();

				});				
			});
		}).catch(function(err){
			reject(err);
		});
	});
}

module.exports = new DataAccess();
