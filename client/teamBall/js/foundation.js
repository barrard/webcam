$(document).foundation();

function showPlayerForm(){
	$('#addPlayerForm').css('display', 'block')
	$('#addPlayerForm').addClass('animated fadeInDown').one('animationend', 
		function() {
		    $(this).removeClass('fadeInDown')
		})
	
}
function hideAddPlayerForm(){
	$('#addPlayerForm').addClass('animated fadeOutUp').one('animationend', 
		function() {
		    $(this).removeClass('fadeOutUp')
			$('#addPlayerForm').css('display', 'none')

		})
	
}
function showPlayerStats(){
	$('#playerStats').css('display', 'block')
	$('#playerStats').addClass('animated fadeInDown').one('animationend', 
		function() {
		    $(this).removeClass('fadeInDown')
		})
	
}
function hidePlayerStats(){
	$('#playerStats').addClass('animated fadeOutUp').one('animationend', 
		function() {
		    $(this).removeClass('fadeOutUp')
			$('#playerStats').css('display', 'none')

		})
	
}
function showPlayerInfo(){
	$('#playerInfo').css('display', 'block')
	$('#playerInfo').addClass('animated fadeInDown').one('animationend', 
		function() {
		    $(this).removeClass('fadeInDown')
		})
	
}
function hidePlayerInfo(){
	$('#playerInfo').addClass('animated fadeOutUp').one('animationend', 
		function() {
		    $(this).removeClass('fadeOutUp')
			$('#playerInfo').css('display', 'none')

		})
	
}

function getTeamInfo(val){
	var xhr = new XMLHttpRequest();
	// var teamName = val;
	var url = 'getTeamInfo.php?teamName='+val;

	xhr.onreadystatechange = function(){
		if (xhr.readyState==4&&xhr.status==200) {
			$('#opponentInfo').addClass('bounceInRight').one('animationend',
				function() {
				   // $(this).removeClass('animated bounceInRight')
				})
			$('#resultHistory').addClass('bounceInUp').one('animationend',
				function() {
				   // $(this).removeClass('animated bounceInRight')
				})
			response = xhr.responseText;
			document.getElementById('opponentInfo').innerHTML = response;	
			getGameHistory();
		//	$(document).foundation()
		};
	};
	$('#opponentInfo').addClass('animated fadeOut').one('animationend',
		function() {
		    $(this).removeClass('fadeOut')
		})
	$('#resultHistory').addClass('animated fadeOut').one('animationend',
		function() {
		    $(this).removeClass('fadeOut')
		})
		xhr.open('GET', url, true);
		xhr.send();
	}

function getGameHistory(){
	var xhr = new XMLHttpRequest();
	var homeId = document.getElementById('teamId').innerHTML;
	var visitorId = document.getElementById('opponentIdNumber').innerHTML;
	var url = 'getGameHistory.php?homeTeamId='+homeId+'&visitorTeamId='+visitorId;

	xhr.onreadystatechange = function(){
		if (xhr.readyState==4&&xhr.status==200) {
			response = xhr.responseText;
			console.log(document.getElementById('opponentIdNumber').innerHTML);
			console.log(document.getElementById('teamId').innerHTML);

			document.getElementById('gameHistory').innerHTML = response;	
			//$(document).foundation()
		};
	};

		xhr.open('GET', url, true);
		xhr.send();

}

function getStatsFromDB(){
	var teamId = document.getElementById('teamId').innerHTML;
	var gameId = document.getElementById('gameId').innerHTML;
	console.log('getStatsFromDB()');
	var xhr = new XMLHttpRequest();
	var url = 'getStatsFromDB.php?teamId='+teamId+'&gameId='+gameId;

	xhr.onreadystatechange =  function(){
			if (xhr.readyState==4&&xhr.status==200) {
				console.log('success we got stats from DB');
				document.getElementById('getStatsFromDB').innerHTML=xhr.responseText;
				var scriptTags=document.getElementById('getStatsFromDB').getElementsByTagName('script');
				for(var n=0;n<scriptTags.length;n++){
					eval(scriptTags[n].innerHTML);
				}
				//console.log(statsfromDB);
				//console.log('gameId: '+gameId);
			};
		}
	xhr.open("GET", url, true);
	xhr.send();
}


