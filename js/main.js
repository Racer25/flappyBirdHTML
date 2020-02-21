//Global variable
let myGameArea;
let ArrowUpKeyPressed;

window.onload = () =>
{
	startGame();
	window.addEventListener('keydown',  (e) =>
	{
		console.log("keydown", e.key);
		if(e.key === "ArrowUp" && !ArrowUpKeyPressed)
		{
			moveUp();
			ArrowUpKeyPressed = true;
		}
	});

	window.addEventListener('keyup',  (e) =>
	{
		ArrowUpKeyPressed = false;
	});
};

function startGame()
{
	myGameArea = new GameArea("gameCanvas", 288,512 );
	myGameArea.run(10);
}

function moveUp()
{
	myGameArea.mainComponent.moveUp();
}

function stopMove() {
	myGameArea.mainComponent.speedX = 0;
	myGameArea.mainComponent.speedY = 0;
}
