class Component
{
	constructor(id, type, width, height, color, x, y, speedX, speedY, gravityBool, angle)
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
			this.gravity = 0.2;
		}

		this.angle = angle;
		this.determineTopLeftRighBottom();
	}

	determineTopLeftRighBottom()
	{
		this.top = this.x + this.height;
		this.left = this.x;
		this.right = this.x + this.width;
		this.top = this.y;
		this.bottom = this.y + this.height;
	}

	move()
	{
		this.speedY += this.gravity;

		this.x += this.speedX;
		this.y += this.speedY;
		this.determineTopLeftRighBottom();
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
}