function sendRoster(){
	var xhr = new XMLHttpRequest();
	var url = 'sendRoster.php';
	// var playerId = document.getElementById('playerId').value;
	var teamIdTag = document.getElementById('teamIdTag').value;
	var firstName = document.getElementById('firstName').value;
	var lastName = document.getElementById('lastName').value;
	var playerNumber = document.getElementById('playerNumber').value;
	var playerNotes = document.getElementById('playerNotes').value;
	var playerPosition = document.getElementById('playerPosition').value;
	var starter = document.getElementById('starter').value;
	var cacheControl = document.getElementById('cacheControl').value;

	var query="teamId="+teamIdTag+"&firstName="+firstName+"&lastName="+lastName+"&playerNumber="+playerNumber+"&playerNotes="+playerNotes+"&playerPosition="+playerPosition+"&starter="+starter+"&cacheControl="+cacheControl;
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	// xhr.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
	// xhr.setHeader("Pragma", "no-cache"); // HTTP 1.0.
	// xhr.setDateHeader("Expires", 0); // Proxies.
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4 && xhr.status==200){
			var returnData=xhr.responseText;
			//document.getElementById('resptxt').innerHTML=returnData;
			getHomeTeamList();
			getVisitorTeamList();

			console.log('roster send');
		}
	}
	xhr.send(query);
	document.getElementById('resptxt').innerHTML="AJAX!";
console.log("Sending The Roster adding a Player");
console.log('teamId '+teamIdTag);
document.getElementById('homeTeamList').innerHTML = '';
$('#teamIdTag').val('');
$('#firstName').val('');
$('#lastName').val('');	}

function updateRoster(){
	var xhr = new XMLHttpRequest();
	var url = 'updateRoster.php';
	var teamId = document.getElementById('teamIdTag').value;
	var playerId = document.getElementById('playerId').value;
	var firstName = document.getElementById('firstName').value;
	var lastName = document.getElementById('lastName').value;
	var playerNumber = document.getElementById('playerNumber').value;
	var playerNotes = document.getElementById('playerNotes').value;
	var playerPosition = document.getElementById('playerPosition').value;
	var starter = document.getElementById('starter').value;

	var query="teamId="+teamId+"&playerId="+playerId+"&firstName="+firstName+"&lastName="+lastName+"&playerNumber="+playerNumber+"&playerNotes="+playerNotes+"&playerPosition="+playerPosition+"&starter="+starter;
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4 && xhr.status==200){
			var returnData=xhr.responseText;
			document.getElementById('resptxt').innerHTML=returnData;
			getHomeTeamList();
			getVisitorTeamList();

		}
	}
	xhr.send(query);
	document.getElementById('resptxt').innerHTML="AJAX!";
console.log("Sending The Updted Roster information to Player");
console.log(teamId);
document.getElementById('homeTeamList').innerHTML = '';
$('#teamIdTag').val('');
$('#firstName').val('');
$('#lastName').val('');
	}

function getHomeTeamList(){
	console.log("getHomeTeamList();");
	var xhr = new XMLHttpRequest();
	var url = 'getHomeTeam.php';
	var teamId = document.getElementById('teamId').innerHTML;
	var visitorName = document.getElementById('opponentName').innerHTML;
	console.log(teamId+' '+visitorName);
	var query = "?teamId="+teamId;
	xhr.onreadystatechange=function(){
		if(xhr.readyState == 4 && xhr.status==200){
			var returnData=xhr.responseText;
			document.getElementById('homeTeamList').innerHTML=returnData;
		}
	}
	xhr.open('GET', url+query, true);
	xhr.send();
}

