ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
	//'impact.debug.debug',

	'game.entities.asteroid',
	'game.entities.asteroid-med',
	'game.entities.asteroid-small',

	'game.entities.player',
	'game.entities.bullet',

	'game.entities.particle',
	'game.entities.particleblue'

	//'plugins.image-scaling'

	//'plugins.webgl-2d'
)
.defines(function(){
//ig.System.drawMode = ig.System.DRAW.SUBPIXEL;
MyGame = ig.Game.extend({
	
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
	player: null,
	background: new ig.Image("media/background.png"),
	scangrid: new ig.Image("media/scangrid.png"),

	soundLaser: new ig.Sound("media/laser.ogg"),
	soundHurt: new ig.Sound("media/hurt.ogg"),
	soundAsplode: new ig.Sound("media/Explosion.ogg"),
	soundThrust: new ig.Sound("media/thrust.ogg"),
	soundHit: new ig.Sound("media/hit.ogg"),

	gameOver: false,
	score: 0,

	y1: 0,
	y2: 214,

	spawnCount: 30,
	spawnTimer: new ig.Timer(),


	
	init: function() {
		// Initialize your game here; bind keys etc.

		//input
		ig.input.bind(ig.KEY.LEFT_ARROW, "left");
		ig.input.bind(ig.KEY.RIGHT_ARROW, "right");
		ig.input.bind(ig.KEY.UP_ARROW, "up");
		ig.input.bind(ig.KEY.DOWN_ARROW, "down");
		ig.input.bind(ig.KEY.ENTER, "play");
		ig.input.bind(ig.KEY.SPACE, "fire");
		ig.input.bind(ig.KEY.A, "left");
		ig.input.bind(ig.KEY.D, "right");
		ig.input.bind(ig.KEY.W, "up");
		ig.input.bind(ig.KEY.S, "down");
		ig.input.bind(ig.KEY.MOUSE1, "fire");

		this.soundThrust.channels = 1;
		this.soundThrust.volume = .5;
		this.soundHit.volume = .4;
		this.spawnTimer.set(this.spawnCount);
		//this.scangrid.disableScaling = true;

		

		//spawn the asteroids
		var asteroidSettings;
		for(var i = 0; i < 7; i++){
			asteroidSettings = {vel:{x:100-Math.random()*200, y:100-Math.random()*200}};
			this.spawnEntity(EntityAsteroid, Math.random()*ig.system.width, Math.random()*ig.system.height, asteroidSettings)
			;

		};
		//spawn the player
		var playerSettings = {thrust: 100, maxVel:{x: 300, y: 300}};
		this.player = this.spawnEntity(EntityPlayer, 50,50, playerSettings);
	},

	scored: function(points){
		this.score += points;
	},
	
	update: function() {
		//this.scored(0.016); //score +1 per second alive
		//run if gameover
		if(this.gameOver){
			if(ig.input.pressed("play")){
				ig.system.setGame(MyGame);
			};
			//return to stop anything else updating
			return;
		};
		if(ig.input.pressed("play") ) {
        ig.system.setGame(MyGame);
    	};
		// Update all entities and backgroundMaps
		this.parent();

		//check for gameover condition
		if(this.player.health == 0){
			this.gameOver = true;
		};

		if(this.spawnTimer.delta() > 0){
			for(var i = 0; i < 5; i++){
				asteroidSettings = {vel:{x:100-Math.random()*200, y:100-Math.random()*200}};
				// spawn more from random position along top of screen
				this.spawnEntity(EntityAsteroid, Math.random()*ig.system.width, -64, asteroidSettings) 
				;
			};

		this.spawnTimer.set(this.spawnCount);
		this.spawnCount -= 5;
		if(this.spawnCount < 5){this.spawnCount = 5};
		
		};
		// Add your own, additional update code here
	},
	
	draw: function() {
		//not calling parent here so we can make sure background draws first
		this.background.draw(0,this.y1); //beautiful scrolling stars, better see
		this.background.draw(0,this.y2);

		this.y1++;
      	this.y2++;
      	if(this.y1 > 213){this.y1 = -213};
       	if(this.y2 > 213){this.y2 = -213};

		//game over screen
		if(this.gameOver){
			this.font.draw("Game Over!", ig.system.width/2,132,ig.Font.ALIGN.CENTER);
			this.font.draw( 'FINAL SCORE: '+ this.score.floor().toString(), ig.system.width/2, 148, ig.Font.ALIGN.CENTER );
			this.font.draw("Press Enter", ig.system.width/2,232,ig.Font.ALIGN.CENTER);
			this.font.draw("to Restart",ig.system.width/2,272, ig.Font.ALIGN.CENTER);

			//Return to stop anything else from drawing
			return;
		}

		//Draw the rest
		for(var i = 0; i < this.entities.length; i++) {
			this.entities[i].draw();
		};
		
		
		// Add your own drawing code here
		var x = ig.system.width/2,
			y = 0;


		
		this.font.draw( 'SCORE: '+ this.score.floor().toString(), x, y+8, ig.Font.ALIGN.CENTER );
		this.font.draw( 'SHIELD: '+ ig.game.player.health.floor().toString(), x, y+20, ig.Font.ALIGN.CENTER );

		//this.scangrid.draw(0,0);
		var image = this.scangrid.data;
		ig.system.context.drawImage( image, 0, 0, ig.system.width*3, ig.system.height*3 );
	}
});

//INTRO SCREEN
Intro = ig.Class.extend({
        introTimer: null,
        font: new ig.Font( 'media/04b03.font.png' ),
        titlebackground: new ig.Image("media/background.png"),
        titlecard: new ig.Image("media/title-screen.png"),
        scangrid: new ig.Image("media/scangrid.png"),
        y1: 0,
        y2: 213,

        init: function() {
            this.introTimer = new ig.Timer(5);

            ig.input.bind(ig.KEY.ENTER, "play");
            ig.input.bind(ig.KEY.MOUSE1, "play");

        },
        run: function() {

        	this.titlebackground.draw(0,this.y1);
        	this.titlebackground.draw(0,this.y2);
        	
        	this.y1++;
        	this.y2++;
        	if(this.y1 > 213){this.y1 = -213};
        	if(this.y2 > 213){this.y2 = -213};
        	this.titlecard.draw(0,0);

            this.font.draw("WASD or arrows, SPACE OR Click to Fire", ig.system.width/2, 290, ig.Font.ALIGN.CENTER);
            this.font.draw("hit Enter or click to begin", ig.system.width/2, 302, ig.Font.ALIGN.CENTER);

            this.scangrid.disableScaling = true;

            //this.scangrid.draw(0,0);
            var image = this.scangrid.data;
			ig.system.context.drawImage( image, 0, 0, ig.system.width*3, ig.system.height*3 );

        if(ig.input.pressed("play") || ig.input.pressed("play2")){
            ig.system.setGame(MyGame);
        };
                    
        
        }
});


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', Intro, 60, 320, 213, 3);

});
