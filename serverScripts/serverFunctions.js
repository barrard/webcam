module.exports = {
handleError:function(err){
	if(err){
		console.log('-----HandleError helper function found an error------')
		console.log(err)
		console.log('------End of error-------')
		return false
	}else{
		return true
	}
},

verifyDataObj:function(obj, callback){
	console.log('VERIFY OBJ IN '+obj)
	console.log(obj)
	for(objs in obj){
		if(obj[objs]===''){
			console.log('objs is empy string'+obj[objs])
			callback({errorMessage:'objs is empy string'+obj[objs]})
			break
		}else if(obj[objs]===undefined){
			console.log('objs is undefined'+obj[objs])
			callback({errorMessage:'objs is undefined'+obj[objs]})
			break
		}else if(typeof obj[objs] === undefined){
			console.log('objs is typeof undefined'+obj[objs])
			callback({errorMessage:'objs is typeof undefined'+obj[objs]})
			break
		}else if (obj[objs].length<3) {
			console.log('objs is <3'+obj[objs])
			callback({errorMessage:'objs is <3'+obj[objs]})
			break
		}else{
			console.log('Objs is true![][][][][')
		}
	}
},
	verifyUserData:function(userData, callback){
		if(userData.teamName ==='' || typeof userData.teamName === undefined
			|| userData.teamName.length <3 ||
			userData.password ==='' || typeof userData.password === undefined
			|| userData.password.length <3){
			console.log('teamanmne and password requred more than 3 characters')
			callback({errorMessage:'need Team Name and password requred more than 3 characters'})
		}else{
			callback({message:'good choice'})
		}
	},

	socketCookieParser:function(socket, target){
		if(arguments.length ===2){
			var cookies = socket.request.headers.cookie
			cookies = cookies.split(';')
			var l = cookies.length
			for(var x = 0;x<l;x++){
				var cookie = cookies[x].split('=')
				var key = cookie[0]
				var value = cookie[1]
				// console.log('TARGET? '+target+' '+target.length)
				// console.log('COOOKKKIEEEE  KEY '+key+')
				// console.log('COOOKKKIEEEE  value '+value)
				if(target === key){
					console.log('Fond a match!!  '+key+' = == =  = = ='+value)
					return true
				}else{
					return false
				}
			}



		}else{
			return false
	}
		}
}