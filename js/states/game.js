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
<<<<<<< HEAD
        
        //score display
        
        this.score = 0;
        this.scoreDisplay = game.add.text(20,20,"Score : 00000000",{});
        
        
         //Sons
        this.gameSounds = {};        
        var keys = Object.keys(thingsData);
        for(var i = 0,l = keys.length;i<l;i++){
            this.gameSounds[keys[i]] = game.add.audio("sound_"+keys[i]);
        }
        
        this.gameSounds.enemy_hit = game.add.audio("enemy_hit");
        this.gameSounds.player_hit = game.add.audio("player_hit");
        this.gameSounds.enemy_destroyed = game.add.audio("enemy_destroyed");
        
        this.drawCooldown=5000;
        this.autoDraw = game.time.events.loop(this.drawCooldown, this.drawCards, this);

        this.initDeck();

        //default card that is always available but has a cooldown
        this.defaultCard = {"thing" : thingsData.rock, "cooldown": 180, "timer" : 0};

        this.defaultCard.template = this.game.add.sprite(100, 475, 'card_template');
        this.defaultCard.icon = this.game.add.sprite(100 + 14, 500, 'icon_'+this.defaultCard.thing.id);
        this.defaultCard.overlay = this.game.add.sprite(100, 575, 'card_overlay');
        this.defaultCard.overlay.scale.setTo(1,0);
        this.defaultCard.overlay.alpha=0.8;
        this.defaultCard.template.inputEnabled=true;
        this.defaultCard.icon.inputEnabled=true;
        this.defaultCard.template.thing=this.defaultCard.thing;
        this.defaultCard.icon.thing=this.defaultCard.thing;
        this.defaultCard.template.defaultCard=true;
        this.defaultCard.icon.defaultCard=true;
        this.defaultCard.template.events.onInputDown.add(this.cardOnClick,this);
        this.defaultCard.icon.events.onInputDown.add(this.cardOnClick,this);


        this.randomGenerator = new Phaser.RandomDataGenerator(1337);


        console.log("game state create() finished");


        //Ajout du monstre
        this.monster = game.add.sprite(700, 220, 'monster');
        this.monster.checkWorldBounds = true;
        this.monster.outOfBoundsKill = true;
        this.monster.life = 100;
        this.monster.reset(650, 220);
        this.monster.enableBody = true;


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


    },

    update : function(){
      //mise à jour des ennemis
      var nbEnnemies = this.ennemies.children.length;
      if(nbEnnemies > 0){
          for(var i = 0, l = nbEnnemies; i < l; ++i){
            if(this.ennemies.children[i].alive === true){
              if(this.ennemies.children[i].x > 575){
                this.ennemies.children[i].body.velocity.x = 0;
                if(this.ennemies.children[i].attackCooldown > 0)
                  this.ennemies.children[i].attackCooldown--;
                else{
                  this.ennemyAttackMonster(this.ennemies.children[i].damage);
                  this.ennemies.children[i].attackCooldown = 60;
                }
              }
            }
          }
          game.physics.arcade.overlap(this.projectiles, this.ennemies, this.damageEnnemy, null, this);
      }
        //update projectiles according to their trajectory
      var nbProjectiles = this.projectiles.children.length;
      if(nbProjectiles  > 0){
        for(var i = 0, l = nbProjectiles; i < l; ++i){
            if(this.projectiles.children[i].alive){
                switch(this.projectiles.children[i].trajectory){
                    case "lob" : {
                        this.projectiles.children[i].angle-=10;
                        this.projectiles.children[i].x -= this.projectiles.children[i].speedX;
                        this.projectiles.children[i].y -= this.projectiles.children[i].speedY;
                        this.projectiles.children[i].speedY -= 0.1;
                        if(this.projectiles.children[i].y>450){
                            this.projectiles.children[i].kill();
                        }
                        break;
                    }
                    case "groundstraight" : {
                        this.projectiles.children[i].x -= this.projectiles.children[i].speedX;
                        if(this.projectiles.children[i].x<-50){
                            this.projectiles.children[i].kill();
                        }
                        break;
                    }

                }

            }


        }

      }

        if(this.defaultCard.timer>=0){
            this.defaultCard.timer--;
            this.defaultCard.overlay.scale.setTo(1,-this.defaultCard.timer/this.defaultCard.cooldown);
        }


    },

    addLifebar: function(){
      this.lifebar     = game.add.sprite(300,10,"lifebar");
      this.lifebarFull = game.add.sprite(300,10,"lifebar_full");

    },

    addEnnemy: function(){
      var ennemy = this.ennemies.getFirstDead();

      var ennemyData = enemyData["base"];


      if(ennemy && typeof ennemyData !== "undefined"){
        //Donnée en dur à modifier TODO
        ennemy.life = ennemyData['health'];
        //Projectiles qui ont fait du damage sur l'ennemi
        ennemy.damageBy = [];
        ennemy.checkWorldBounds = true;
        ennemy.outOfBoundsKill = true;
        ennemy.attackCooldown = ennemyData['cooldown'] * 60;
        ennemy.damage = ennemyData['damage'];
        ennemy.score = ennemyData['score'];
        ennemy.reset(0 , this.randomGenerator.integerInRange(150,400));
        ennemy.body.velocity.x = ennemyData['speed'] * 60;
      }
    },

    addProjectile: function(x, y, type){
      var projectile = this.projectiles.getFirstDead();

      var projectileData = thingsData[type];


      if(projectile && typeof projectileData !== "undefined"){
          
        this.gameSounds[type].play();
        projectile.angle=0;
        projectile.damage = projectileData.damage;
        projectile.properties = projectileData.properties;
        projectile.trajectory=projectileData.trajectory;
        projectile.speedX = projectileData.speed;
        projectile.speedY = projectileData.speed;
        projectile.projectileId = this.nextProjectileId;
        this.nextProjectileId++;
        projectile.checkWorldBounds = true;
        projectile.outOfBoundsKill = true;
        projectile.anchor.setTo(0.5, 0.5);
        projectile.loadTexture("sprite_"+type);
        projectile.reset(x, y);
      }
    },

    damageEnnemy: function(projectile, ennemy) {
      //Si l'ennemi ne s'est pas pris de dégat par ce projectile
      if(ennemy.damageBy.indexOf(projectile.projectileId) === -1){
        ennemy.damageBy.push(projectile.projectileId);

        ennemy.life -= projectile.damage;
        //Si le projectile n'est pas perforant
        if(projectile.properties.indexOf('piercing') === -1){
          projectile.kill();
        }
        if(ennemy.life <= 0){
            this.score+=ennemy.score;
            ennemy.kill();
            this.gameSounds.enemy_destroyed.play();
            this.updateScore();
            
        }else{
            this.gameSounds.enemy_hit.play();
        }
        console.log(ennemy.life);

      }

    },
    updateScore : function(){
        var scoreString= ""+this.score;
        
        while(scoreString.length<8){
            scoreString="0"+scoreString;
        }
        this.scoreDisplay.text="Score : "+scoreString;
        
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

        if(!howMany)howMany=1;
        console.log("trying to draw "+howMany+" card(s)...");
        for(var i=0; i<howMany;i++){
            if(this.hand.length<5){

                var card = this.deck.shift();
                if(typeof(card) !== "undefined"){
                    console.log("drawing card...");
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
        cardObj.template.thing=cardObj.thing;
        cardObj.icon.thing=cardObj.thing;
        cardObj.template.handIndex=handIndex;
        cardObj.icon.handIndex=handIndex;
        cardObj.template.events.onInputDown.add(this.cardOnClick,this);
        cardObj.icon.events.onInputDown.add(this.cardOnClick,this);

        return cardObj;

    },

    cardOnClick : function(sprite, pointer){
        console.log(sprite.thing);
        var thing = sprite.thing;
        if(sprite.defaultCard){
            if(this.defaultCard.timer<=0){

                this.defaultCard.timer=this.defaultCard.cooldown;
                this.addProjectile(650+thing.offset.x,200+thing.offset.y,thing.id);

            }
        }else{

            this.addProjectile(650+thing.offset.x,200+thing.offset.y,thing.id);
            this.removeFromHand(sprite.handIndex);
        }
    },

    ennemyAttackMonster : function(damage){
      this.monster.life -= damage;
      if(this.monster.life < 0)
        this.monster.kill();
      this.lifebarFull.scale.setTo(this.monster.life / 100, 1);
      console.log(damage)
    }


};
