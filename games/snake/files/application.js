///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////Canvas snake game by Rio-de-Janeiro (c) 2013 gta4rio@gmail.com/////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
var gameOverWallText = 'You hit the wall</br>Your score: '+gScore+'</br>Restart game to try it again.';
var gameOverHimselfText = 'You hit the himself.</br>Your score: '+gScore+'</br>Restart game to try it again.';
var gridColor = "#c9c9c9";
var snakeColor = "green";
var commonFoodColor = "red";
var uncommonFoodColor = "blue";
var backgroundColor = "#ffffff"; //c0cd02
var pixelColor = "#615600";

var gDrawingContext, gCanvasElement, gStopwatchElement;
var gameSpeed = 130;
var dGameSpeed = 50;
var kBoardWidth = 40; 
var kBoardHeight= 20;
var kMinBoardSize=4;
var kPieceWidth = 21;
var kPieceHeight= 21;
var kPixelWidth = 1 + (kBoardWidth * kPieceWidth);
var kPixelHeight= 1 + (kBoardHeight * kPieceHeight);
var gridOn = false;
var wallsOn = true;
var gSnake = [];
var gCommonFood;
var gUncommonFood = [];
var commonFoodScore = 10;
var uncommonFoodScore = 25;
var isThereCommonFood = false;
var isThereUncommonFood = false;
var uncommonFoodCounter = 0;
var shouldSnakeGrow = 0;
var snakeLength = 3;
var snakeGrowCommonLength = 2;
var snakeGrowUncommonLength = 4;
var uncommonDelay = 3;
var uncommonFoodTime = 5; // in seconds
var dUncommonFoodTime = 2;
var uncommonFoodType = 1;
var snakeMoveWay = "right";
var gameInProgress = false;
var gScore = 0;
var h = 0, s = 0, min = 0;
var timeUncommonFoodMade = 0;

var gameTimer;
var timer; //stopwatch
var firstStart = 1;

function Cell(column, row) {
    this.row = row;
    this.column = column;
}

function snakeKeydown(e){
	if ((e.keyCode == 37 || e.keyCode == 65) && snakeMoveWay != "right"){ snakeMoveWay = "left";} //left
	else if ((e.keyCode == 38 || e.keyCode == 87) && snakeMoveWay != "down"){ snakeMoveWay = "up";} //up
	else if ((e.keyCode == 40 || e.keyCode == 83) && snakeMoveWay != "up"){ snakeMoveWay = "down";} //down
	else if ((e.keyCode == 39 || e.keyCode == 68) && snakeMoveWay != "left"){ snakeMoveWay = "right";} //right
	else if (e.keyCode == 32){ pauseGame(true);} //backspace
}
function initGame(canvasElement, scoreCountElement, stopwatchElement) {
    if (!canvasElement) {
        canvasElement = document.createElement("canvas");
		canvasElement.id = "snake_canvas";
		canvasElement.style.margin = "0 0 0 -"+kPixelWidth/2+"px";
		document.body.appendChild(canvasElement);
    }
    gCanvasElement = canvasElement;
    gCanvasElement.width = kPixelWidth;
    gCanvasElement.height = kPixelHeight;
	document.addEventListener("keydown", snakeKeydown, false);
	if (document.getElementById("preview-frame")) {document.getElementById("preview-frame").addEventListener("keydown", snakeKeydown, false);}
    gScoreCountElem = scoreCountElement;
	gStopwatchElement = stopwatchElement;
    gDrawingContext = gCanvasElement.getContext("2d");
	newGame();
}
function newGame() {
	gameInProgress = true;
	gScoreCountElem.innerHTML = gScore;
	gSnake = [];
	snakeLength = 3;
	gSnake[0] = new Cell(5,4);
	gSnake[1] = new Cell(4,4);
	gSnake[2] = new Cell(3,4);
	isThereCommonFood = false;
	isThereUncommonFood = false;
	snakeMoveWay = "right";
    drawBoard();
	gStopwatchElement.innerHTML = "00:00:00";
	document.getElementById("uncommonfood").innerHTML = uncommonFoodTime;
	clearInterval(timer);
	clearInterval(gameTimer);
	stopwatch();
	message(false,"");
	gameClock();
	if (firstStart == 1) {pauseGame(); message(true,'Use W, A, S, D or &#8593;, &#8595;, &#8592;, &#8594; </br>to control snake.</br> Backspace to pause or resume game.</br>');firstStart = 2;}
}

