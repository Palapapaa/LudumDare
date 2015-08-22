var gameState = {

    //chargement des params du niveau
    init : function(){
        console.log("Game state init");

    },

    preload : function(){
        console.log("Game state preload");
        this.UP = -1;
        this.DOWN = 1;
        this.LEFT = -1;
        this.RIGHT = 1;
        this.LEVELTOP=250;

        this.LEVELBOTTOM=game.global.gameHeight;
    },

    create : function(){
        //Ajout du background
        game.add.sprite(0,0,"background");

        this.randomGenerator = new Phaser.RandomDataGenerator(1337);
         //Sons

        // Groupe monstre
        this.monsters = game.add.group();
        this.monsters.enableBody = true;

        this.monsters.createMultiple(25, "monster");

        console.log("game state create() finished");


        //Ajout du monstre
        this.addMonster(700,300);

        //Ajout du container de lifebar
        this.addLifebar();

    },

    update : function(){



    },

    addMonster : function(x,y){

        var monster = this.monsters.getFirstDead();

        if(monster){
            monster.anchor.setTo(0.5,0.5);
            monster.direction=this.RIGHT;
            monster.scale.x=0.5;
            monster.scale.y=0.5;
            monster.checkWorldBounds = true;
            monster.outOfBoundsKill = true;
            monster.reset(x , y);
        }
    },

    addLifebar: function(){
      game.add.sprite(300,10,"lifebar");

    }




};
