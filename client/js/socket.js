 var socket = io.connect('/meetapp');
var socketid;
 socket.on('connection', function (data, myHtml) {
  $('#main').html(myHtml)
  if(localStorage.getItem('username')){
  	$('.errorMessages').html('Hello, '+localStorage.getItem('username')+"!!")
  }else{
  	$('.errorMessages').html('Please Loggin')
  }
 	socketid = data
 	 console.log(socketid)
 	 });

 socket.on('loginError', function(d){
 	console.log(d)
 	$('.errorMessages').html(d)
 })

 



socket.on('newUserRegister', function(d, html){
	console.log(JSON.stringify(d)+ ' welcome new user')
	$('#main').html(html)
  socket.emit('dashboardReady', socketid)
})




// socket.on('loginInfo', function(d){
//   if(d["username"] === "null") window.location.pathname='/'
//   console.log((d))
//   username = d.username

//   for(var k in d){
//     $('#loginInfo').append("<li>"+ k +'   :  '+ d[k] + "</li>")
//   }

// })

socket.on('error', function(d){
  console.log(d)
})




socket.on('usersListData', function(d){
	console.log('GOT USER')
	console.log(d)
		for(var k in d){
			var status, userList;
			if(d[k].loggedIn === true){
				status = '-success';
				userList = "onlineUsers";

			}else{
				status = ' grey'
				userList = "offlineUsers";

			}
			var sock = d[k].socketId
			sock = sock.split('').splice(-5).join('')
			$('#'+userList).append('<li id="'+sock+'" class="list-group-item'+status+'">'+d[k].username+'</li>')
		console.log(k +" : "+ d[k])
		console.log('username '+d[k].username)
		console.log('username '+d[k].loggedIn)
		console.log('username '+d[k].socketId)
		var sock = d[k].socketId
		sock = sock.split('').splice(-5).join('')
		console.log(sock)
		// for (var j in d[k]){
		// 	console.log(j+" : "+d[k][j])
		// }
	}

})



socket.on('userLogin', function(sock, sockId, username){
	console.log(sock+' is userlogin name '+username)
	var newSock = sockId
	newSock = newSock.split('').splice(-5).join('')
	if($('#'+sock).length===0){
		console.log('We need to upddate the userList to add a new player');
		$('#onlineUsers').append('<li id="'+newSock+'" class="list-group-item-success'+'">'+username+'</li>')

	}

	$('#'+sock).attr('id', newSock)
	$('#onlineUsers').append($('#'+newSock).attr('class', 'list-group-item-success'))
	console.log(' userlist socket updated '+newSock)

	for( k=0; k<$('.list-group-item-success').length;k++){
		console.log($('.list-group-item-success')[k].innerHTML)
	}
})



socket.on('userDisconnected', function(d){
	var sock = d
	console.log(sock+' user disconnected')
	sock = sock.split('').splice(-5).join('')
	$('#offlineUsers').append(
		$('#'+sock).attr('class', 'list-group-item grey')
		)
	



})