//function getVisitorTeamList(){
// 	console.log("getVisitorTeamList();");
// 	var xhr = new XMLHttpRequest();
// 	var url = 'getVisitorTeam.php';
// 	var opponentId = document.getElementById('opponentId').innerHTML;
// 	var opponentName = document.getElementById('opponentName').innerHTML;
// 	console.log('opponentId '+opponentId+' and opponentName '+opponentName);
// 	var query = "?opponentId="+opponentId;
// 	xhr.onreadystatechange=function(){
// 		if(xhr.readyState == 4 && xhr.status==200){
			
// 			document.getElementById('visitorTeamList').innerHTML=xhr.responseText;
// 			// getVisitorTeamList();
// 		}
// 	}
// 	xhr.open('GET', url+query, true);
// 	xhr.send();
// }


function newGame(){
	// this.event.preventDefault();
	var xhr = new XMLHttpRequest();
	var url = 'newGame.php';
	var homeId = document.getElementById('teamId').innerHTML;
	var visitorId = document.getElementById('opponentIdNumber').innerHTML;
	var dateString = document.getElementById('dateString').innerHTML;
	var homeName = document.getElementById('homeName').innerHTML;
	var visitorName = document.getElementById('visitorName').innerHTML;
	var query = "?homeTeamId="+homeId+"&visitorTeamId="+visitorId+"&homeTeamName="+homeName+"&visitorTeamName="+visitorName+"&dateString="+dateString;


	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4 && xhr.status==200){
			 location.reload();
			console.log("NewGeame "+visitorId);
			getHomeTeamList();
			getVisitorTeamList();
		};
	};

	xhr.open('GET', url+query, true);
	xhr.send();

}

function resumeGame(event){
	this.event.preventDefault();
	var gameId = event.target.getAttribute('id');
	var xhr = new XMLHttpRequest();
	var url = 'resumeGame.php';
	var query = "?gameId="+gameId;


	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4 && xhr.status==200){
			 location.reload();
			 document.getElementById('resumeGame').innerHTML=xhr.responseText;

			console.log("resumeGame "+gameId);
			// getHomeTeamList();
			// getVisitorTeamList();
		};
	};

	xhr.open('GET', url+query, true);
	xhr.send();

}

function quitGame(){
	this.event.preventDefault();
	var xhr = new XMLHttpRequest();
	var url = 'quitGame.php';

	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4 && xhr.status==200){
			 location.reload();
			console.log("Quit Game ");
		};
	};
	xhr.open('GET', url, true);
	xhr.send();
}

//////////////////////   CLOCK     ////////////////////////
function minusMinute(){
	minusMinuteBtn=document.getElementById('minusMinuteBtn');
	minusMinuteBtn.addEventListener('click', function(){
		clearInterval(timer)},false);
	time = window.document.getElementById('gameTime').innerHTML;
	console.log("length is "+time.length);
	var min = time.slice(0,-2);
	var sec = time.slice(2);
	min = parseInt(min);
	if (min!=0) {
	min=min-1;
}
	if (min<10 && min>=0) {
		min = "0"+min;
}
	console.log("Time is "+time);
	console.log("Minutes are "+min);
	console.log("Seconds are "+sec);
	document.getElementById('gameTime').innerHTML = min+sec;
}
function plusMinute(){
	plusMinuteBtn=document.getElementById('plusMinuteBtn');
	plusMinuteBtn.addEventListener('click', function(){
		clearInterval(timer)},false);
		time = window.document.getElementById('gameTime').innerHTML;
		console.log("length is "+time.length);
		var min = time.slice(0,-2);
		var sec = time.slice(2);
		min = parseInt(min);
		min=min+1;

		if (min<10) {
			min = "0"+min;

	}
		console.log("Time is "+time);
		console.log("Minutes are "+min);
		console.log("Seconds are "+sec);
		document.getElementById('gameTime').innerHTML = min+sec;
	}

