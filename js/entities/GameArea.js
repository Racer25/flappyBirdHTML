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
		this.pipesTop = [];
		this.pipesBottom = [];
		this.frameNo = 0;
		this.interval = null;
		this.score = 0;

		this.indexPathImageBird = 0;
		this.arrayPathImageBird = ["./assets/sprites/yellowbird-downflap.png", "./assets/sprites/yellowbird-midflap.png", "./assets/sprites/yellowbird-upflap.png"];

		let baseWidth = 336;
		this.baseHeight = 112;


		//Components
		const backgroundComponent = new Component("background", "image", this.canvas.width, this.canvas.height, "./assets/sprites/background-day.png", 0, 0, 0, 0, false, 0, false);
		this.addComponent(backgroundComponent);

		const baseComponent = new Component("base", "base", 336, 112, "./assets/sprites/base.png", 0, this.canvas.height - this.baseHeight, -1, 0, false, 0, false);
		this.addComponent(baseComponent, true);

		const mainComponent = new Component("bird", "image", 34, 24, "./assets/sprites/yellowbird-midflap.png", 75, 120, 0, 0, true, 0, false);
		this.addComponent(mainComponent);
		this.selectMainComponent(mainComponent);

		const scoreComponent = new Component("score", "text", "30px", "Consolas", "black", 10, 40, 0, 0, false, 0, false);
		this.addComponent(scoreComponent);
		this.selectScoreComponent(scoreComponent);

		//Sounds
		this.soundHit = new Sound("./assets/audio/hit.wav");
		this.soundPoint = new Sound("./assets/audio/point.wav");
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

	addComponent(comp, isObstacle, isPipeTop, isPipeBottom)
	{
		if(isObstacle && (isPipeTop || isPipeBottom))
		{
			this.myObstacles.push(comp);
			this.components.splice(this.components.length - 2, 0, comp);
		}
		else
		{
			this.components.push(comp);
		}
		if(isPipeTop)
		{
			this.pipesTop.push(comp);
		}
		if(isPipeBottom)
		{
			this.pipesBottom.push(comp);
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
		let compX = comp.x;
		let compY = comp.y;
		if(comp.angle !== 0)
		{
			this.context.save();
			this.context.translate(comp.centerX, comp.centerY);
			this.context.rotate(comp.angle);
			//compX = - comp.width / 2;
			//compY = - comp.height / 2;
		}

		if (comp.type === "text")
		{
			this.context.font = comp.width + " " + comp.height;
			this.context.fillStyle = comp.color;
			this.context.fillText(comp.text, compX, compY);
		}
		else  if (comp.type === "image" || comp.type === "base")
		{
			this.context.drawImage(comp.image, compX, compY, comp.width, comp.height);
			if (comp.type === "base")
			{
				this.context.drawImage(comp.image, compX + comp.width, compY, comp.width, comp.height);
			}
		}
		else
		{
			this.context.fillStyle = comp.color;
			this.context.fillRect(compX, compY, comp.width, comp.height);
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

			this.scoreComponent.text = "SCORE: " + this.score;

			//Update screen
			this.components.map(elem =>
			{
				elem.move();
				this.drawComponent(elem)
			});

			//Check of score change
			if(this.checkAlignement())
			{
				this.soundPoint.play();
			}

			//Update image of mainComponent
			this.checkUpdateMainComponentImage();
		}
	}

	getBirdView()
	{
		let height = this.mainComponent.y;
		let distancesXFromPipes = this.pipesTop.map( pipe => (this.mainComponent.left > pipe.right ? Math.abs(this.mainComponent.right - pipe.left) : Infinity));
		let indexNearestPipe =  distancesXFromPipes.indexOf(Math.min(...distancesXFromPipes));
		let nearestTopPipe = this.pipesTop.filter((elem, index, array) => index === indexNearestPipe);
		let nearestBottomPipe = this.pipesBottom.filter((elem, index, array) => index === indexNearestPipe);

		let distanceXFromNearestPipe = distancesXFromPipes[indexNearestPipe];
		let distanceYFromNearestTopPipe = Math.abs(this.mainComponent.y - nearestTopPipe.bottom);
		let distanceYFromNearestBottomPipe = Math.abs(this.mainComponent.y - nearestBottomPipe.top);

		return {
			birdHeight: this.mainComponent.y,
			distanceXFromNearestPipe,
			distanceYFromNearestTopPipe,
			distanceYFromNearestBottomPipe

		}

	}

	checkUpdateMainComponentImage()
	{
		if (this.frameNo === 1 || this.everyInterval(12))
		{
			this.indexPathImageBird++;
			if(this.indexPathImageBird >= this.arrayPathImageBird.length)
			{
				this.indexPathImageBird = 0;
			}
			this.mainComponent.image.src = this.arrayPathImageBird[this.indexPathImageBird];
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

	checkAlignement()
	{
		for (let i = 0; i < this.pipesTop.length; i++)
		{
			if (this.mainComponent.alignedWith(this.pipesTop[i]))
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
				"./assets/sprites/pipe-green.png", this.canvas.width, 0, -1, 0, false, 0, false), true, true, false);

			this.addComponent(new Component("green", "image", 52, this.canvas.height- this.baseHeight - height - gap,
				"./assets/sprites/pipe-green.png", this.canvas.width, height + gap, -1, 0, false, 0, true), true, true, false);
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