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
        this.nextProjectileId = 1;
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
        this.addMonster(600,200);

        //Ajout du container de lifebar
        this.addLifebar();

        // Groupe ennemi
        this.ennemies    = game.add.group();
        this.ennemies.enableBody = true;

        this.ennemies.createMultiple(25, "enemy_base");
        //Colisions, a voir plus tard
        //game.physics.arcade.collide(this.player, this.ennemies);


        this.projectiles = game.add.group();
        this.projectiles.enableBody = true;
        this.projectiles.createMultiple(25, "sprite_rock");
        game.physics.arcade.collide(this.ennemies, this.projectiles);

        //TODO Parametrer dans le niveau l'interval d'apparition des ennelus
        this.loopEnnemies = game.time.events.loop(1000, this.addEnnemy, this);

        this.addProjectile(100,300);

    },

    update : function(){

      //mise à jour des ennemis
      var nbEnnemies = this.ennemies.children.length;
      if(nbEnnemies > 0){
          for(var i = 0, l = nbEnnemies; i < l; ++i){
            if(this.ennemies.children[i].x < 500)
              this.ennemies.children[i].x += this.levelSpeed;
          }
          game.physics.arcade.overlap(this.projectiles, this.ennemies, this.damageEnnemy, null, this);
      }

    },

    addMonster : function(x,y){

        var monster = this.monsters.getFirstDead();

        if(monster){
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
        //Donnée en dur à modifier TODO
        ennemy.life = 1;
        //Projectiles qui ont fait du damage sur l'ennemi
        ennemy.damageBy = [];
        ennemy.checkWorldBounds = true;
        ennemy.outOfBoundsKill = true;

        ennemy.reset(0 , this.randomGenerator.integerInRange(150,400));
      }
    },

    addProjectile: function(x, y){
      var projectile = this.projectiles.getFirstDead();

      if(projectile){
        //Donnée en dur à modifier TODO
        projectile.damage = 1;
        projectile.properties = ['percing'];


        projectile.projectileId = this.nextProjectileId;
        this.nextProjectileId++;
        projectile.checkWorldBounds = true;
        projectile.outOfBoundsKill = true;

        projectile.reset(x, y);
      }
    },

    damageEnnemy: function(projectile, ennemy) {
      //Si l'ennemi ne s'est pas pris de dégat par ce projectile
      if(ennemy.damageBy.indexOf(projectile.projectileId) === -1){
        ennemy.damageBy.push(projectile.projectileId);

        ennemy.life -= projectile.damage;
        //Si le projectile n'est pas perforant
        if(projectile.properties.indexOf('percing') === -1){
          projectile.kill();
        }
        if(ennemy.life === 0){
          ennemy.kill();
        }
        console.log(ennemy.life);

      }

    }



};