function gameOver(way){
	clearInterval(gameTimer);
	clearInterval(timer);
	gameInProgress = false;
	if (way == "wall") { 
		gameOverWallText = 'You hit the wall.</br>Your score: '+gScore+'.</br>Restart game to try it again.';
		message(true, gameOverWallText);}
	if (way == "himself") { 
		gameOverHimselfText = 'You hit the himself.</br>Your score: '+gScore+'.</br>Restart game to try it again.';
		message(true, gameOverHimselfText);}
	
}
function gameClock(){
	gameTimer = setInterval(
		function(){
			if (shouldSnakeGrow!=0){growSnake();}
			moveSnake();
			if (isThereUncommonFood) {
				if ((timeUncommonFoodMade + uncommonFoodTime) == (3600*h + 60*min + s)) {
					isThereUncommonFood = false; uncommonFoodCounter = 0;
				}
			}
			checkMove();
			if (!gameInProgress) {return;}
			drawBoard();
		},gameSpeed);
}
function moveSnake(){
	if (!gameInProgress) {return;}
	for(var i=snakeLength-1;i>0;i--){
		gSnake[i].column = gSnake[i-1].column; gSnake[i].row = gSnake[i-1].row;
	}
	switch(snakeMoveWay){
		case "left":  gSnake[0].column--; break;
		case "right": gSnake[0].column++; break;
		case "down":  gSnake[0].row++;    break;
		case "up":    gSnake[0].row--;    break;
	}
}

function makeCommonFood(){
	var fail = true;
	var x; var y;
	while(fail){
		x = getRandom(0,kBoardWidth);
		y = getRandom(0,kBoardHeight);
		fail = false;
		for (var i=0;i<snakeLength;i++)
		{
			if(gSnake[i].column == x && gSnake[i].row == y) {fail = true; break;}
		}
	}
	gCommonFood = new Cell(x,y);
	var color = getRandom(1,6);
	switch (color){
		case 1: commonFoodColor = "#ef1515"; break;
		case 2: commonFoodColor = "#2424ff"; break;
		case 3: commonFoodColor = "#ff9517"; break;
		case 4: commonFoodColor = "#ed30e6"; break; // orchid
		case 5: commonFoodColor = "#39d5f6"; break; // light blue indigo
	}
	isThereCommonFood = true;
}
function makeUncommonFood(){
	var fail = true;
	var x; var y;
	while(fail){
		x = getRandom(0,kBoardWidth-1);
		y = getRandom(0,kBoardHeight);
		fail = false;
		for (var i=0;i<snakeLength;i++)
		{
			if((gSnake[i].column == x || gSnake[i].column == x+1) && gSnake[i].row == y) {fail = true; break;}
		}
	}
	gUncommonFood[0] = new Cell(x,y);
	gUncommonFood[1] = new Cell(x+1,y);
	document.getElementById("uncommonfood").innerHTML = uncommonFoodTime;
	uncommonFoodType = getRandom (1,4);
	isThereUncommonFood = true;
	timeUncommonFoodMade = 3600*h + 60*min + s;
}

function checkMove(){
	if (wallsOn){
		if (gSnake[0].column<0 || gSnake[0].column>kBoardWidth-1 || gSnake[0].row<0 || gSnake[0].row>kBoardHeight-1){
			gameOver('wall');
		}
	}
	for (var i=snakeLength-1;i>2;i--)
		{
			if(gSnake[i].column == gSnake[0].column && gSnake[i].row == gSnake[0].row) {gameOver('himself'); break;}
		}
	if (gSnake[0].column == gCommonFood.column && gSnake[0].row == gCommonFood.row) {
		gScore += commonFoodScore;
		uncommonFoodCounter++;
		gScoreCountElem.innerHTML = gScore;
		isThereCommonFood = false;
		shouldSnakeGrow = snakeGrowCommonLength;
	}	
	if (isThereUncommonFood){
		if ((gSnake[0].column == gUncommonFood[0].column || gSnake[0].column == gUncommonFood[1].column) && gSnake[0].row == gUncommonFood[0].row) {
			gScore += uncommonFoodScore;
			uncommonFoodCounter = 0;
			gScoreCountElem.innerHTML = gScore;
			isThereUncommonFood = false;
			shouldSnakeGrow = snakeGrowUncommonLength;
		}	
	}
}
function growSnake(){
	snakeLength+=shouldSnakeGrow;
	var x = gSnake.length - 1; 
	for (var i=snakeLength-1;i>x;i--){
		gSnake[i] = new Cell(gSnake[x].column,gSnake[x].row);
	}
	shouldSnakeGrow = 0;
}

