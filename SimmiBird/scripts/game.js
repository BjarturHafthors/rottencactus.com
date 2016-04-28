
window.Game = (function() {
	'use strict';

	/**
	 * Main game class.
	 * @param {Element} el jQuery element containing the game.
	 * @constructor
	 */
	var Game = function(el) {
		this.el = el;

		this.player = new window.Player(this.el.find('.Player'), this);
		
		this.isPlaying = false;
		this.obstacle1 = new window.Obstacle(this.el.find('#obs1'), this, 120);
		this.obstacle2 = new window.Obstacle(this.el.find('#obs2'), this, 180);

		// Cache a bound onFrame since we need it each frame.
		this.onFrame = this.onFrame.bind(this);
	};

	/**
	 * Runs every frame. Calculates a delta and allows each game
	 * entity to update itself.
	 */
	Game.prototype.onFrame = function() {
		// Check if the game loop should stop.
		if (!this.isPlaying) {
			return;
		}

		// Calculate how long since last frame in seconds.
		var now = +new Date() / 1000,
				delta = now - this.lastFrame;
		this.lastFrame = now;

		// Update game entities.
		this.player.onFrame(delta);
		this.obstacle1.onFrame(delta);
		this.obstacle2.onFrame(delta);

		// Request next frame.
		window.requestAnimationFrame(this.onFrame);
	};

	Game.prototype.launch = function() {
		var play = this.el.find('.Play');
		var that = this;
		
		var ground = this.el.find('.Ground');
		ground.css('animation-play-state', 'paused');

		$('#Score').html(0);
		$('#Highscore').html(0);

		play
			.addClass('is-visible')
			.find('.PlayButton')
				.one('click', function() {
					play.removeClass('is-visible');
					that.start();
				});
	};

	/**
	 * Starts a new game.
	 */
	Game.prototype.start = function() {
		var ground = this.el.find('.Ground');
		
		this.reset();

		// Restart the onFrame loop
		this.lastFrame = +new Date() / 1000;
		window.requestAnimationFrame(this.onFrame);
		this.isPlaying = true;
		$('#Score').html(this.player.score);
		$('#Highscore').html(this.player.highScore);

		ground.css('animation-play-state', 'running');
	};

	/**
	 * Resets the state of the game so a new game can be started.
	 */
	Game.prototype.reset = function() {
		this.player.reset();
		this.obstacle1.reset();
		this.obstacle2.reset();
	};

	/**
	 * Signals that the game is over.
	 */
	Game.prototype.gameover = function() {
		this.isPlaying = false;

		// Should be refactored into a Scoreboard class.
		var that = this;
		var scoreboardEl = this.el.find('.Scoreboard');
		var ground = this.el.find('.Ground');

		if (this.player.score > this.player.highScore) {
			this.player.highScore = this.player.score;
			$('#Highscore').html(this.player.highScore);
		}

		ground.css('animation-play-state', 'paused');

		scoreboardEl
			.addClass('is-visible')
			.find('.Scoreboard-restart')
				.one('click', function() {
					scoreboardEl.removeClass('is-visible');
					that.start();
				});
	};

	/**
	 * Some shared constants.
	 */
	Game.prototype.WORLD_WIDTH = 102.4;
	Game.prototype.WORLD_HEIGHT = 57.6;

	return Game;
})();


