ig.module("game.entities.bullet")
.requires("impact.entity")
.defines(function(){
	//subclassed from ig.Entity
	EntityBullet = ig.Entity.extend({
		//set some properties
		size: {x:8, y:8},
		offset: {x:2,y:2},
		pivot: {x:6,y:6},
		angle: 0,
		maxVel: {x:1000, y:1000},
		lifetime: 1,
		fadetime: .5,
		//entity type
		type: ig.Entity.TYPE.A,
		checkAgainst: ig.Entity.TYPE.B,
		collides: ig.Entity.COLLIDES.NONE,
		animSheet: new ig.AnimationSheet("media/bullet.png",12,20),


		init: function(x,y,settings){
			//call the parent constructor
			this.parent(x,y,settings);
			this.addAnim('idle',.05,[0,1]);

			this.idleTimer = new ig.Timer();
		},
		check: function(other){
			//hit
			other.receiveDamage(4, this); //HURT THE ROCK
			other.vel.x += this.vel.x/6;  //push it a bit with the bullet's speed
			other.vel.y += this.vel.y/6;
			ig.game.scored(5);

			
			for ( var i = 0; i <= 5; i++ ){
    		ig.game.spawnEntity(
    			EntityParticle, this.pos.x, this.pos.y);
			}
			this.kill(); //die die die bullet

			

		},
		//this method called for every frame
		update:function(){
			
			//Bounds
			if(this.pos.x > ig.system.width){this.pos.x = -32;} //if it falls off the sides, wrap it around
				else if(this.pos.x < -32){this.pos.x = ig.system.width;
			};
			if(this.pos.y > ig.system.height){this.pos.y = -32;}//ditto for top and bottom
				else if(this.pos.y < -32){this.pos.y = ig.system.height;
			};

			if(this.idleTimer.delta() > this.lifetime){
				this.kill();
				return;
			}
			this.currentAnim.angle = ig.game.player.currentAnim.angle;
			this.currentAnim.alpha = this.idleTimer.delta().map( this.lifetime - this.fadetime, this.lifetime, 1, 0 );
			this.parent();  //equivalent of calling super() in AS. Very Important!
		}
	});
});