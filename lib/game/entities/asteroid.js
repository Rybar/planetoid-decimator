ig.module("game.entities.asteroid")
.requires("impact.entity")
.defines(function(){
	//subclassed from ig.Entity
	EntityAsteroid = ig.Entity.extend({
		//set some properties
		size: {x:24, y:24},
		offset: {x:4, y:4},
		angle: 0,
		health: 12,

		//entity type
		type: ig.Entity.TYPE.B,
		checkAgainst: ig.Entity.TYPE.BOTH,
		collides: ig.Entity.COLLIDES.ACTIVE,
		//bounc
		animSheet: new ig.AnimationSheet("media/asteroid.png",32,32),

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
		//var asteroidSettings;
		kill: function() {
			for(var i = 0; i < 4; i++){
				asteroidSettings = {
					vel:{x:100-Math.random()*200+this.vel.x,
						y:100-Math.random()*200+this.vel.y}
					};
				ig.game.spawnEntity(
					EntityAsteroidMedium,
					this.pos.x + 15 - Math.random()*30,
					this.pos.y + 15 - Math.random()*30,
					asteroidSettings);
				};
			ig.game.scored(100);

			//Asplode particles
			for ( var i = 0; i <= 15; i++ ){
    		ig.game.spawnEntity(
    			EntityParticle, this.pos.x, this.pos.y);
			}
			ig.game.scored(250);

		//make some noise!
			ig.game.soundAsplode.volume = 1;
			ig.game.soundAsplode.play();
			ig.game.removeEntity( this );
		},
		
		//this method called for every frame
		update:function(){
			//call the parent update() method to step
			this.parent();  //equivalent of calling super() in AS. Very Important!
			//Bounds
			if(this.pos.x > ig.system.width){this.pos.x = -64;} //if it falls off the sides, wrap it around
				else if(this.pos.x < -64){this.pos.x = ig.system.width;
			};
			if(this.pos.y > ig.system.height){this.pos.y = -64;}//ditto for top and bottom
				else if(this.pos.y < -64){this.pos.y = ig.system.height;
			};

			//spin 'dem rocks
			this.angle += 1;
			this.currentAnim.angle = this.angle*(Math.PI/180);

		}
	});
});