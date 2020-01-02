var config = {
        type: Phaser.AUTO,
        parent: 'tiroparabolico',
        width: 800,
        height: 600,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 },
                debug: false
            }
        },
        scene: {
            preload: preload,
            create: create,
	        update: update,
	        extend: {
	                    player: null,
	                    lapelota: null,
	                    healthpoints: null,
	                    reticle: null,
	                    moveKeys: null,
	                    playerBullets: null,
	                    time: 0,
	                }
        }
    };
    var game = new Phaser.Game(config);
    var Bullet = new Phaser.Class({
    Extends: Phaser.GameObjects.Image,
    initialize:
    function Bullet (scene)
    {
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'pelota');
        this.speed = 1;
        this.born = 0;
        this.direction = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.setSize(12, 12, true);
    },
    fire: function (shooter, target)
    {
        this.setPosition(shooter.x, shooter.y); // Initial position
        this.direction = Math.atan( (target.x-this.x) / (target.y-this.y));
        if (target.y >= this.y)
        {
            this.xSpeed = this.speed*Math.sin(this.direction);
            this.ySpeed = this.speed*Math.cos(this.direction);
        }
        else
        {
            this.xSpeed = -this.speed*Math.sin(this.direction);
            this.ySpeed = -this.speed*Math.cos(this.direction);
        }

        this.rotation = shooter.rotation;
        this.born = 0;
    },
    update: function (time, delta)
    {
        this.x += this.xSpeed * delta;
        this.y += this.ySpeed * delta;
        this.born += delta;
        if (this.born > 1800)
        {
            this.setActive(false);
            this.setVisible(false);
        }
    }
});
    function preload ()
    {
    	this.load.image('puntoinicio', 'assets/inicio.png',
        	{ frameWidth: 66, frameHeight: 60 }
    	);
        this.load.image('fondo', 'assets/fondo.jpg');
        this.load.image('cursor', 'assets/cursor.png');
        this.load.image('pelota', 'assets/pelota.png');
    }
    function create ()
    {
    	this.physics.world.setBounds(0, 0, 1600, 1200);
	    playerBullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
	    var background = this.add.image(800, 600, 'fondo');
	    player = this.physics.add.sprite(0, 1200, 'puntoinicio');
	    reticle = this.physics.add.sprite(800, 600, 'cursor');
	    background.setOrigin(0.5, 0.5).setDisplaySize(1600, 1200);
	    player.setOrigin(0.5, 0.5).setDisplaySize(132, 120).setCollideWorldBounds(true).setDrag(500, 500);
	    reticle.setOrigin(0.5, 0.5).setDisplaySize(25, 25).setCollideWorldBounds(true);
	    this.cameras.main.zoom = 0.3;




	    this.input.on('pointerdown', function (pointer, time, lastFired) {
	        if (player.active === false)
	            return;

	        var bullet = playerBullets.get().setActive(true).setVisible(true);
	        bullet.setCollideWorldBounds = true;


	        if (bullet)
	        {
	            bullet.fire(player, reticle);
	            console.log("inicia la pelota ");
	        }
	    }, this);
	    game.canvas.addEventListener('mousedown', function () {
	        game.input.mouse.requestPointerLock();
	    });
	    this.input.keyboard.on('keydown_Q', function (event) {
	        if (game.input.mouse.locked)
	            game.input.mouse.releasePointerLock();
	    }, 0, this);
	    this.input.on('pointermove', function (pointer) {
	        if (this.input.mouse.locked)
	        {
	            reticle.x += pointer.movementX;
	            reticle.y += pointer.movementY;
	        }
	    }, this);

    }


function constrainVelocity(sprite, maxVelocity)
{
    if (!sprite || !sprite.body)
      return;
    var angle, currVelocitySqr, vx, vy;
    vx = sprite.body.velocity.x;
    vy = sprite.body.velocity.y;
    currVelocitySqr = vx * vx + vy * vy;

    if (currVelocitySqr > maxVelocity * maxVelocity)
    {
        angle = Math.atan2(vy, vx);
        vx = Math.cos(angle) * maxVelocity;
        vy = Math.sin(angle) * maxVelocity;
        sprite.body.velocity.x = vx;
        sprite.body.velocity.y = vy;
    }
}
function constrainReticle(reticle)
{
    var distX = reticle.x-player.x; // X distance between player & reticle
    var distY = reticle.y-player.y; // Y distance between player & reticle
    if (distX > 800)
        reticle.x = player.x+800;
    else if (distX < -800)
        reticle.x = player.x-800;

    if (distY > 600)
        reticle.y = player.y+600;
    else if (distY < -600)
        reticle.y = player.y-600;
}

function update (time, delta)
{
    player.rotation = Phaser.Math.Angle.Between(player.x, player.y, reticle.x, reticle.y);
    reticle.body.velocity.x = player.body.velocity.x;
    reticle.body.velocity.y = player.body.velocity.y;
    constrainVelocity(player, 500);
    constrainReticle(reticle);
}



//link:
//http://phaser.io/examples/v3/view/games/topdownshooter/topdowncombatmechanics