function drawBoard(noChanges) {	
    gDrawingContext.clearRect(0, 0, kPixelWidth, kPixelHeight);
	gDrawingContext.fillStyle = backgroundColor;
	gDrawingContext.fillRect(0, 0, kPixelWidth, kPixelHeight);
    gDrawingContext.beginPath();
    if (gridOn){
		for (var x = 0; x <= kPixelWidth; x += kPieceWidth) {
			gDrawingContext.moveTo(0.5 + x, 0);
			gDrawingContext.lineTo(0.5 + x, kPixelHeight);
		}

		for (var y = 0; y <= kPixelHeight; y += kPieceHeight) {
			gDrawingContext.moveTo(0, 0.5 + y);
			gDrawingContext.lineTo(kPixelWidth, 0.5 +  y);
		}
	}
	if (!gridOn) {
			gDrawingContext.moveTo(0.5, 0);
			gDrawingContext.lineTo(0.5, kPixelHeight);
			gDrawingContext.moveTo(0, 0.5);
			gDrawingContext.lineTo(kPixelWidth, 0.5);
			gDrawingContext.moveTo(kPixelWidth - 0.5, 0);
			gDrawingContext.lineTo(kPixelWidth - 0.5, kPixelHeight);
			gDrawingContext.moveTo(0, kPixelHeight - 0.5);
			gDrawingContext.lineTo(kPixelWidth, kPixelHeight - 0.5);
	
	}
    gDrawingContext.closePath();
    gDrawingContext.strokeStyle = gridColor;
    gDrawingContext.stroke();
	drawSnakeHead(gSnake[0]);
	for(var i=1; i<snakeLength; i++){drawSnake(gSnake[i]);}
	if (!isThereCommonFood) {makeCommonFood();}
	if (isThereUncommonFood == false && uncommonFoodCounter == uncommonDelay) {makeUncommonFood();}
	drawCommonFood(gCommonFood);
	if (isThereUncommonFood) {drawUncommonFood(gUncommonFood[0]); document.getElementById("uncommonfoodcontainer").style.display = "inline";}
		else {document.getElementById("uncommonfoodcontainer").style.display = "none";}
}
function drawSnakeHead(p) {
	var dx = 1; var dy = 1;
    var x = (p.column * kPieceWidth);
    var y = (p.row * kPieceHeight);
    var a = Math.floor((kPieceWidth - 2)/3);
	gDrawingContext.fillStyle = snakeColor;
	for (var i=1; i<=3; i++){
		for (var j=1; j<=3; j++){
			gDrawingContext.fillRect(x+dx*i+a*(i-1), y+dy*j+a*(j-1), a, a);
		}
	}
	//Drawing head
	gDrawingContext.fillStyle = "#c90b0b";
	switch(snakeMoveWay){
	case "right":
			gDrawingContext.fillRect(x+3*dx+2*a, y+2*dy+a,a,a);
			gDrawingContext.fillStyle = "#000000";
			gDrawingContext.fillRect(x+dx, y+dy,a,a);
			gDrawingContext.fillRect(x+dx, y+3*dy+2*a,a,a); break;
	case "left":
			gDrawingContext.fillRect(x+dx, y+2*dy+a,a,a);
			gDrawingContext.fillStyle = "#000000";
			gDrawingContext.fillRect(x+3*dx+2*a, y+dy,a,a);
			gDrawingContext.fillRect(x+3*dx+2*a, y+3*dy+2*a,a,a); break;
	case "up":
			gDrawingContext.fillRect(x+2*dx+a, y+dy,a,a);
			gDrawingContext.fillStyle = "#000000";
			gDrawingContext.fillRect(x+dx, y+3*dy+2*a,a,a);
			gDrawingContext.fillRect(x+3*dx+2*a, y+3*dy+2*a,a,a); break;
	case "down":
			gDrawingContext.fillRect(x+2*dx+a, y+3*dy+2*a,a,a);
			gDrawingContext.fillStyle = "#000000";
			gDrawingContext.fillRect(x+dx, y+dy,a,a);
			gDrawingContext.fillRect(x+3*dx+2*a, y+dy,a,a);
	}
}
function drawSnake(p) {
	var dx = 1; var dy = 1;
    var x = (p.column * kPieceWidth);
    var y = (p.row * kPieceHeight);
    var a = Math.floor((kPieceWidth - 2)/3);
	gDrawingContext.fillStyle = snakeColor;
	for (var i=1; i<=3; i++){
		for (var j=1; j<=3; j++){
			gDrawingContext.fillRect(x+dx*i+a*(i-1), y+dy*j+a*(j-1), a, a);
		}
	}
}

