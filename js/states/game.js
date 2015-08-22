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

        this.levelSpeed = 1;
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

        // Groupe ennemi
        this.ennemies    = game.add.group();
        this.ennemies.enableBody = true;

        this.ennemies.createMultiple(25, "enemy_base");
        //Colisions, a voir plus tard
        //game.physics.arcade.collide(this.player, this.ennemies);

        //TODO Parametrer dans le niveau l'interval d'apparition des ennelus
        this.loopEnnemies = game.time.events.loop(1000, this.addEnnemy, this);

    },

    update : function(){

      //mise à jour des ennemis
      var nbEnnemies = this.ennemies.children.length;
      if(nbEnnemies > 0){
          for(var i = 0, l = nbEnnemies; i < l; ++i){
            if(this.ennemies.children[i].x < 600)
              this.ennemies.children[i].x += this.levelSpeed;
          }
          //game.physics.arcade.overlap(this.monster.body, this.ennemies, this.takeDamage, null, this);
      }

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

    },

    addEnnemy: function(){
      var ennemy = this.ennemies.getFirstDead();

      if(ennemy){
        ennemy.anchor.setTo(0.5,0.5);
        ennemy.direction=this.RIGHT;
        ennemy.scale.x=0.5;
        ennemy.scale.y=0.5;
        ennemy.checkWorldBounds = true;
        ennemy.outOfBoundsKill = true;

        ennemy.reset(0 , this.randomGenerator.integerInRange(150,400));
      }
    }



};
