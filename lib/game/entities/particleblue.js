ig.module("game.entities.particleblue")
.requires("impact.entity")
.defines(function(){
  EntityParticleBlue = ig.Entity.extend({
    // single pixel sprites
    size: { x:2, y:2 },
    offset: { x:0, y:0 },
   
    // particle will collide but not effect other entities
    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.NONE,
    collides: ig.Entity.COLLIDES.LITE,
   
    // default particle lifetime & fadetime
    lifetime: .75,
    fadetime: .4,
    gravityFactor: 0,
    angle: 0, //in degrees
   
    // particles will bounce off other entities when it collides
    minBounceVelocity: 0,
    bounciness: 1.0,
    friction: { x:0, y:0 },

    animSheet: new ig.AnimationSheet("media/particle-gradient-blue.png",2,2),

    init: function( x, y, settings ){
      this.parent( x, y, settings );

      this.addAnim('idle', 1,[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,
                              19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,
                              35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,
                              51,52,53,54,55,56,57,58,59,60,61,62,63]);
   
      //// take velocity and add randomness to vel
      var vx = this.vel.x; var vy = this.vel.y;
      this.vel = { x: (Math.random() < 0.5 ? -1 : 1)*Math.random()*100 + -this.vel.x,
                   y: (Math.random() < 0.5 ? -1 : 1)*Math.random()*100 + -this.vel.y};
   
      // creates a flicker effect
      //this.currentAnim.gotoRandomFrame();
   
      // init timer for fadetime
      this.idleTimer = new ig.Timer();
  },

  update: function(){
      // check if particle has existed past lifetime
      // if so, remove particle
      if(this.idleTimer.delta() > this.lifetime){
           this.kill();
           return;
      } 
   
      // fade the particle effect using the aplha blend
      this.currentAnim.alpha =
        this.idleTimer.delta().map( this.lifetime - this.fadetime, this.lifetime, 1, 0 );

      this.parent();
      this.currentAnim.gotoFrame(this.currentAnim.alpha.map(0,1,0,32));
  } 
   
  });
});