ig.module("game.entities.asteroid-small")
.requires("impact.entity")
.defines(function(){
	//subclassed from ig.Entity
	EntityAsteroidSmall = ig.Entity.extend({
		//set some properties
		size: {x:4, y:4},
		offset: {x:2, y:2},
		angle: 0,
		health: 2,

		//entity type
		type: ig.Entity.TYPE.B,
		checkAgainst: ig.Entity.TYPE.BOTH,
		collides: ig.Entity.COLLIDES.ACTIVE,
		animSheet: new ig.AnimationSheet("media/asteroid-small.png",8,8),

		init: function(x,y,settings){
			//call the parent constructor
			this.parent(x,y,settings);
			this.addAnim("idle",1,[0]);
		},

		check: function(other){
			//hit
			
			for ( var i = 0; i <= 5; i++ ){
    		ig.game.spawnEntity(
    			EntityParticleBlue, this.pos.x, this.pos.y);
			}
			ig.game.soundHit.play();
		},

		//kill: function() {
			//ig.scored(1000);
			//this.parent.kill();
		//},

		kill: function() {
			//Asplode particles
			for ( var i = 0; i <= 5; i++ ){
    		ig.game.spawnEntity(
    			EntityParticle, this.pos.x, this.pos.y);
			}
			ig.game.scored(250);

		//make some noise!
			ig.game.soundAsplode.volume = .25;
			ig.game.soundAsplode.play();
				
			ig.game.scored(250);
			ig.game.removeEntity( this );

		},
		
		//this method called for every frame
		update:function(){
			//call the parent update() method to step
			this.parent();  //equivalent of calling super() in AS. Very Important!
			//Bounds
			if(this.pos.x > ig.system.width){this.pos.x = -32;} //if it falls off the sides, wrap it around
				else if(this.pos.x < -32){this.pos.x = ig.system.width;
			};
			if(this.pos.y > ig.system.height){this.pos.y = -32;}//ditto for top and bottom
				else if(this.pos.y < -32){this.pos.y = ig.system.height;
			};

			//spin 'dem rocks
			this.angle += 1;
			this.currentAnim.angle = this.angle*(Math.PI/180);

		}
	});
});