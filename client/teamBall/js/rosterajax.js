function getHomeTeamList(){
	var xhr = new XMLHttpRequest();

	xhr.onload = function(){
		if (xhr.status == 200) {
			document.getElementById('homeTeamList').innerHTML = xhr.responseText;	
		};
	};

	xhr.open('GET', 'getHomeTeam.php', true);
	xhr.send(null);
}