function minusSecond(){
	minusSecondBtn=document.getElementById('minusSecondBtn');
	minusSecondBtn.addEventListener('click', function(){
		clearInterval(timer)},false);
		time = window.document.getElementById('gameTime').innerHTML;
		console.log("length is "+time.length);
		// if (time.length ==5) {
		var min = time.slice(0,-2);
		var sec = time.slice(-2);
		sec=parseInt(sec);

			sec=sec-1;
		
			if (sec<0) {
				sec=59;
			}else if(sec<10){
				sec= "0"+sec;
			}
		console.log("Time is "+time);
		console.log("Seconds are "+sec);
		document.getElementById('gameTime').innerHTML = min+sec;
	}
function plusSecond(){
	plusSecondBtn=document.getElementById('plusSecondBtn');
	plusSecondBtn.addEventListener('click', function(){
		clearInterval(timer)},false);
		time = window.document.getElementById('gameTime').innerHTML;
		console.log("length is "+time.length);
		var min = time.slice(0,-2);
		var sec = time.slice(-2);
		sec=parseInt(sec);
		if (sec==59) {
			sec=-1;
		};
			sec=sec+1;
		
			 if(sec<10){
				sec= "0"+sec;
			}
		console.log("Time is "+time);
		console.log("Seconds are "+sec);
		document.getElementById('gameTime').innerHTML = min+sec;
	}
function rewindClock(){
		time = window.document.getElementById('gameTime').innerHTML;
		console.log("length is "+time.length);
		var min = time.slice(0,-2);
		var sec = time.slice(-2);
		sec=parseInt(sec);
		if(sec!=-1){
			sec=sec-10;
		}
			if (sec<0) {
				sec=59;
			}else if(sec<10){
				sec= "0"+sec;
			}
		console.log("Time is "+time);
		console.log("Seconds are "+sec);
		document.getElementById('gameTime').innerHTML = min+sec;
	}
function fastForwardClock(){
		time = window.document.getElementById('gameTime').innerHTML;
		console.log("length is "+time.length);
		var min = time.slice(0,-2);
		var sec = time.slice(-2);
		sec=parseInt(sec);
		if (sec>=59) {
			sec=59;
			sec=-1;
		};
			sec=sec+10;
		if (sec>=60){
			sec=5;
		}
			 if(sec<10){
				sec= "0"+sec;
			}
		console.log("Time is "+time);
		console.log("Seconds are "+sec);
		document.getElementById('gameTime').innerHTML = min+sec;
	}
	function playClock(){
		timer = setInterval(function(){
			time = window.document.getElementById('gameTime').innerHTML;
			console.log("length is "+time.length);
			// if (time.length ==5) {
			var min = time.slice(0,-3);
			var sec = time.slice(-2);
			sec=parseInt(sec);
			min=parseInt(min);

				sec=sec-1;
			
				if (min<10||min>=0) {
					min="0"+min;
				}
				if(sec<10&&sec>=0){
					sec= "0"+sec;
				}
	
				if (sec<0&&min!=0) {
					sec=59;
					if(min!=0){
						min=min-1;
						if(min==0){
							min="0"+min;
						}
					}
				}
				
			
					if(min==0&&sec==0)
			clearInterval(timer);
			console.log("Time is "+time);
			console.log("Seconds are "+sec);
			console.log("minutes are "+min);
			document.getElementById('gameTime').innerHTML = min+":"+sec;
			},1000);
		stopClockBtn=document.getElementById('stopClockBtn');
		stopClockBtn.addEventListener('click', function(){
			clearInterval(timer)},false);
		pauseClockBtn=document.getElementById('pauseClockBtn');
		pauseClockBtn.addEventListener('click', function(){
			clearInterval(timer)},false);
		}
//////////////   CLOCK     ////////////////////////