function drawCommonFood(p){
	var a = Math.floor((kPieceWidth - 2)/3);
    var x = (p.column * kPieceWidth);
    var y = (p.row * kPieceHeight);
	var dx = kPieceWidth/3;
	var dy = kPieceHeight/3;
	gDrawingContext.fillStyle = commonFoodColor;
	gDrawingContext.fillRect(x+1+dx, y+1, a, a);
		gDrawingContext.fillRect(x+1+dx, y+1+2*dy, a, a);
		gDrawingContext.fillRect(x+1, y+1+dy, a, a);
		gDrawingContext.fillRect(x+1+2*dx, y+1+dy, a, a);
	gDrawingContext.fillStyle = "#ffe404";
		gDrawingContext.fillRect(x+dx+1, y+dy+1, a, a);
	
}
function drawUncommonFood(p){
	var a = Math.floor((kPieceWidth - 2)/3);
    var x = (p.column * kPieceWidth);
    var y = (p.row * kPieceHeight);
	var dx = kPieceWidth/3;
	var dy = kPieceHeight/3;
	switch(uncommonFoodType){
		case 1:	gDrawingContext.fillStyle = "#77450f";
				gDrawingContext.fillRect(x+1, y+1, a, a);
				for(var i=0;i<=5;i++){gDrawingContext.fillRect(x+1+i*dx, y+1+dy, a, a);}
				gDrawingContext.fillRect(x+1+dx, y+1+2*dy, a, a);
				gDrawingContext.fillRect(x+1+3*dx, y+1+2*dy, a, a);
				gDrawingContext.fillRect(x+1+5*dx, y+1+2*dy, a, a);
				break;
		case 2:	gDrawingContext.fillStyle = "#9a9a9a";
				gDrawingContext.fillRect(x+1, y+1, a, a);
				gDrawingContext.fillRect(x+1+3*dx, y+1, a, a);
				gDrawingContext.fillRect(x+1+4*dx, y+1, a, a);
				for(var i=1;i<=5;i++){gDrawingContext.fillRect(x+1+i*dx, y+1+dy, a, a);}
				gDrawingContext.fillRect(x+1+2*dx, y+1+2*dy, a, a);
				gDrawingContext.fillRect(x+1+4*dx, y+1+2*dy, a, a);
				break;
		case 3:	gDrawingContext.fillStyle = "#3254b5";
				gDrawingContext.fillRect(x+1+1*dx, y+1, a, a);
				gDrawingContext.fillRect(x+1+2*dx, y+1, a, a);
				gDrawingContext.fillRect(x+1+5*dx, y+1, a, a);
				gDrawingContext.fillRect(x+1+0*dx, y+1+dy, a, a);
				for(var i=2;i<=5;i++){gDrawingContext.fillRect(x+1+i*dx, y+1+dy, a, a);}
				for(var i=1;i<=4;i++){gDrawingContext.fillRect(x+1+i*dx, y+1+2*dy, a, a);}
	}
}

function getRandom(min, max)
{
  return Math.floor(Math.random() * (max - min) + min);
}

