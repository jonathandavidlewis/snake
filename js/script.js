var s;
var grid = 20;
var snack; 
var score = 0;

var gameArea = {
	top: 0,
	left: 0,
	bottom: 600,
	right: 600,
	width: function () {
		return gameArea.right - gameArea.left;
	},
	height: function () {
		return gameArea.bottom - gameArea.top;
	}
};

function setup() {
	createCanvas(600, 600);
	s = new Snake();
	frameRate(10);
	addSnack();
}

function draw() {
  background(51);

  s.update();
  s.die();
  s.show();

  if (s.eat(snack)) {
  	addSnack();
  }
  fill(...snack.color);
  rect(snack.x, snack.y, grid, grid);
}

function showSnack() {
	createRandomSnackColor();
}

function createRandomSnackColor() {
	return [random(50, 220), random(50, 220), random(50, 220)];
}

function addPoint() {
	score += 1;
	updateScore(score);
}



function updateScore(score) {
	document.getElementById('score').innerHTML = score.toString();
}


// adds a snack on the game area.

function addSnack() {
	var columns = floor( width / grid );
	var rows = floor( height / grid );
	snack = createVector(floor(random(columns)), floor(random(rows)));
	snack.mult(grid);
	snack.color = createRandomSnackColor();
}

/* Game controls */

window.addEventListener('keydown', function(key) {
	console.log(key.keyCode);
	if ( key.keyCode === 37 && s.xspeed !== 1) {
		s.direction( -1, 0 );
	} else if ( key.keyCode === 38 && s.yspeed !== 1) {
		s.direction( 0, -1 );
	} else if ( key.keyCode === 39 && s.xspeed !== -1) {
		s.direction( 1, 0 );
	} else if ( key.keyCode === 40 && s.yspeed !== -1) {
		s.direction( 0, 1 );
	}
});


/*
Below is the snake constructor.
*/

function Snake() {
	this.x = 0;
	this.y = 0;
	this.xspeed = 1;
	this.yspeed = 0;
	this.total = 0;
	this.tail = [];

	this.direction = function( x, y ) {
		this.xspeed = x;
		this.yspeed = y;
	};

	this.eat = function() {
		console.dir(this.tail);
		var d = dist(this.x, this.y, snack.x, snack.y);
		if (d < 2) {
			this.total++;
			addPoint();
			return true;
		} else {
			return false;
		}
	};

	this.die = function() {
		var isOutOfBounds = (this.x < gameArea.left || this.x > gameArea.right - grid || this.y < gameArea.top || this.y > gameArea.bottom - grid);
		if (isOutOfBounds) {
			alert("You hit the wall!");
			this.resetGame();
		}	
		for (var i = 0; i < this.tail.length; i++ ) {
			var d = dist(this.x, this.y, this.tail[i].x, this.tail[i].y);
			if (d < 2) {
				alert("Don't eat yourself!");
				this.resetGame();
			}
		}
	};

	this.update = function() {
		if (this.total === this.tail.length) {
			for ( var i = 0; i < this.total-1; i++ ) {
				this.tail[ i ] = this.tail[ i + 1 ];
			}
		}
		this.tail[ this.total - 1 ] = createVector( this.x, this.y );

		this.x += this.xspeed * grid;
		this.y += this.yspeed * grid;
	};

	this.show = function() {
		fill(255);
		rect(this.x, this.y, grid, grid);
		for ( var i = 0; i < this.total; i++ ) {
			rect( this.tail[ i ].x, this.tail[ i ].y, grid, grid );

		}
	};
	this.resetGame = function() {
		score = 0;
		this.total = 0;
		this.tail = [];
		this.x = 0;
		this.y = 0;
		this.xspeed = 1;
		this.yspeed = 0;
		updateScore(score);
	};
}