function sendStats(){
	var xhr = new XMLHttpRequest();
	var url = 'sendStats.php';
	var time = document.getElementById('gameTime').innerHTML;
	var teamId = document.getElementById('teamId').innerHTML;
	var shotId = shotList.length;
	// var shotId = document.getElementById('shotId').value;
	var eventCoordsX = document.getElementById('eventCoordsX').value;
	var eventCoordsY = document.getElementById('eventCoordsY').value;
	var playerId = document.getElementById('playerId').value;
	var gameId = document.getElementById('gameId').innerHTML;
	var foundIcon = document.getElementById('foundIcon').value;
	var iconColor = document.getElementById('iconColor').value;
	var shotType = shotList[shotList.length-1];
	if (shotType == 'miss') {
		shotType = 0;
	}else if(shotType == 'freethrow'){
		shotType = 1;
	}else if(shotType == 'made'){
		shotType = 2;
	}else if(shotType == 'three'){
		shotType = 3;
	}else if(shotType == 'block'){
		shotType = 4;
	}else if(shotType == 'steal'){
		shotType = 5;
	}else if(shotType == 'assist'){
		shotType = 6;
	}else if(shotType == 'rebound'){
		shotType = 7;
	}else if(shotType == 'turnover'){
		shotType = 8;
	}else if(shotType == 'foul'){
		shotType = 9;
	}else if(shotType == 'travel'){
		shotType = 10;
	}else if(shotType == 'freethrow'){
		shotType = 11;
	}
	console.log('COUNT IT!! '+shotType);
	var query = "shotId="+shotId+"&eventCoordsX="+eventCoordsX+"&eventCoordsY="+eventCoordsY+"&playerId="+playerId+"&shotType="+shotType+"&teamId="+teamId+"&time="+time+"&player="+player+"&gameId="+gameId+"&foundIcon="+foundIcon+"&iconColor="+iconColor;

	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4 && xhr.status==200){
			var returnData=xhr.responseText;
			document.getElementById('resptxt').innerHTML=returnData;
		}
	}
	xhr.send(query);
}

function getInfoForm(event){
	var target = event.target.getAttribute('id');
	console.log('the target getInfoForm is: '+target);
	var xhr = new XMLHttpRequest();
	var url = 'getInfoForm.php?player='+target;
	xhr.onreadystatechange =  function(){
		if (xhr.readyState==4&&xhr.status==200) {
			var response = (xhr.responseText);
			response = response.split(',');
			console.log('the whole part of this array is '+response)
			$('#firstName').val(response[1]);
			$('#lastName').val(response[6]);
			$('#playerNumber').val(response[3]);
			$('#playerNotes').val(response[4]);
			$('#playerPosition').val(response[2]);
			$('#playerId').val(response[0])




		}
	}
	xhr.open("GET", url, true);
	xhr.send();
}

function deletePlayer(event){
	var target = event.target.getAttribute('id');
	console.log('the target to be deleted is: '+target);
	var xhr = new XMLHttpRequest();
	var url = 'deletePlayer.php?id='+target+'&t='+Date();
	xhr.onreadystatechange =  function(){
			if (xhr.readyState==4&&xhr.status==200) {
				var resp = xhr.responseText;
				console.log(resp);
				document.getElementById('resptxt').innerHTML = resp;
				getHomeTeamList();
				getVisitorTeamList();


			};
		}
	xhr.open("GET", url, true);
	xhr.send();
}

function deleteEvent(event){
	event.preventDefault()
	var div = $(this);
		console.log(div)
		div.addClass('animated fadeOutLeft')
	var target = event.target.getAttribute('id');
	console.log('the target to be deleted is: '+target);
	var xhr = new XMLHttpRequest();
	var url = 'deleteEvent.php?id='+target+'&t='+Date();
	xhr.onreadystatechange =  function(){
			if (xhr.readyState==4&&xhr.status==200) {
				var resp = xhr.responseText;
				console.log(resp);
				getHomeTeamList();
				getHomeTeamEvents();
				//getVisitorTeamList();


			};
		}
	xhr.open("GET", url, true);
	xhr.send();
}




