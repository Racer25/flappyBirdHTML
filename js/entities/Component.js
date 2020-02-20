class Component
{
	constructor(id, type, width, height, color, x, y, speedX, speedY, gravityBool, angle, cropBool)
	{
		this.type = type;
		if (this.type === "image" || this.type === "base")
		{
			this.image = new Image();
			this.image.src = color;
		}
		this.id = id;
		this.width = width;
		this.height = height;
		this.color = color;
		this.x = x;
		this.y = y;

		this.speedX = 0;
		if(speedX !== undefined)
		{
			this.speedX = speedX;
		}

		this.speedY = 0;
		if(speedY !== undefined)
		{
			this.speedY = speedY;
		}

		this.gravity = 0;
		if(gravityBool)
		{
			this.gravity = 0.1;
		}

		//Angle in radiant
		this.angle = angle * Math.PI / 180;
		this.cropBool = cropBool;
		this.determineTopLeftRighBottomCenter();
	}

	determineTopLeftRighBottomCenter()
	{
		this.top = this.x + this.height;
		this.left = this.x;
		this.right = this.x + this.width;
		this.top = this.y;
		this.bottom = this.y + this.height;
		this.centerX = this.left + this.width/2;
		this.centerY = this.top + this.height/2;
	}

	move()
	{
		if(this.speedY < 4)
		{
			this.speedY += this.gravity;
		}

		this.x += this.speedX;
		this.y += this.speedY;
		this.determineTopLeftRighBottomCenter();
		if (this.type === "base")
		{
			if (this.x === -(this.width))
			{
				this.x = 0;
			}
		}
	}

	stopMove()
	{
		this.speedX = 0;
		this.speedY = 0;
	}

	crashWith(otherComp)
	{
		return (this.bottom >= otherComp.top) &&
			(this.top <= otherComp.bottom) &&
			(this.right >= otherComp.left) &&
			(this.left <= otherComp.right);
	}

	alignedWith(otherComp)
	{
		return this.centerX === otherComp.centerX
	}
}