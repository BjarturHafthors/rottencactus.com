window.Player = (function() {
	'use strict';

	var Controls = window.Controls;

	// All these constants are in em's, multiply by 10 pixels
	// for 1024x576px canvas.
	var FALLSPEED = 30;
	var JUMPSPEED = 75;
	var WIDTH = 8;
	var HEIGHT = 8;
	var GROUND_HEIGHT = 5;
	var INITIAL_POSITION_X = 30;
	var INITIAL_POSITION_Y = 25;
	var SCORE_DELAY = true;
	var OBS_WIDTH = 12;

	var Player = function(el, game) {
		this.el = el;
		this.game = game;
		this.pos = { x: 0, y: 0 };
		this.score = 0;
		this.highScore = 0;
		this.character = this.el.find('.Character');
		this.wings = this.el.find('.Wings');
		this.isFlapping = false;
		this.flapTime = (new Date()).getTime();

		this.scoreSound = new Audio('SimmiBird/sound/score.wav');
		this.scoreSound.currentTime=0;
		this.flap = new Audio('SimmiBird/sound/flap.mp3');
		this.flap.currentTime=0;
		this.collide = new Audio('SimmiBird/sound/collide.mp3');
		this.collide.currentTime=0;

		this.character.css('display', 'none');
		this.wings.css('display', 'none');
	};

	/**
	 * Resets the state of the player for a new game.
	 */
	Player.prototype.reset = function() {
		this.character.css('display', 'inline');
		this.wings.css('display', 'inline');
		this.pos.x = INITIAL_POSITION_X;
		this.pos.y = INITIAL_POSITION_Y;
		this.score = 0;
	};

	Player.prototype.onFrame = function(delta) {
		if (Controls.keys.space) {
			if (!this.isFlapping) {
				this.flapTime = (new Date()).getTime() + 100;
				this.isFlapping = true;
				this.wings.css('animation-iteration-count', 'infinite');
				this.character.css('animation', 'flapping 1s linear 0s 1 normal');
			}
			
			this.pos.y -= delta * JUMPSPEED;
			Controls.keys.space = false;

			this.flap.currentTime=0;
			this.flap.play();
		}
		else {
			this.character.css('animation', 'falling 0.5s linear 0s 1 normal forwards');
		}

		if (this.isFlapping && this.flapTime <= (new Date()).getTime())
		{
			this.isFlapping = false;
			this.wings.css('animation-iteration-count', '0');
			FALLSPEED = 25;
		}

		if(this.isFlapping){
			this.pos.y -= delta * JUMPSPEED;
		}
		else {
			this.pos.y += delta * FALLSPEED;
			FALLSPEED += 1.5;
		}

		this.checkCollisionWithBounds();
		this.checkScore();

		// Update UI
		this.el.css('transform', 'translateZ(0) translate(' + this.pos.x + 'em, ' + this.pos.y + 'em)');
	};

	Player.prototype.checkCollisionWithBounds = function() {
		// check collision with ground or ceiling
		if ((this.pos.y + HEIGHT + GROUND_HEIGHT) > this.game.WORLD_HEIGHT) {
			
			this.collide.play();
			this.collide.currentTime=0;

			this.character.css('animation-iteration-count', '0');
			return this.game.gameover();
		}

	    // check collision with obstacle1
		if ((this.pos.x + WIDTH >= this.game.obstacle1.pos.x) &&
			this.pos.x <= this.game.obstacle1.pos.x + OBS_WIDTH - WIDTH/2)
		{

			// -12 because upper part of obstacle has 120 pixels which stand out
			// and +2 for the lower part
			if (this.pos.y < ((this.game.obstacle1.holePos - 12)/10) ||
				(this.pos.y + HEIGHT) > ((this.game.obstacle1.holePos + this.game.obstacle1.holeWidth)/10) + 2)
			{
				this.collide.play();
				this.collide.currentTime=0;

				this.character.css('animation-iteration-count', '0');
				return this.game.gameover();
			}
		}

		// check collision with obstacle2
		if ((this.pos.x + WIDTH >= this.game.obstacle2.pos.x) &&
			this.pos.x <= this.game.obstacle2.pos.x + OBS_WIDTH - WIDTH/2)
		{

			// -12 because upper part of obstacle has 120 pixels which stand out
			// and +2 for the lower part
			if (this.pos.y < ((this.game.obstacle2.holePos - 12)/10) ||
				(this.pos.y + HEIGHT) > ((this.game.obstacle2.holePos + this.game.obstacle2.holeWidth)/10) + 2)
			{
				this.collide.play();
				this.collide.currentTime=0;
				
				this.character.css('animation-iteration-count', '0');
				return this.game.gameover();
			}
		}
	};

	Player.prototype.checkScore = function() {
		if (this.game.obstacle1.pos.x <= 26.5 &&
			this.game.obstacle1.pos.x >= 25 &&
			SCORE_DELAY)
		{
			this.scoreSound.play();
			this.scoreSound.currentTime=0;
			this.score++;
			$('#Score').html(this.score);
			SCORE_DELAY = false;
			setTimeout(function () {SCORE_DELAY = true;}, 200);
		}

		if (this.game.obstacle2.pos.x <= 26.5 &&
			this.game.obstacle2.pos.x >= 25 &&
			SCORE_DELAY)
		{
			this.scoreSound.play();
			this.scoreSound.currentTime=0;
			this.score++;
			$('#Score').html(this.score);
			SCORE_DELAY = false;
			setTimeout(function () {SCORE_DELAY = true;}, 200);
		}
	};


	return Player;

})();