function mainStats(event){
	
	// homeTeamList = window.document.getElementById('homeTeamList');
		// homeTeamList.addEventListener('click', showStats, false);
		var target = event.target.getAttribute('id');
		var gameId=document.getElementById('gameId').innerHTML;
		console.log('the target mainStat is: '+target);
		var xhr = new XMLHttpRequest();
		var url = 'mainStats.php?player='+target+'&t='+Date()+'&gameId='+gameId;
		xhr.onreadystatechange =  function(){
				if (xhr.readyState==4&&xhr.status==200) {
					var resp = xhr.responseText;
					console.log(resp);
					document.getElementById('mainStats').innerHTML = resp;
							getHomeTeamEvents();

				};
			}
		xhr.open("GET", url, true);
		xhr.send();
		getHomeTeamEvents();
}

function getStats(event){
	console.log('getStats(event');

	// homeTeamList = window.document.getElementById('homeTeamList');
		// homeTeamList.addEventListener('click', showStats, false);
		var target = event.target.getAttribute('id');
		var gameId = document.getElementById('gameId').innerHTML;
		console.log('the target is: '+target);
		var xhr = new XMLHttpRequest();
		var url = 'getStats.php?player='+target+'&gameId='+gameId;

		xhr.onreadystatechange =  function(){
				if (xhr.readyState==4&&xhr.status==200) {
					document.getElementById('playerStats').innerHTML = xhr.responseText;
				};
			}
		xhr.open("GET", url, true);
		xhr.send();
}


function getHomeTeamEvents(){
	var teamId = document.getElementById('teamId').innerHTML;
	var gameId = document.getElementById('gameId').innerHTML;
	console.log('getHomeTeamEvents()');
	var xhr = new XMLHttpRequest();
	var url = 'getHomeTeamEvents.php?teamId='+teamId+'&gameId='+gameId;

	xhr.onreadystatechange =  function(){
			if (xhr.readyState==4&&xhr.status==200) {
				var homeTeamEvents=document.getElementById('homeTeamEvents');
				homeTeamEvents.innerHTML = xhr.responseText;
				getVisitorTeamEvents();
				console.log("getHomeTeamEvents return");
				
				
			};
		}
	xhr.open("GET", url, true);
	xhr.send();
}

function getVisitorTeamEvents(){
	var teamId = document.getElementById('opponentId').innerHTML;
	var gameId = document.getElementById('gameId').innerHTML;
	console.log('getVisitorTeamEvents()');
	var xhr = new XMLHttpRequest();
	var url = 'getVisitorTeamEvents.php?teamId='+teamId+'&gameId='+gameId;

	xhr.onreadystatechange =  function(){
			if (xhr.readyState==4&&xhr.status==200) {
				var opponentEvents=document.getElementById('visitorTeamEvents');
				opponentEvents.innerHTML = xhr.responseText;
				console.log('getVisitorTeamEventsCallBack');
				
			};
		}
	xhr.open("GET", url, true);
	xhr.send();
}


	var shotList = [];
	var shotLocX = [];
	var shotLocY = [];
	var foundIcon = [];
	var iconColor = [];
	if (shotList.length==0) {
		getStatsFromDB();
		getHomeTeamEvents();
			};

	function populateCourt (shotList, shotLocX, shotLocY, foundIcon, iconColor){
		console.log('Lets go for a walk, down callBackLane');

		// console.log(shotList);
		// console.log(shotLocX);
		// console.log(shotLocY);
		for (var i = 0; i<shotList.length;  i++) {
			//console.log(shotList[i], shotLocX[i], shotLocY[i]);
			populateEvents(foundIcon[i], iconColor[i], shotLocX[i], shotLocY[i] );
		}
			function populateEvents(fi, color, posx, posy){
			var icon = document.createElement("i");
			var span = document.createElement("span");
			icon.setAttribute('class', fi);
			span.setAttribute('class', 'courtMarkers');
			// miss.setAttribute('alt', 'Shot made');
			// icon.setAttribute('height', '10');
			// icon.setAttribute('width', '10');
			shotbox = window.document.getElementById('shotbox');

			console.log('populateEvents');
			icon.style.zIndex=20;
			icon.style.color=color;
			span.appendChild(icon);
			document.getElementById('courtImage').appendChild(span);

			icon.style.position = 'absolute';
			icon.style.top = (posy)+'%';
			icon.style.left = (posx)+'%';
			span.style.textShadow = 18+'px'+18+'px'+18+'px'+'black';
			shotbox = window.document.getElementById('shotbox');


				shotbox.style.display = 'none';
			}
		
	}
