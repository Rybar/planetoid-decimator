ig.module("game.entities.player")
.requires("impact.entity")
.defines(function(){
	//subclassed from ig.Entity
	EntityPlayer = ig.Entity.extend({
		//set some properties
		size: {x:14, y:16}, offset: {x:9, y:6},

		//angle in degrees
		angle: 0,

		//thrust, drives accel
		thrust: 0,
		health: 100,
		hitTime: .2,
		thrustSoundTime: .159,

		autofire: .05,
		//entity type
		type: ig.Entity.TYPE.A,
		checkAgainst: ig.Entity.TYPE.B,
		collides: ig.Entity.COLLIDES.FIXED,
		animSheet: new ig.AnimationSheet("media/player.png", 32,32),

		init: function(x,y,settings){
			//call the parent constructor
			this.parent(x,y,settings);
			this.addAnim("idle",0.05,[0]);
			this.addAnim("thrust",0.05,[1,2]);
			this.addAnim("hit",0.01,[3,2,3,1,3,2,3,1,3,2,3,1,3,2,3,1,3,2,3,1,3,2,3,1]);
			this.fireTimer = new ig.Timer();
			this.fireTimer.set(this.autofire);
			this.hitTimer = new ig.Timer();
			var timerdelta = this.hitTimer.delta();
			this.thrustTimer = new ig.Timer();
			this.thrustTimer.set(this.thrustSoundTime);
		},
		check: function(other){
			//hit
			this.health -= 1;
			this.hitTimer.set(this.hitTime);
			ig.game.soundHurt.play();
			//this.currentAnim = this.anims.hit;
		},
		//this method called for every frame
		update:function(){
			//call the parent update() method to step
			this.parent();  //equivalent of calling super() in AS. Very Important!
			//Bounds
		if(this.hitTimer.delta() < 0){
		this.currentAnim = this.anims.hit;
		}else{
			if(this.pos.x > ig.system.width){this.pos.x = -32;} //if it falls off the sides, wrap it around
				else if(this.pos.x < -32){this.pos.x = ig.system.width;
			};
			if(this.pos.y > ig.system.height){this.pos.y = -32;}//ditto for top and bottom
				else if(this.pos.y < -32){this.pos.y = ig.system.height;
			};

			//check for input
			//"input.pressed" is called once for every key press
			//"input.state" is called on every frame that the key is held down for
			if(ig.input.state("fire") && this.fireTimer.delta() > this.autofire){
			bulletSettings = {
				vel:{
					x:this.vel.x + Math.sin(this.angle*Math.PI/180)*300,
					y:this.vel.y + -(Math.cos(this.angle*Math.PI/180)*300)
				}};
			ig.game.spawnEntity(
				EntityBullet,
				this.pos.x+5,
				this.pos.y+6,
				//this.pos.x+this.width/2 + Math.sin(this.angle*Math.PI/180)*10,
				//this.pos.y+this.height/2 + Math.cos(this.angle*Math.PI/180)*10,
				bulletSettings);

				ig.game.soundLaser.play();
			
			this.fireTimer.set(this.autofire);
			};

			if(ig.input.state("left")){
				this.angle -= 5;
			};
			if(ig.input.state("right")){
				this.angle += 5;
			};
			if(ig.input.state("up")){
				//Accelerate the player in the right direction
				this.accel.x = Math.sin(this.angle*Math.PI/180)*this.thrust;
				this.accel.y = -(Math.cos(this.angle*Math.PI/180)*this.thrust);
				this.currentAnim = this.anims.thrust;

				//don't want overlapping thruster sounds, checks counter then plays
				if(this.thrustTimer.delta() > 0){
					ig.game.soundThrust.play();
					this.thrustTimer.set(this.thrustSoundTime);

				};
			}
			else if(ig.input.state("down")){
				//Accelerate the player in the right direction
				this.accel.x = -(Math.sin(this.angle*Math.PI/180)*this.thrust);
				this.accel.y = Math.cos(this.angle*Math.PI/180)*this.thrust;
				this.currentAnim = this.anims.thrust;
				ig.game.soundThrust.play();
			} else {
				this.accel.x = 0;
				this.accel.y = 0;
				this.currentAnim = this.anims.idle;
			}
		}

			//set the angle for the current animation
			this.currentAnim.angle = this.angle*(Math.PI/180);
 


		}
	});
});