class GameArea
{
	constructor(idCanvas, width, height)
	{
		this.canvas = document.getElementById("gameCanvas");
		this.canvas.width = width;
		this.canvas.height = height;
		this.context = this.canvas.getContext("2d");
		this.components = [];
		this.mainComponent = null;
		this.scoreComponent = null;
		this.myObstacles = [];
		this.frameNo = 0;
		this.interval = null;

		let baseWidth = 336;
		this.baseHeight = 112;


		//Components
		const scoreComponent = new Component("score", "text", "30px", "Consolas", "black", 280, 40, 0, 0, false, 0);
		this.addComponent(scoreComponent);
		this.selectScoreComponent(scoreComponent);


		const backgroundComponent = new Component("background", "image", this.canvas.width, this.canvas.height, "./assets/sprites/background-day.png", 0, 0, 0, 0, false, 0);
		this.addComponent(backgroundComponent);

		const baseComponent = new Component("base", "base", 336, 112, "./assets/sprites/base.png", 0, this.canvas.height - this.baseHeight, -1, 0, false, 0);
		this.addComponent(baseComponent, true);

		const mainComponent = new Component("bird", "image", 34, 24, "./assets/sprites/yellowbird-midflap.png", 10, 120, 0, 0, true, 0);
		this.addComponent(mainComponent);
		this.selectMainComponent(mainComponent);

		//Sounds
		this.soundHit = new Sound("./assets/audio/hit.wav");
	}

	run(milli)
	{
		//Using () => this.update instead of  this.update to have the good this
		this.interval = setInterval(() => this.update(), milli);
	}

	stop()
	{
		clearInterval(this.interval);
	}

	addComponent(comp, isObstacle)
	{
		this.components.push(comp);
		if(isObstacle)
		{
			this.myObstacles.push(comp);
		}

	}

	selectMainComponent(comp)
	{
		this.mainComponent = comp;
	}

	selectScoreComponent(comp)
	{
		this.scoreComponent = comp;
	}

	findComponent(id)
	{
		return this.components.find(comp => comp.id === id);
	}

	drawComponent(comp)
	{
		//Rotation init
		if(comp.angle !== 0)
		{
			this.context.save();
			this.context.translate(comp.x, comp.y);
			this.context.rotate(comp.angle);
		}

		if (comp.type === "text")
		{
			this.context.font = comp.width + " " + comp.height;
			this.context.fillStyle = comp.color;
			this.context.fillText(comp.text, comp.x, comp.y);
		}
		else  if (comp.type === "image" || comp.type === "base")
		{
			this.context.drawImage(comp.image, comp.x, comp.y, comp.width, comp.height);
			if (comp.type === "base")
			{
				this.context.drawImage(comp.image, comp.x + comp.width, comp.y, comp.width, comp.height);
			}
		}
		else
		{
			this.context.fillStyle = comp.color;
			this.context.fillRect(comp.x, comp.y, comp.width, comp.height);
		}

		//Rotation end
		if(comp.angle !== 0)
		{
			this.context.restore();
		}

	}

	clear()
	{
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	everyInterval(n)
	{
		return (this.frameNo / n) % 1 === 0;
	}

	update()
	{
		//Verify collisions
		let isACollision = this.checkCollision();

		//Continue?
		if (isACollision)
		{
			this.soundHit.play();
			this.stop();
		}
		else
		{
			//Clear screen
			this.clear();

			//Frameid
			this.frameNo++;

			//this.hitBottom(this.mainComponent);

			//Handle obstacles
			this.handleObstacles();

			this.scoreComponent.text = "SCORE: " + myGameArea.frameNo;

			//Update screen
			this.components.map(elem =>
			{
				console.log();
				elem.move();
				this.drawComponent(elem)
			});
		}
	}

	checkCollision()
	{
		for (let i = 0; i < this.myObstacles.length; i++)
		{
			if (this.mainComponent.crashWith(this.myObstacles[i]))
			{
				return true;
			}
		}
		return false;
	}

	handleObstacles()
	{

		//Handling obstacles
		if (this.frameNo === 1 || this.everyInterval(150))
		{
			let minHeight = (this.canvas.height - this.baseHeight)/3;
			let maxHeight = 2*(this.canvas.height - this.baseHeight)/3;
			let height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
			let gap = (this.canvas.height - this.baseHeight)/3;

			this.addComponent(new Component("green", "image", 52, height,
				"./assets/sprites/pipe-green.png", this.canvas.width, 0, -1, 0, false, 0), true);

			this.addComponent(new Component("green", "image", 52, this.canvas.height- this.baseHeight - height - gap,
				"./assets/sprites/pipe-green.png", this.canvas.width, height + gap, -1, 0, false, 0), true);
		}
	}

	hitBottom(comp)
	{
		let rockbottom = this.canvas.height - this.baseHeight;
		if (comp.y > rockbottom)
		{
			comp.y = rockbottom;
		}
	}

}