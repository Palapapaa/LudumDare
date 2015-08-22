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
        game.physics.startSystem(Phaser.Physics.ARCADE);
        //Ajout du background
        game.add.sprite(0,0,"background");
        //cards not yet drawn by the player
        this.deck = [];
        // cards currently visible on the GUI the player can use
        this.hand = [];
        this.handSprites = [];

        this.drawCooldown=300;
        this.drawTimer=0;

        this.initDeck();

        this.randomGenerator = new Phaser.RandomDataGenerator(1337);
         //Sons

        // Groupe monstre
        this.monsters = game.add.group();
        this.monsters.enableBody = true;

        this.monsters.createMultiple(25, "monster");

        console.log("game state create() finished");


        //Ajout du monstre
        this.addMonster(650,200);


        //Ajout du container de lifebar
        this.addLifebar();

        // Groupe ennemi
        this.ennemies    = game.add.group();
        this.ennemies.enableBody = true;

        this.ennemies.createMultiple(25, "enemy_base");
        //Colisions, a voir plus tard
        game.physics.arcade.collide(this.ennemies);
        game.physics.enable(this.ennemies, Phaser.Physics.ARCADE);

        this.projectiles = game.add.group();
        this.projectiles.enableBody = true;
        this.projectiles.createMultiple(25, "sprite_rock");
        game.physics.arcade.collide(this.ennemies, this.projectiles);

        //TODO Parametrer dans le niveau l'interval d'apparition des ennelus
        this.loopEnnemies = game.time.events.loop(2000, this.addEnnemy, this);

        this.addProjectile(500,300, 'rock');

    },

    update : function(){
      //mise à jour des ennemis
      var nbEnnemies = this.ennemies.children.length;
      if(nbEnnemies > 0){
          for(var i = 0, l = nbEnnemies; i < l; ++i){
            if(this.ennemies.children[i].x > 575)
              this.ennemies.children[i].body.velocity.x = 0;
          }
          game.physics.arcade.overlap(this.projectiles, this.ennemies, this.damageEnnemy, null, this);
      }
      var nbProjectiles = this.projectiles.children.length;
      if(nbProjectiles  > 0){
        for(var i = 0, l = nbProjectiles; i < l; ++i){

          this.projectiles.children[i].x -= this.projectiles.children[i].speedX;
        //  this.projectiles.children[i].speedX -= 0.01;
          this.projectiles.children[i].y -= this.projectiles.children[i].speedY;
          this.projectiles.children[i].speedY -= 0.005;
        }

      }


        this.drawTimer++;
        if(this.drawTimer>this.drawCooldown){
            console.log("drawing card...");
            this.drawTimer=0;
            this.drawCards(1);
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
        ennemy.body.velocity.x = 60;
      }
    },

    addProjectile: function(x, y, type){
      var projectile = this.projectiles.getFirstDead();

      var projectileData = thingsData[type];


      if(projectile && typeof projectileData !== "undefined"){
        //Donnée en dur à modifier TODO
        projectile.damage = projectileData.damage;
        projectile.properties = projectileData.properties;

        projectile.speedX = projectileData.speed;
        projectile.speedY = projectileData.speed;
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

    },

    initDeck : function(){
        this.deck=[];

        for(var i=0; i<15;i++){
            this.deck.push(thingsData.caddie);
        }
        this.resetHand();
        this.drawCards(5);
    },

    resetHand : function(){
        for(var l= this.hand.length,i=l-1;i>=0;i--){
            this.removeFromHand(i);
        }
    },

    removeFromHand : function(index){
        this.hand[index].icon.destroy(true);
        this.hand[index].template.destroy(true);

        this.hand.splice(index,1);
        this.redrawHand();
    },


    //redraw hand in case of delete
    redrawHand : function (){
        for(var l= this.hand.length,i=l-1;i>=0;i--){
            this.hand[i].icon.destroy(true);
            this.hand[i].template.destroy(true);
            this.addCardToHand(this.hand[i],i);
        }
    },

    drawCards : function(howMany){
        for(var i=0; i<howMany;i++){
            if(this.hand.length<5){

                var card = this.deck.shift();
                if(typeof(card) !== "undefined"){
                    var cardObj = {"thing":card};
                    cardObj=this.addCardToHand(cardObj,this.hand.length);
                    this.hand.push(cardObj);
                }
            }
        }
    },

    addCardToHand : function(cardObj,handIndex){

        cardObj.template = this.game.add.sprite(200+handIndex * 70, 475, 'card_template');
        cardObj.icon = this.game.add.sprite(200+handIndex * 70 + 14, 500, 'icon_'+cardObj.thing.id);
        cardObj.template.inputEnabled=true;
        cardObj.icon.inputEnabled=true;
        cardObj.template.events.onInputDown.add(this.cardOnClick,this);
        cardObj.icon.events.onInputDown.add(this.cardOnClick,this);
        cardObj.template.thing=cardObj.thing;
        cardObj.icon.thing=cardObj.thing;
        cardObj.template.handIndex=handIndex;
        cardObj.icon.handIndex=handIndex;
        return cardObj;

    },

    cardOnClick : function(sprite, pointer){
        console.log(sprite.thing);
        this.removeFromHand(sprite.handIndex);
    }


};
