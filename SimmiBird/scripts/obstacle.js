window.Obstacle = (function() {
	'use strict';

	var SPEED = 0.8;
	var INITIAL_POS = 120;
	var HOLE_WIDTH = 200;

	var Obstacle = function(el, game, x) {
		this.el = el;
		this.game = game;
		this.pos = { x: x, y: 0 };
		this.startPos = x;

		this.holePos = Math.floor((Math.random() * 300) + 5);
		this.holeWidth = HOLE_WIDTH;

		this.lower = this.el.find('.lower');
		this.upper = this.el.find('.upper');
		this.upper.css('height', this.holePos);
		this.lower.css('top', HOLE_WIDTH);

		this.upper.css('display', 'none');
		this.lower.css('display', 'none');
	};

	Obstacle.prototype.reset = function() {
		this.upper.css('display', 'block');
		this.lower.css('display', 'block');
		this.pos.x = this.startPos;
		this.holePos = Math.floor((Math.random() * 300) + 5);
		this.upper.css('height', this.holePos);
		this.lower.css('top', HOLE_WIDTH);
	};

	Obstacle.prototype.repeat = function() {
		this.pos.x = INITIAL_POS;
		this.holePos = Math.floor((Math.random() * 300) + 15);
		this.upper.css('height', this.holePos);
		this.lower.css('top', HOLE_WIDTH);
	};

	Obstacle.prototype.onFrame = function() {
		this.pos.x = this.pos.x - SPEED;
		if (this.pos.x < -15) {
			this.repeat();
		}

		// Update UI
		this.el.css('transform', 'translate3d(' + this.pos.x + 'em, ' + this.pos.y +  'em, 0)');
	};

	return Obstacle;

})();
