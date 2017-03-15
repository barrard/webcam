

function findInCollection(db, collectionName, key, value){
	console.log("We are connected to " + db.databaseName + ", poolSize = ");

    var collection = db.collection(collectionName);
    console.log('collection name ' + collection.s.name)
  collection.find({key:value}).toArray(function(err, r){
    if(err){
      console.log('error finding '+key+" as "+value+" in collection "+collection)
    }else if(r.length !==0){
      console.log('found something in mongo for '+value)
    }else{
    	console.log('result length = '+r.length)
      console.log('couldnt find it in '+collection.s.name+' as key:'+key+' and value:'+value)
    }
  })
}