/****Main stopwatch****/
function stopwatch(){
	var sh="00", ss="00", smin="00";
	h = 0, s = 0, min = 0;
		timer = setInterval(
			function () {
				if (!gameInProgress) {return;}
				s++;
				if (s==60) {min++; s = 0; if (min<10) {smin="0"+min} else {smin = min}}
				if (min==60) {h++; min = 0; if (h<10) {sh="0"+h} else {sh = h}}
				if (s>=10) {ss = s} else {ss="0"+s};
				gStopwatchElement.innerHTML = sh+":"+smin+":"+ss;
				if (isThereUncommonFood) {
					document.getElementById("uncommonfood").innerHTML = uncommonFoodTime - 3600*h - 60*min - s + timeUncommonFoodMade;
				}},
			1000);
}

function changePieceSize(way){
	if (way) {
		if (document.getElementById('minus_button').disabled == true){document.getElementById('minus_button').disabled == false;}
		kPieceWidth +=3; kPieceHeight +=3; 
		kPixelWidth = 1 + (kBoardWidth * kPieceWidth); kPixelHeight= 1 + (kBoardHeight * kPieceHeight); numberSize = 0.6*kPieceWidth;
		gCanvasElement.width = kPixelWidth;
		gCanvasElement.height = kPixelHeight;
		document.getElementById("snake_canvas").style.margin = "0 0 0 -"+kPixelWidth/2+"px";
		}
	if (!way){
		if (kPieceWidth - 3 <10) {document.getElementById('minus_button').disabled = true; return;}
		kPieceWidth -=3; kPieceHeight -=3; 
		kPixelWidth = 1 + (kBoardWidth * kPieceWidth); kPixelHeight= 1 + (kBoardHeight * kPieceHeight); numberSize = 0.6*kPieceWidth;
		gCanvasElement.width = kPixelWidth;
		gCanvasElement.height = kPixelHeight;
		document.getElementById("snake_canvas").style.margin = "0 0 0 -"+kPixelWidth/2+"px";
		}
	drawBoard(true);
}
var level = "Normal";
function changeLevel(way){
	if (way){
		if (level == "Normal") {
			document.getElementById("level").innerHTML = "Hard"; 
			level = "Hard";
			gameSpeed -= dGameSpeed;
			document.getElementById('level_up_button').disabled == true;
			uncommonFoodTime -= dUncommonFoodTime;
			newGame();
			}
		if (level == "Simple") {
			document.getElementById("level").innerHTML = "Normal";
			level = "Normal";
			gameSpeed -= dGameSpeed;
			document.getElementById('level_down_button').disabled == false;
			uncommonFoodTime -= dUncommonFoodTime;
			newGame();
		}
	}
	if (!way){
		if (level == "Normal") {
			document.getElementById("level").innerHTML = "Simple"; 
			level = "Simple";
			gameSpeed += dGameSpeed;
			document.getElementById('level_down_button').disabled == true;
			uncommonFoodTime += dUncommonFoodTime;
			newGame();
			}
		if (level == "Hard") {
			document.getElementById("level").innerHTML = "Normal";
			level = "Normal";
			gameSpeed += dGameSpeed;
			document.getElementById('level_up_button').disabled == false;
			uncommonFoodTime += dUncommonFoodTime;
			newGame();
		}
	}

}
function message(way, text){
	if (way){
		document.getElementById("message").style.display = 'inline';
		document.getElementById("close_button").style.display = 'inline';
		document.getElementById("message").innerHTML = text;
	}
	if (!way){
		document.getElementById("message").style.display = 'none';
		document.getElementById("close_button").style.display = 'none';
	}
}

function pauseGame(){
	if (gameInProgress) {
		gameInProgress = false; document.getElementById('pauseicon').className = "icon icon10";
		document.getElementById("pausebutton").title = "Resume game";
		} 
		else {
			gameInProgress = true; document.getElementById('pauseicon').className = "icon icon9";
			document.getElementById("pausebutton").title = "Pause game";
			}
	if (firstStart == 2) {
		document.getElementById('starttext').style.display = "none";
		document.getElementById("pausebutton").className = "button";
		document.getElementById("pausebutton").title = "Pause game";			
		firstStart = 0;
		message(false,"");
		}
	if (firstStart == 1) {document.getElementById("pausebutton").title = "Start game"; }
}
