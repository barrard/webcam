
	shotList = [];
	shotLocX = [];
	shotLocY = [];

	function made(){

		var made = document.createElement("img");
		made.setAttribute('src', 'img/make.png');
		made.setAttribute('alt', 'Shot made');
		made.setAttribute('height', '10px');
		made.setAttribute('width', '10px');
		shotbox = window.document.getElementById('shotbox');
		posy = shotbox.style.top;
		posy = posy.slice(0, -2);
		posy = parseInt(posy);
		posy = posy + 45;
		posx = shotbox.style.left;
		posx = posx.slice(0, -2);
		posx = parseInt(posx);
		posx = posx + 45;
		made.style.position = 'absolute';
		made.style.top = posy +'px'; 
		made.style.left = posx +'px';
		made.style.background = 'green';
		console.log(posx);
		console.log(posy);
		made.style.zIndex=20;
		document.body.appendChild(made);
		shotList.push('made');
		shotLocX.push(posx);
		shotLocY.push(posy);
		shotbox = window.document.getElementById('shotbox');
		console.log('cancle');
		console.log(shotList);
		console.log(shotLocX);
		console.log(shotLocY);
		targetPlayer();

			shotbox.style.display = 'none';
	}
		function miss(){
			targetPlayer();
		var miss = document.createElement("img");
		miss.setAttribute('src', 'img/miss.png');
		miss.setAttribute('alt', 'Shot made');
		miss.setAttribute('height', '10');
		miss.setAttribute('width', '10');
		shotbox = window.document.getElementById('shotbox');
		posy = shotbox.style.top;
		posy = posy.slice(0, -2);
		posy = parseInt(posy);
		posy = posy + 5;
		posx = shotbox.style.left;
		posx = posx.slice(0, -2);
		posx = parseInt(posx);
		posx = posx + 5;
		miss.style.position = 'absolute';
		miss.style.top = (posy);
		miss.style.left = (posx);
		miss.style.zIndex=20;
		document.body.appendChild(miss);
		shotList.push('miss');
		shotLocX.push(posx);
		shotLocY.push(posy);
		miss.style.position = 'absolute';
		miss.style.top = (posy)+'px';
		miss.style.left = (posx)+'px';
		shotbox = window.document.getElementById('shotbox');
		console.log('X');
		console.log(shotList);
		console.log(shotLocX);
		console.log(shotLocY);

			shotbox.style.display = 'none';
			targetPlayer($target);
	}
		function cancel(){
		shotbox = window.document.getElementById('shotbox');
		console.log('cancle');
		console.log(shotList);


			shotbox.style.display = 'none';
	}
$eventCount = 0;
	 court = window.document.getElementById('court');
	function hi(e){
		if (shotbox.style.display != 'block') {
		$eventCount++;
		console.log($eventCount);
		console.log('FUUUUCK');
		console.log('aloha');
		var pX = window.innerWidth/4;//resize the popup
		var pY = window.innerWidth/4;//resize the popup
		var posx = e.layerX;
		var posy = e.layerY;
		shotbox = window.document.getElementById('shotbox');
		shotbox.style.display = 'block';
		shotbox.style.height = 100+'px';
		shotbox.style.width = 100+'px';
		shotbox.style.background = 'red';
		shotbox.style.position = 'absolute';
		shotbox.style.top = (posy-50)+'px';
		shotbox.style.left = (posx-50)+'px';
		shotbox.style.zIndex = 100;
		};
	}

function targetPlayer(){
	console.log("Target a player");
}

// function showCoords(e) {
//     var cX = e.clientX;
//     var sX = e.screenX;
//     var pX = e.pageX;
//     var pY = e.pageY;
//     var lX = e.layerX;
//     var lY = e.layerY;
//     var cY = e.clientY;
//     var sY = e.screenY;
//     var ox = e.offsetX;//set location of popup
// 	var oy = e.offsetY;//set location of popup

//     var coords1 = "cX: " + cX + "<br> Y c:" + cY;
//     var coords0 = "oX: " + ox + "<br> Y o:" + oy;
//     var coords2 = "screen - X: " + sX + ", Y s: " + sY;
//     var coords3 = "page - X: " + pX + ", Y p: " + pY;
//     var coords4 = "layer - X: " + lX + ", l p: " + lY;
//     document.getElementById("demo").innerHTML = coords1 + "<br>" + coords2+ "<br>" +coords3 + "<br>" + coords4 + "<br>" + coords0;
// }

	// document.addEventListener('mousemove', showCoords, false);		
	court.addEventListener('click', hi, false);

