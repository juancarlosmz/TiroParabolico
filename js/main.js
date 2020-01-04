var config = {
        type: Phaser.AUTO,
        parent: 'tiroparabolico',
        width: 800,
        height: 600,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 150 },
                debug: false
            }
        },
        scene: {
            preload: preload,
            create: create,
	        update: update,
	        extend: {
	                    player: null,
	                    healthpoints: null,
	                    elcursor: null,
	                    moveKeys: null,
	                    playerBullets: null,
	                    time: 0,
	                }
        }
    };
    var game = new Phaser.Game(config);
    var Pelota = new Phaser.Class({
    Extends: Phaser.GameObjects.Image,
    initialize:
    function Pelota (scene){
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'pelota');
        this.speed = 1;
        this.hijo = 0;
        this.direction = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.setSize(12, 12, true);
    },
    lanza: function (disparo, cursor){
        this.setPosition(disparo.x, disparo.y); 
        
        this.direction = Math.atan( (cursor.x-this.x) / (cursor.y-this.y));
        if (cursor.y >= this.y){
            this.xSpeed = this.speed*Math.sin(this.direction);
            this.ySpeed = this.speed*Math.cos(this.direction);
        }else{
            this.xSpeed = -this.speed*Math.sin(this.direction);
            this.ySpeed = -this.speed*Math.cos(this.direction);
        }
        this.rotation = disparo.rotation;
        this.hijo = 0;

    },
    update: function (time, delta){
        this.x += this.xSpeed * delta;
        this.y += this.ySpeed * delta;
        this.hijo += delta;
        if (this.hijo > 1800)
        {
            this.setActive(false);
            this.setVisible(false);
        }
    }
});
    function preload (){
    	this.load.image('puntoinicio', 'assets/inicio.png',
        	{ frameWidth: 66, frameHeight: 60 }
    	);
        this.load.image('fondo', 'assets/fondo.jpg');
        this.load.image('cursor', 'assets/cursor.png');
        this.load.image('pelota', 'assets/pelota.png',
            { frameWidth: 10, frameHeight: 10 }
        );
    }
    function create (){


        this.physics.world.gravity.y = 100;
        
        playerBullets = this.physics.add.group({ classType: Pelota, runChildUpdate: true });
        
	    var background = this.add.image(800, 600, 'fondo');
	    player = this.physics.add.sprite(0, 600, 'puntoinicio').setGravity(0, -100);
	    elcursor = this.physics.add.sprite(400, 300, 'cursor').setGravity(0, -100);
	    background.setOrigin(1, 1).setDisplaySize(800, 600);
	    elcursor.setOrigin(0, 0).setDisplaySize(25, 25).setCollideWorldBounds(true);
	    this.cameras.main.zoom = 0.8;
	    this.input.on('pointerdown', function () {
	        if (player.active === false){
                return;
            }
	        var pelota = playerBullets.get().setActive(true).setVisible(true);
            pelota.setCollideWorldBounds = true;
	        if (pelota){
                
                pelota.lanza(player, elcursor);
                
	            console.log("inicia la pelota ");
	        }
	    }, this);
	    game.canvas.addEventListener('mousedown', function () {
	        game.input.mouse.requestPointerLock();
	    });
	    this.input.on('pointermove', function (pointer) {
	        if (this.input.mouse.locked){
	            elcursor.x += pointer.movementX;
                elcursor.y += pointer.movementY;
                //console.log('mouse en x',elcursor.x);
                //console.log('mouse en y',elcursor.y);
	        }
	    }, this);
    }
function restringirElcursor(elcursor){
    var distX = elcursor.x-player.x; // X distancia entre player & elcursor
    var distY = elcursor.y-player.y; // Y distancia entre player & elcursor
    if (distX > 800)
        elcursor.x = player.x+800;
    else if (distX < -800)
        elcursor.x = player.x-800;

    if (distY > 600)
        elcursor.y = player.y+600;
    else if (distY < -600)
        elcursor.y = player.y-600;
}
function update (){
    player.rotation = Phaser.Math.Angle.Between(player.x, player.y, elcursor.x, elcursor.y);
    elcursor.body.velocity.x = player.body.velocity.x;
    elcursor.body.velocity.y = player.body.velocity.y;
    restringirElcursor(elcursor);
}



//link:
//http://phaser.io/examples/v3/view/games/topdownshooter/topdowncombatmechanics