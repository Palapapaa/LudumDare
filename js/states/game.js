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
        game.add.sprite(-20,-20,"background");
        //cards not yet drawn by the player
        this.deck = [];
        this.stock = [];
        //stock initial de cartes
        for(var i=0; i<6;i++){
            this.stock.push(thingsData.caddie);
        }
        for(var i=0; i<2;i++){
            this.stock.push(thingsData.caddie_TNT);
        }
        for(var i=0; i<10;i++){
            this.stock.push(thingsData.rock);
        }
        for(var i=0; i<10;i++){
            this.stock.push(thingsData.duck);
        }
        for(var i=0; i<2;i++){
            this.stock.push(thingsData.molotov);
        }
        // cards currently visible on the GUI the player can use
        this.hand = [];
        this.handSprites = [];

        //score display
        this.score = 0;
        this.scoreDisplay = game.add.text(20,20,"Score : 00000000",{"fill" : "#CACACA"});


        this.availableEnemies = ["base"];
        this.totalEnemySpawnChance = enemyData.base.spawnchance;
        this.enemiesKilled = 0;
        this.enemiesGotSpeedBoost = false;

         //Sons
        this.gameSounds = {};
        var keys = Object.keys(thingsData);
        for(var i = 0,l = keys.length;i<l;i++){
            this.gameSounds[keys[i]] = game.add.audio("sound_"+keys[i]);
        }

        this.gameSounds.enemy_hit = game.add.audio("enemy_hit");
        this.gameSounds.player_hit = game.add.audio("player_hit");
        this.gameSounds.enemy_destroyed = game.add.audio("enemy_destroyed");
        this.gameSounds.draw_rare = game.add.audio("draw_rare");
        this.gameSounds.draw = game.add.audio("draw");
        this.gameSounds.shuffle = game.add.audio("shuffle");

        this.gameSounds.maracas = game.add.audio("maracas");
        //this.gameSounds.maracas.play("",0,0.5,true);


        this.deckBack = game.add.sprite(650, 490, 'deck_back');
        this.deckBack.frame =3;

        this.drawBar = this.game.add.sprite(725, 490, 'drawbar');
        this.drawBarFull = this.game.add.sprite(726, 596, 'drawbar_full');
        this.drawBarFull.scale.setTo(1,-1);
        this.deckDisplay = game.add.text(740, 490,"",{"fill" : "#CACACA","fontSize": 17});

        //Ennemis decedaient
        this.deadEnnemies = game.add.group();
        this.deadEnnemies.createMultiple(25, "enemy_base");
        this.deadEnnemies.setAll('anchor.x', 0.5);
        this.deadEnnemies.setAll('anchor.y', 0.5);
        game.physics.enable(this.deadEnnemies, Phaser.Physics.ARCADE);
        this.drawCooldown=4500;
        this.drawTimer=this.drawCooldown;

        this.shuffling = false;
        this.shuffleCooldown=6000;
        this.shuffleTimer=this.shuffleCooldown;
        this.shuffleEvent = null;

        this.autoDraw = game.time.events.loop(this.drawCooldown, this.drawCards, this,1);

        this.initDeck();
        //draw more cards at the beginning
        for(var i =3;i<5;i++){
            game.time.events.add(i*500, this.drawCards, this, 1);
        }
        //default card that is always available but has a cooldown
        this.defaultCard = {"thing" : thingsData.rock, "cooldown": 180, "timer" : 0};

        this.defaultCard.template = this.game.add.sprite(100, 495, 'card_template_default');
        this.defaultCard.icon = this.game.add.sprite(100 + 32, 532, 'icon_'+this.defaultCard.thing.id);
        this.defaultCard.icon.anchor.setTo(0.5, 0.5);
        this.defaultCard.trajectory = this.game.add.sprite(148, 585, 'trajectory_'+this.defaultCard.thing.trajectory);
        this.defaultCard.trajectory.anchor.setTo(0.5, 0.5);
        this.defaultCard.damage = this.game.add.text(116, 587, this.defaultCard.thing.damage,{"fontSize": 18});
        this.defaultCard.damage.anchor.setTo(0.5, 0.5);
        this.defaultCard.cooldownSprite = this.game.add.sprite(100, 595, 'card_cooldown');
        this.defaultCard.cooldownSprite.scale.setTo(1,0);
        this.defaultCard.cooldownSprite.alpha=0.8;
        this.defaultCard.overlay = this.game.add.sprite(100, 495, 'card_overlay');
        this.defaultCard.overlay.inputEnabled=true;
        this.defaultCard.overlay.thing=this.defaultCard.thing;
        this.defaultCard.overlay.defaultCard=true;
        this.defaultCard.overlay.events.onInputDown.add(this.cardOnClick,this);




        this.randomGenerator = new Phaser.RandomDataGenerator(1337);


        console.log("game state create() finished");

        //Ajout du monstre
        this.monster = game.add.sprite(650, 240, 'monster');
        this.monster.checkWorldBounds = true;
        this.monster.outOfBoundsKill = true;
        this.monster.life = 100;
        this.monster.enableBody = true;
        this.monster.animations.add('idle', [0,1], 3, true);
        this.monster.animations.add('attack', [2,3], 3, false);
        this.monster.animations.play('idle');




        //Ajout du container de lifebar
        this.addLifebar();

        // Groupe ennemi
        this.ennemies    = game.add.group();
        this.ennemies.enableBody = true;
        this.ennemies.createMultiple(25, "enemy_base");


        //calques pour détecter les ennemis pris dans une explosion
        this.explosions    = game.add.group();
        this.explosions.enableBody = true;
        this.explosions.createMultiple(5, "explosion_overlay");
        this.explosions.setAll('anchor.x', 0.5);
        this.explosions.setAll('anchor.y', 0.5);


        //Colisions, a voir plus tard
        /*game.physics.arcade.collide(this.ennemies);
        game.physics.enable(this.ennemies, Phaser.Physics.ARCADE);*/

        this.projectiles = game.add.group();
        this.projectiles.enableBody = true;
        this.projectiles.createMultiple(25, "sprite_rock");
        game.physics.arcade.collide(this.ennemies, this.projectiles);
        game.physics.arcade.collide(this.ennemies,this.explosions);

        //TODO Parametrer dans le niveau l'interval d'apparition des ennelus
        this.loopEnnemies = game.time.events.loop(2250, this.addEnnemy, this);


        //dot sur le feu
        this.loopFireDot = game.time.events.loop(1000, this.fireDot, this);

        //Particules explosions
        this.emitterExplosion = game.add.emitter(0, 0 , 180);
        this.emitterExplosion.setXSpeed(-150, 150);
        this.emitterExplosion.setYSpeed(-150, 150);
        this.emitterExplosion.minParticleScale = 0.8;
        this.emitterExplosion.maxParticleScale = 1.6;
        this.emitterExplosion.gravity = 5;
        this.emitterExplosion.makeParticles('particle_fire');

        //Particules feu
        this.emitterFire = game.add.emitter(0, 0 , 30);
        this.emitterFire.setXSpeed(0, 0);
        this.emitterFire.setYSpeed(-15, -10);
        this.emitterFire.minParticleScale = 1.8;
        this.emitterFire.maxParticleScale = 1.6;
        this.emitterFire.gravity = 5;
        this.emitterFire.makeParticles('particle_fire');



    },

    update : function(){

      //mise à jour des ennemis
      var nbEnnemies = this.ennemies.children.length;
      var gotBoostNextFrame = false;
      if(nbEnnemies > 0){
          for(var i = 0, l = nbEnnemies; i < l; ++i){
            if(this.ennemies.children[i].alive === true){
              if(this.ennemies.children[i].body.velocity.y >  0 && this.ennemies.children[i].y > 200){
                this.ennemies.children[i].body.velocity.y = 0;
              }

              if(this.ennemies.children[i].x > (585 -  this.ennemies.children[i].range)){
                this.ennemies.children[i].animations.play('attack');
                this.ennemies.children[i].body.velocity.x = 0;
                if(this.ennemies.children[i].attackCooldown > 0)
                  this.ennemies.children[i].attackCooldown--;
                else{
                  this.ennemyAttackMonster(this.ennemies.children[i].damage);
                  this.ennemies.children[i].attackCooldown = 60;
                }

                if(this.ennemies.children[i].type === "support"){
                  gotBoostNextFrame = true;
                }
              }else{
                if(this.enemiesGotSpeedBoost === true){
                  this.ennemies.children[i].x+=1;
                }
              }else{
                this.ennemies.children[i].body.velocity.x = this.ennemies.children[i].initialSpeed;
              }


            }
          }
          game.physics.arcade.overlap(this.projectiles, this.ennemies, this.damageEnnemy, null, this);
          game.physics.arcade.overlap(this.explosions, this.ennemies, this.explosionDamage, null, this);
      }
      this.enemiesGotSpeedBoost = gotBoostNextFrame;
        if(gotBoostNextFrame){
            if(!this.gameSounds.maracas.isPlaying){
                this.gameSounds.maracas.play("",0,0.5,true);
            }
        }else{
            if(this.gameSounds.maracas.isPlaying){
                this.gameSounds.maracas.stop();
            }
        }

      var nbDead = this.deadEnnemies.children.length;
      if(nbDead > 0){
          for(var i = 0, l = nbDead; i < l; ++i){
            if(this.deadEnnemies.children[i].alive === true){
              this.deadEnnemies.children[i].angle += 8;
              this.deadEnnemies.children[i].y += this.deadEnnemies.children[i].speedY;
              this.deadEnnemies.children[i].speedY += 0.1;

            }
          }
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
                            if(this.projectiles.children[i].properties.indexOf('explosive') > -1){
                                this.addExplosion(this.projectiles.children[i].x,this.projectiles.children[i].y,this.projectiles.children[i].damage,this.projectiles.children[i].properties);
                                this.projectiles.children[i].kill();
                            }else if(this.projectiles.children[i].properties.indexOf('bounce') > -1){
                                this.projectiles.children[i].speedY=Math.abs(this.projectiles.children[i].speedY);
                                this.projectiles.children[i].y=450;
                                this.gameSounds[this.projectiles.children[i].type].play();
                            }else{
                                this.projectiles.children[i].kill();
                            }

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
        //destruction des calques d'explosion encore actifs
          var nbExplosions = this.explosions.children.length;
          if(nbExplosions > 0){
              for(var i = 0, l = nbExplosions; i < l; ++i){
                if(this.explosions.children[i].alive === true){
                    this.explosions.children[i].kill();
                }
              }
          }

        if(this.shuffling){
            this.shuffleTimer -=this.shuffleEvent.timer.elapsed;
            this.drawBarFull.scale.setTo(1,-this.shuffleTimer/this.shuffleCooldown);
        }else{
            if(this.deck.length===0&&this.hand.length===0){
                this.shuffling=true;
                this.shuffleEvent = game.time.events.add(this.shuffleCooldown, this.initDeck, this);
                this.shuffleTimer = this.shuffleCooldown;
            }else{
                this.drawTimer -=this.autoDraw.timer.elapsed;
                this.drawBarFull.scale.setTo(1,-this.drawTimer/this.drawCooldown);
            }
        }



        if(this.defaultCard.timer>=0){
            this.defaultCard.timer--;
            this.defaultCard.cooldownSprite.scale.setTo(1,-this.defaultCard.timer/this.defaultCard.cooldown);
        }



    },

    addLifebar: function(){
        this.lifebar     = game.add.sprite(game.global.gameWidth/2,25,"lifebar");
        this.lifebar.x-=this.lifebar.width/2;
        this.lifebarFull = game.add.sprite(game.global.gameWidth/2,25,"lifebar_full");
        this.lifebarFull.x-=this.lifebarFull.width/2;

    },

    addEnnemy: function(){
      var ennemy = this.ennemies.getFirstDead();

      var type = this.getAvailableEnemyType(this.randomGenerator.integerInRange(0,this.totalEnemySpawnChance));

      var ennemyData = enemyData[type];


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
        ennemy.loadTexture("enemy_"+type);
        ennemy.tint="0xffffff";
        ennemy.onFire=0;
        ennemy.animations.add('move', [0,1], 12, true);
        ennemy.animations.add('attack', [2,3], 2, true);
        ennemy.animations.play('move');

          var spawnY;
          switch(type){
              case "armored":
              case "support":
              case "dark":
              case "base": spawnY=this.randomGenerator.integerInRange(350,400); break;
              case "flying_base": spawnY=this.randomGenerator.integerInRange(50,150); break;
          }

        ennemy.type = type;
        ennemy.reset(0 , spawnY);

        ennemy.range = ennemyData['range'];
        ennemy.body.velocity.x = ennemyData['speed'] * 60;
        ennemy.initialSpeed = ennemyData['speed'] * 60;
        if(ennemyData['pattern'] === "flying"){
          ennemy.body.velocity.y = ennemyData['speed'] * 30;

        }
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
        projectile.speedX = projectileData.speed.x;
        projectile.speedY = projectileData.speed.y;
        projectile.type=type;

        projectile.projectileId = this.nextProjectileId;
        this.nextProjectileId++;
        projectile.checkWorldBounds = true;
        projectile.outOfBoundsKill = true;
        projectile.anchor.setTo(0.5, 0.5);
        projectile.loadTexture("sprite_"+type);
        projectile.reset(x, y);

        this.monster.animations.play('attack');
        this.monster.events.onAnimationComplete.add(function(){
          this.monster.animations.play('idle');
        }, this);
      }
    },

    addExplosion: function(x,y,damage,properties){
        var explosion = this.explosions.getFirstDead();
        if(explosion){
            this.emitterExplosion.x=x;
            this.emitterExplosion.y=y;
            this.emitterExplosion.start(true, 400, null, 90);
            explosion.reset(x, y);
            explosion.damage = damage;
            explosion.properties = properties;
            //game.physics.arcade.overlap(this.exposions, this.ennemies, this.explosionDamage, null, this);

        }


    },

    fireDot : function(){
        //mise à jour des ennemis
          var nbEnnemies = this.ennemies.children.length;
          if(nbEnnemies > 0){
              for(var i = 0, l = nbEnnemies; i < l; ++i){
                if(this.ennemies.children[i].alive === true){
                    if(this.ennemies.children[i].onFire>0){
                        this.emitterFire.x=this.ennemies.children[i].x+this.ennemies.children[i].width/2;
                        this.emitterFire.y=this.ennemies.children[i].y;
                        this.emitterFire.start(true, 1750, null, 1);
                        this.ennemies.children[i].life-=0.5;
                        if(this.ennemies.children[i].life <= 0){
                            this.killEnemy(this.ennemies.children[i]);

                        }
                        this.ennemies.children[i].onFire--;
                        if(this.ennemies.children[i].onFire<=0){
                            this.ennemies.children[i].tint="0xffffff";
                        }
                    }

                }
              }
          }
    },

    explosionDamage : function(explosion, ennemy){
        ennemy.life -= explosion.damage;
        if(ennemy.life <= 0){
            this.killEnemy(ennemy);

        }else{
            this.gameSounds.enemy_hit.play();
            if(explosion.properties.indexOf('knockback') > -1){

                game.add.tween(ennemy).to({"x" : ennemy.x-75}).easing(Phaser.Easing.Exponential.Out).start();
            }
            if(explosion.properties.indexOf('fire') > -1){

                ennemy.onFire=4;
                ennemy.tint="0xff4400";
            }
        }
    },

    killEnemy: function(ennemy){
        this.score+=ennemy.score;

        var dead = this.deadEnnemies.getFirstDead();
        if(dead != null){
          dead.loadTexture("enemy_"+ennemy.type);
          dead.angle = 0;
          dead.speedY = -2;
          dead.checkWorldBounds = true;
          dead.outOfBoundsKill = true;
          dead.reset( ennemy.x, ennemy.y + (ennemy.width/2))
        }


        ennemy.kill();
        this.gameSounds.enemy_destroyed.play();
        this.updateScore();
        this.enemiesKilled++;
        this.updateAvailableEnemies();

    },


    damageEnnemy: function(projectile, ennemy) {
      //Si l'ennemi ne s'est pas pris de dégat par ce projectile
      if(ennemy.damageBy.indexOf(projectile.projectileId) === -1){
        ennemy.damageBy.push(projectile.projectileId);

        ennemy.life -= projectile.damage;
        //Si le projectile n'est pas perforant
        if(projectile.properties.indexOf('piercing') === -1 && projectile.properties.indexOf('bounce') === -1){
            if(projectile.properties.indexOf('explosive') > -1){
                this.addExplosion(ennemy.x+ennemy.width/2,ennemy.y+ennemy.height/2,projectile.damage,projectile.properties);
            }
            projectile.kill();

        }

        if(projectile.properties.indexOf('bounce') > -1){
            projectile.speedY  = Math.abs(projectile.speedY);
            this.gameSounds[projectile.type].play();
        }

        if(ennemy.life <= 0){
            this.killEnemy(ennemy);

        }else{
            this.gameSounds.enemy_hit.play();
            if(projectile.properties.indexOf('knockback') > -1){

                game.add.tween(ennemy).to({"x" : ennemy.x-75}).easing(Phaser.Easing.Exponential.Out).start();
            }
            if(projectile.properties.indexOf('fire') > -1){

                ennemy.onFire=4;
                ennemy.tint="0xff4400";
            }
        }
        //console.log(ennemy.life);

      }

    },
    updateScore : function(){
        var scoreString= ""+this.score;

        while(scoreString.length<8){
            scoreString="0"+scoreString;
        }
        this.scoreDisplay.text="Score : "+scoreString;

    },
    updateAvailableEnemies : function(){

        var keys = Object.keys(enemyData);
        for(var i = 0,l = keys.length;i<l;i++){
            if(this.availableEnemies.indexOf(enemyData[keys[i]].id)<0&&enemyData[keys[i]].spawnthreshold<=this.enemiesKilled){
                this.availableEnemies.push(enemyData[keys[i]].id);
                this.totalEnemySpawnChance+=enemyData[keys[i]].spawnchance;

           }
        }
    },

    getAvailableEnemyType : function(roll){
        var current = 0;
        var type = "base";
        //console.log(type);
        for(var i =0,l = this.availableEnemies.length;i<l;i++){
            if(roll>=current && roll<current+enemyData[this.availableEnemies[i]].spawnchance){
                type=this.availableEnemies[i];break;
            }
            current+=enemyData[this.availableEnemies[i]].spawnchance;
        }
        return type;
    },

    initDeck : function(){
        this.deck=JSON.parse(JSON.stringify(this.stock));



        this.deck = this.shuffleArray(this.deck);

        this.resetHand();for(var i =0;i<3;i++){
            game.time.events.add(i*500, this.drawCards, this, 1);
        }
        this.gameSounds.shuffle.play();
        this.shuffling=false;
        this.shuffleEvent=null;
        game.time.events.remove(this.autoDraw);
        this.autoDraw = game.time.events.loop(this.drawCooldown, this.drawCards, this,1);




    },

    shuffleArray : function(o){
        for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    },

    resetHand : function(){
        for(var l= this.hand.length,i=l-1;i>=0;i--){
            this.removeFromHand(i);
        }
    },

    removeFromHand : function(index){
        this.destroyCard(this.hand[index]);
        this.hand.splice(index,1);
        this.redrawHand();
    },

    destroyCard : function(card){
        card.template.destroy(true);
        card.icon.destroy(true);
        card.trajectory.destroy(true);
        card.damage.destroy(true);
        card.overlay.destroy(true);

    },

    //redraw hand in case of delete
    redrawHand : function (){
        for(var l= this.hand.length,i=l-1;i>=0;i--){
            this.destroyCard(this.hand[i]);
            this.addCardToHand(this.hand[i],i);
        }
    },

    drawCards : function(howMany){
        if(!this.shuffling){
            this.drawTimer=this.drawCooldown;
            if(!howMany)howMany=1;
            console.log("trying to draw "+howMany+" card(s)...");

            for(var i=0; i<howMany;i++){
                if(this.hand.length<5){

                    var card = this.deck.shift();
                    this.deckBack.frame = Math.min(3,this.deck.length);
                    this.deckDisplay.text=this.deck.length+" / "+this.stock.length;
                    if(typeof(card) !== "undefined"){
                        console.log("drawing card...");
                        if(card.properties.indexOf("rare")>-1){
                            this.gameSounds.draw_rare.play();
                        }else{
                            this.gameSounds.draw.play();
                        }
                        var cardObj = {"thing":card};
                        cardObj=this.addCardToHand(cardObj,this.hand.length);
                        this.hand.push(cardObj);
                    }



                }
            }
        }

    },

    addCardToHand : function(cardObj,handIndex){

        if(cardObj.thing.properties.indexOf("rare")>-1){
            cardObj.template = this.game.add.sprite(200+handIndex * 70, 495, 'card_template_rare');
        }else{
            cardObj.template = this.game.add.sprite(200+handIndex * 70, 495, 'card_template');
        }
        cardObj.icon = this.game.add.sprite(200+handIndex * 70 + 32, 532, 'icon_'+cardObj.thing.id);
        cardObj.icon.anchor.setTo(0.5, 0.5);
        cardObj.trajectory = this.game.add.sprite(248+handIndex * 70, 585, 'trajectory_'+cardObj.thing.trajectory);
        cardObj.trajectory.anchor.setTo(0.5, 0.5);
        cardObj.damage = this.game.add.text(216+handIndex * 70, 587, cardObj.thing.damage,{"fontSize": 18});
        cardObj.damage.anchor.setTo(0.5, 0.5);
        cardObj.overlay = this.game.add.sprite(200+handIndex * 70, 495, 'card_overlay');
        cardObj.overlay.inputEnabled=true;
        cardObj.overlay.thing=cardObj.thing;
        cardObj.overlay.handIndex=handIndex;
        cardObj.overlay.events.onInputDown.add(this.cardOnClick,this);

        return cardObj;

    },

    cardOnClick : function(sprite, pointer){
        console.log(sprite.thing);
        var thing = sprite.thing;
        if(sprite.defaultCard){
            if(this.defaultCard.timer<=0){

                this.defaultCard.timer=this.defaultCard.cooldown;
                this.addProjectile(this.monster.x+thing.offset.x,this.monster.y+thing.offset.y,thing.id);

            }
        }else{

            this.addProjectile(this.monster.x+thing.offset.x,this.monster.y+thing.offset.y,thing.id);
            this.removeFromHand(sprite.handIndex);
        }
    },

    ennemyAttackMonster : function(damage){

        this.gameSounds.player_hit.play();
          this.monster.life -= damage;
          if(this.monster.life < 0){
            this.monster.kill();
            game.state.start('gameover', true, false, this.score);
          }
          this.lifebarFull.scale.setTo(this.monster.life / 100, 1);
          //console.log(damage);
    }
};
