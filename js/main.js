//Global variable
let myGameArea;
let pressedKeys = [false, false, false, false];

window.onload = () =>
{
	startGame();
	window.addEventListener('keydown',  (e) =>
	{
		console.log("keydown", e.key);
		switch (e.key)
		{
			case "ArrowLeft":
				pressedKeys[0] = true;
				break;
			case "ArrowRight":
				pressedKeys[1] = true;
				break;
			case "ArrowUp":
				pressedKeys[2] = true;
				break;
			case "ArrowDown":
				pressedKeys[3] = true;
				break;
			default:
		}
		moveAccordingly();
	});

	window.addEventListener('keyup', function (e)
	{
		console.log("keyup", e.key);
		switch (e.key)
		{
			case "ArrowLeft":
				pressedKeys[0] = false;
				break;
			case "ArrowRight":
				pressedKeys[1] = false;
				break;
			case "ArrowUp":
				pressedKeys[2] = false;
				break;
			case "ArrowDown":
				pressedKeys[3] = false;
				break;
			default:
		}
		stopAccordingly();
	});
};

function moveAccordingly()
{
	if(pressedKeys[0])
	{
		moveleft();
	}
	if(pressedKeys[1])
	{
		moveright();
	}
	if(pressedKeys[2])
	{
		moveup();
	}
	if(pressedKeys[3])
	{
		movedown();
	}
}

function stopAccordingly()
{
	if(!pressedKeys[0] && !pressedKeys[1])
	{
		myGameArea.mainComponent.speedX = 0;
	}
	if(!pressedKeys[2] && !pressedKeys[3])
	{
		myGameArea.mainComponent.speedY = 0;
	}
}



function startGame()
{
	myGameArea = new GameArea("gameCanvas", 288,512 );
	myGameArea.run(20);
}

function moveup()
{
	myGameArea.mainComponent.speedY = -1;
}

function movedown()
{
	myGameArea.mainComponent.speedY = 1;
}

function moveleft()
{
	myGameArea.mainComponent.speedX = -1;
}

function moveright()
{
	myGameArea.mainComponent.speedX = 1;
}

function stopMove() {
	myGameArea.mainComponent.speedX = 0;
	myGameArea.mainComponent.speedY = 0;
}