///////////////////////////////////////////////////
function pickPlayer(){
	$('#homeTeamList').addClass('animated wobble').one('animationend',
		function(){
			$(this).removeClass('animated wobble')
		});


}
function $event(fi, color, message, type){
var icon = document.createElement("i");
var span = document.createElement("span");
icon.setAttribute('class', fi +' animated bounceInLeft');
document.getElementById('foundIcon').value=fi;
document.getElementById('iconColor').value=color;
span.setAttribute('class', 'courtMarkers');
// miss.setAttribute('alt', 'Shot made');
// icon.setAttribute('height', '10');
// icon.setAttribute('width', '10');
var shotbox = $('#shotbox');
posy = shotbox.css('top');
posy = posy.slice(0, -2);
posy = parseInt(posy-15);
console.log('posY: '+posy)

posy = posy / shotbox.parent().height()*100;
posx = shotbox.css('left');
posx = posx.slice(0, -2);
posx = parseInt(posx-5);
console.log("PosX: "+posx)

posx = posx / shotbox.parent().width()*100;
console.log(posx+" "+posy)

icon.style.zIndex=20;
icon.style.color=color;
span.appendChild(icon);
document.getElementById('courtImage').appendChild(span);
shotList.push(type);
console.log('from the console, event function push posx '+posx+' and posy '+posy)
shotLocX.push(posx);
shotLocY.push(posy);
icon.style.position = 'absolute';
icon.style.top = (posy)+'%';
icon.style.left = (posx)+'%';
// icon.setAttribute('class','animated')
// span.style.textShadow = 18+'px'+18+'px'+18+'px'+'black';
// shotbox = window.document.getElementById('shotbox');
console.log(message);
console.log('shotLocX array: '+shotLocX);
window.document.getElementById('eventCoordsX').value=posx;
window.document.getElementById('eventCoordsY').value=posy;
//window.document.getElementById('shotType').value=type;
console.log('shotLocY array: '+shotLocY);
 //cancle()
}


/////////////////////////////////////////////////////////

function cancle(){
var shotbox = $('#shotbox');
console.log('cancle was clicked');
// console.log('shotList array: '+shotList);
// console.log('eventCount array: '+$eventCount);


			shotbox.addClass('animated fadeOutUp').one('animationend', 
				function(){
					$(this).removeClass('animated fadeOutUp');
					 shotbox.css('display','none');

				});
	}
//find target player to alter stats
function targetPlayer(type){

	function clickOnPlayer(e){
		if(type == 'made'){
			$event("fi-check", "green", "made was clicked event FUNCTION", "made")
		}else if(type=='miss'){
			$event("fi-x", "red", "X was clicked for a missed shot", "miss")
		}else if(type=='travel'){
			$event("fi-alert", "yellow", "Travel was clicked for a traveling call", "travel")
		}else if(type=='block'){
			$event("fi-pause", "yellow", "Block was clicked for a Blocked Shot", "block")
		}else if(type=='assist'){
			$event("fi-torsos", "#088da5", "Nice pass for the Assist! ", "assist")
		}else if(type=='rebound'){
			$event("fi-arrow-down", "#ff3300", "Nice Rebound!!! ", "rebound")
		}else if(type=='foul'){
			$event("fi-skull", "#ff3300", "Foul called on this", "foul")
		}else if(type=='freethrow'){
			$event("fi-marker", "#08a56f", "And one!! ", "freethrow")
		}else if(type=='steal'){
			$event("fi-shuffle", "#a52008", "Like taking candy from a baby! ", "steal")
		}else if(type=='three'){
			$event("fi-css3", "#a5088d", "Three pointer from DOWNTOWN!!! ", "three")
		}
		
		e.preventDefault()
		// $eventCount++;
		cancle();
		// console.log('target playerId: '+e.target.getAttribute('id'));
		// console.log('target player: '+e.target.getAttribute('name'));
		//console.log("This is a: "+shotList[$eventCount-1]);
		playerId = e.target.getAttribute('id');
		player = e.target.getAttribute('name');
		window.document.getElementById('homeTeamList').removeEventListener('click', clickOnPlayer, false);
		//window.document.getElementById('visitorTeamList').removeEventListener('click', clickOnPlayer, false);
		window.document.getElementById('playerId').value = playerId;
		window.document.getElementById('player').value = player;
		$submitEvent=window.document.getElementById('submitEvent');
		$submitEvent.click();
	}
	window.document.getElementById('homeTeamList').addEventListener('click', clickOnPlayer, false);
	//window.document.getElementById('visitorTeamList').addEventListener('click', clickOnPlayer, false);
	window.document.getElementById('visitorTeamList').removeEventListener('click', getStats, false);
	window.document.getElementById('homeTeamList').removeEventListener('click', getStats, false);
//console.log($eventCount +' event count from target player finction');
}

