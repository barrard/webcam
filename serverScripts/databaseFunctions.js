var url = 'mongodb://localhost:27017/users';
var serverFunctions = require('./serverFunctions.js')


function connectMongo(callback){
	MongoClient.connect(url, function(err, db) {
	 	if(serverFunctions.handleError(err)){
	     	console.log("We are connected to " + db.databaseName)
	     	callback(db)
		}else{
			return false
		}
	 })

}

function connectionToMongoCollection(collectionName, callback){
	connectMongo(function(db){
		var col = db.collection(collectionName)
		callback(col)
	})
}

function insertIntoMongo(collectionName, data, callback){
	console.log(data)
	connectionToMongoCollection(collectionName, function(col){
		console.log(col)
		for(var x = 0;x<data.length;x++){
			col.insert(data[x], function(err, resp){
				if(err){
					console.log('Error Message form DataBaseFunctions insert into mongo')
					callback({errorMessage:err})
				}else{
					callback({message:resp})
				}
			})
		}
	})
}

function findInCollection(collectionName, objToFindInMongo, callback){
	connectMongo(function(db){
		if(db){
			var collection = db.collection(collectionName)
			    console.log('collection name ' + collection.s.name)
			    console.log(objToFindInMongo)
			collection.find(objToFindInMongo).toArray(function(err, resultArray){
			  if(err){callback({errorMessage:'Collection Find Error'})
			  }else{
				    console.log('found array '+resultArray)
				  	if(resultArray.length ==0){//no result to return
	  				    console.log('resultArray length = '+resultArray.length)
	  				    console.log('couldnt find ')
	  				    console.log(objToFindInMongo)
	  				    console.log('=>aint in the'+collection.s.name+' Collection.')
	  				    // db.close()
	  				    callback({errorMessage:'result.length ='+resultArray.length})
				  	}else{
				  		console.log('Handle results and pass data back to the callback')
				  		// callback()
				  		console.log(resultArray.length)
				  		db.close()
				  		callback({message:resultArray})
				  	}
			  }
			})
		}else{//no db connection
			callback(false)
		}

	})

}

function addUserToDatabase(userData, callback){
	insertIntoMongo('allTBusers', userData, function(results){
		if(results.errorMessage){
			console.log('ERRPR!!!!!!!!111 '+results.errorMessage)
		}else if (results.message){
			console.log('Yay data war inserted ')
			console.log(userData)
		}
	})
}


module.exports={
	FindInCollection:findInCollection,

	InsertIntoMongo:insertIntoMongo,
	HandleUserLogin:function(method, userData, callback){
		console.log('++++++++++++++++++++++++++++++++++++++++++++++++')
		console.log(userData)
		serverFunctions.verifyUserData(userData, function(resp){
			if(resp.message && resp.errorMessage===undefined){
				console.log('handle user login databasefunctions')
				 findInCollection('allTBusers', userData, function(results){
				 	if(results.message!== undefined){
				 		console.log('found '+results.length+' results')
				 		callback({message:results})
				 	}else if(results.errorMessage!==undefined){
				 		console.log('No results found')
				 		console.log('Method ='+method)
				 		if(method === 'login'){
				 			callback({errorMessage:'No rsults match Query'})
				 		}else if(method==='register'){
				 			addUserToDatabase(userData, function(){

				 				callback({errorMessage:'new user to login'})
				 			})
				 			
				 		}
				 	}
				 })
				}else if(resp.errorMessage){
					callback({errorMessage:resp.errorMessage})
					console.log('Failed to verufy data? '+resp.errorMessage)
				}
		})
		

	},
	findAllInCollection:function(collectionName, callback){
		findInCollection(collectionName, {}, function(results){
			if(results){
				callback(results)
			}else{
				callback(false)
			}
		})
	}
}