//logs events, and initiates events records
//var $eventCount=shotList.length-1;
	 var court = window.document.getElementById('court');
	 //var shotbox = $('#shotbox');
function hi(e){
	if ($('#shotbox').css('display') != 'block') {
			getHomeTeamEvents();
			//console.log("This is event number before "+$eventCount);
			//console.log("This is event number after "+$eventCount);
var offset = $('#court').offset();
		console.log('aloha');
		var pX = window.innerWidth/5;//resize the popup
		var pY = window.innerWidth/5;//resize the popup
		var posx = e.pageX-offset.left;
		var posy = e.pageY-offset.top;
			posx = parseInt(posx);
			posy = parseInt(posy);
		console.log(offset);
		console.log(posx+" "+posy);
	var	shotbox = document.getElementById('shotbox');
		shotbox.style.display = 'block';
		shotbox.style.height = 200+'px';
		shotbox.style.width = 200+'px';
		shotbox.style.top = (posy)+'px';
		shotbox.style.left = (posx)+'px';
		shotbox.style.zIndex = 100;
		shotbox.setAttribute('class','animated fadeInUp');
		
		// console.log(parseInt($('#shotbox').css('top').slice(0,-2))/$('#shotbox').parent().height()*100)
		// console.log(parseInt($('#shotbox').css('left').slice(0,-2))/$('#shotbox').parent().width()*100)
//		console.log($('#shotbox').parent().height())
		};
	}


minusMinuteBtn=window.document.getElementById('minusMinuteBtn');
plusMinuteBtn=window.document.getElementById('plusMinuteBtn');
minusSecondBtn=window.document.getElementById('minusSecondBtn');
plusSecondBtn=window.document.getElementById('plusSecondBtn');
rewindClockBtn=window.document.getElementById('rewindClockBtn');
fastForwardClockBtn=window.document.getElementById('fastForwardClockBtn');
playClockBtn=window.document.getElementById('playClockBtn');
stopClockBtn=window.document.getElementById('stopClockBtn');
pauseClockBtn=window.document.getElementById('pauseClockBtn');
startGameBtn=window.document.getElementById('startGameBtn');


	// document.addEventListener('mousemove', showCoords, false);		
	court.addEventListener('click', hi, false);
	// startGameBtn.addEventListener('click', getHomeTeamList, false);
	  minusMinuteBtn.addEventListener('click', minusMinute, false);
	  plusMinuteBtn.addEventListener('click', plusMinute, false);
	  minusSecondBtn.addEventListener('click', minusSecond, false);
	  plusSecondBtn.addEventListener('click', plusSecond, false);
	  rewindClockBtn.addEventListener('click', rewindClock, false);
	  playClockBtn.addEventListener('click', playClock, false);
	  // stopClockBtn.addEventListener('click', stopClock, false);
	  // pauseClockBtn.addEventListener('click', pauseClock, false);
	  fastForwardClockBtn.addEventListener('click', fastForwardClock, false);
	
	
