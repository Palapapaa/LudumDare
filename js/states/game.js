var gameState = {

    //chargement des params du niveau
    init : function(){
        //console.log("Game state init");

    },

    preload : function(){
        //console.log("Game state preload");
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
        game.add.sprite(-20,-20,"background_game");
        //cards not yet drawn by the player
        this.deck = [];
        this.stock = [];
        //stock initial de cartes
        for(var i=0; i<3;i++){
            this.stock.push(thingsData.caddie);
        }
        for(var i=0; i<0;i++){
            this.stock.push(thingsData.caddie_TNT);
        }
        for(var i=0; i<5;i++){
            this.stock.push(thingsData.rock);
        }
        for(var i=0; i<0;i++){
            this.stock.push(thingsData.eggplant);
        }
        for(var i=0; i<0;i++){
            this.stock.push(thingsData.paperplane);
        }
        for(var i=0; i<3;i++){
            this.stock.push(thingsData.duck);
        }
        for(var i=0; i<0;i++){
            this.stock.push(thingsData.cochon);
        }
        for(var i=0; i<1;i++){
            this.stock.push(thingsData.molotov);
        }
        for(var i=0; i<0;i++){
            this.stock.push(thingsData.saucisse);
        }
        for(var i=0; i<0;i++){
            this.stock.push(thingsData.cookie);
        }
        for(var i=0; i<0;i++){
            this.stock.push(thingsData.pepper);
        }
        // cards currently visible on the GUI the player can use
        this.hand = [];

        //chance for item drops
        var keys = Object.keys(thingsData);
        this.totalDropChance = 0;
        for(var i = 0,l = keys.length;i<l;i++){
            this.totalDropChance+=thingsData[keys[i]].dropchance;

        }
        //console.log(this.totalDropChance);

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
        this.gameSounds.discard = game.add.audio("discard");
        this.gameSounds.shuffle = game.add.audio("shuffle");

        this.gameSounds.maracas = game.add.audio("maracas");
        //this.gameSounds.maracas.play("",0,0.5,true);


        //Ennemis decedaient
        this.deadEnnemies = game.add.group();
        this.deadEnnemies.createMultiple(25, "enemy_base");
        this.deadEnnemies.setAll('anchor.x', 0.5);
        this.deadEnnemies.setAll('anchor.y', 0.5);
        game.physics.enable(this.deadEnnemies, Phaser.Physics.ARCADE);
       

         

        this.randomGenerator = new Phaser.RandomDataGenerator(1337);


        //console.log("game state create() finished");

        //Ajout du monstre
        this.monster = game.add.sprite(650, 240, 'monster');
        this.monster.checkWorldBounds = true;
        this.monster.outOfBoundsKill = true;
        this.monster.life = 100;
        this.monster.enableBody = true;
        this.monster.animations.add('idle', [0,1], 3, true);
        this.monster.animations.add('attack', [2,3], 4, false);
        this.monster.animations.play('idle');
        game.physics.enable(this.monster, Phaser.Physics.ARCADE);

        //Flèches
        this.arrows = game.add.group();
        this.arrows.createMultiple(25, "arrow");
        game.physics.enable(this.arrows, Phaser.Physics.ARCADE);
        game.physics.arcade.collide(this.arrows,this.monster);

        
        this.distraction =false;

        // Groupe ennemi
        this.ennemies    = game.add.group();
        this.ennemies.enableBody = true;
        this.ennemies.createMultiple(25, "enemy_base");
        this.ennemies.setAll('anchor.x', 0.5);

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

        //Particules damage
        this.emitterDamage = game.add.emitter(0, 0 , 180);
        this.emitterDamage.setXSpeed(-150, 150);
        this.emitterDamage.setYSpeed(-150, 150);
        this.emitterDamage.minParticleScale = 0.6;
        this.emitterDamage.maxParticleScale = 0.8;
        this.emitterDamage.gravity = 0;
        this.emitterDamage.makeParticles('particle_damage');

        //Particules feu
        this.emitterFire = game.add.emitter(0, 0 , 30);
        this.emitterFire.setXSpeed(0, 0);
        this.emitterFire.setYSpeed(-15, -10);
        this.emitterFire.minParticleScale = 1.8;
        this.emitterFire.maxParticleScale = 1.6;
        this.emitterFire.gravity = 5;
        this.emitterFire.makeParticles('particle_fire');

        //shadows for the scene
        this.shadowmap = game.add.sprite(-20,-20,"shadowmap_game");
        this.shadowmap.blendMode = PIXI.blendModes.MULTIPLY;
        
        //score display
        this.score = 0;
        this.scoreDisplay = game.add.text(10,20,"SCORE : 00000000",{"fill" : "#CACACA","fontSize" : 24});
        
        
        //Ajout du container de lifebar
        this.addLifebar();
        
        
        this.deckBack = game.add.sprite(650, 490, 'deck_back');
        this.deckBack.frame =3;

        this.drawBar = this.game.add.sprite(725, 490, 'drawbar');
        this.drawBarFull = this.game.add.sprite(726, 596, 'drawbar_full');
        this.drawBarFull.scale.setTo(1,-1);
        this.deckDisplay = game.add.text(740, 490,"",{"fill" : "#CACACA","fontSize": 17});

        this.drawCooldown=3000;        
        this.drawCooldownBoost=1500;        
        this.shuffleCooldown=3750;
        
        this.drawBoost=false;
        this.drawTimer=this.drawCooldown;
        this.shuffling = false;
        this.shuffleTimer=this.shuffleCooldown;
        this.shuffleEvent = null;

        this.autoDraw = game.time.events.loop(this.drawCooldown, this.drawCards, this,1,true);

        this.initDeck();
        //draw more cards at the beginning
        /*
        for(var i =3;i<4;i++){
            game.time.events.add(i*500, this.drawCards, this, 1,false);
        }
        */
        

        //default card that is always available but has a cooldown
        this.defaultCard = {"thing" : thingsData.rock, "cooldown": 360, "timer" : 0};

        this.defaultCard.template = this.game.add.sprite(100, 495, 'card_template_default');
        this.defaultCard.icon = this.game.add.sprite(100 + 32, 532, 'icon_'+this.defaultCard.thing.id);
        this.defaultCard.icon.anchor.setTo(0.5, 0.5);
        this.defaultCard.trajectory = this.game.add.sprite(148, 584, 'trajectory_'+this.defaultCard.thing.trajectory);
        this.defaultCard.trajectory.anchor.setTo(0.5, 0.5);
        this.defaultCard.damage = this.game.add.text(119, 585, this.defaultCard.thing.damage,{"fontSize": 18});
        this.defaultCard.damage.anchor.setTo(0.5, 0.5);
        this.defaultCard.cooldownSprite = this.game.add.sprite(104, 590, 'card_cooldown');
        this.defaultCard.cooldownSprite.scale.setTo(1,0);
        this.defaultCard.cooldownSprite.alpha=0.8;
        this.defaultCard.overlay = this.game.add.sprite(100, 495, 'card_overlay');
        this.defaultCard.overlay.inputEnabled=true;
        this.defaultCard.overlay.thing=this.defaultCard.thing;
        this.defaultCard.overlay.defaultCard=true;
        this.defaultCard.overlay.events.onInputDown.add(this.cardOnClick,this);
        

    },

    update : function(){

      //mise à jour des ennemis
      var nbEnnemies = this.ennemies.children.length;
      var gotBoostNextFrame = false;
      if(nbEnnemies > 0){
          for(var i = 0, l = nbEnnemies; i < l; ++i){
            if(this.ennemies.children[i].alive === true){
                var enemy = this.ennemies.children[i];
              if(enemy.body.velocity.y >  0 && enemy.y > 200){
                enemy.body.velocity.y = 0;
              }

              if(enemy.x > (585 -  enemy.range)&&!this.distraction){
                enemy.animations.play('attack');
                enemy.body.velocity.x = 0;
                if(enemy.attackCooldown > 0)
                  enemy.attackCooldown--;
                else{                  
                  enemy.attackCooldown = 60;
                  if(enemy.type === "archer"){
                    var arrow = this.arrows.getFirstDead();
                    if(arrow){
                      arrow.checkWorldBounds = true;
                      arrow.outOfBoundsKill = true;
                      arrow.speedY = -1;
                      arrow.reset(enemy.x , enemy.y);
                    }
                  }else{
                      this.ennemyAttackMonster(enemy.damage);
                  }
                }

                if(enemy.type === "support"){
                  gotBoostNextFrame = true;
                }
              }else{
                  if(this.distraction){
                      enemy.body.velocity.x = -(enemy.initialSpeed);
                        enemy.x-=0.5;
                  }else{
                      enemy.body.velocity.x = enemy.initialSpeed;
                        if(this.enemiesGotSpeedBoost === true){
                          enemy.x+=0.5;
                        }
                  }
                
                if(enemy.animations.currentAnim.name!=="move"){
                    enemy.animations.play('move');
                }
                   
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
        this.distraction = false;
        this.ennemies.setAll('scale.x', 1);
      var nbProjectiles = this.projectiles.children.length;
      if(nbProjectiles  > 0){
        for(var i = 0, l = nbProjectiles; i < l; ++i){
            if(this.projectiles.children[i].alive){
                var projectile = this.projectiles.children[i];
                if(projectile.properties.indexOf('distraction') > -1){
                    this.distraction=true;
                    this.ennemies.setAll('scale.x', -1);
                }                
                switch(projectile.trajectory){
                    case "lob" : {
                        if(!projectile.mineLanded){
                            projectile.angle-=10;                                
                        }
                        projectile.x -= projectile.speedX;
                        projectile.y -= projectile.speedY;
                        projectile.speedY -= 0.1;
                        if(projectile.y>450){
                            if(projectile.properties.indexOf('explosive') > -1 && projectile.properties.indexOf('mine') < 0){
                                this.gameSounds.enemy_destroyed.play();
                                this.addExplosion(projectile.x,projectile.y,projectile.damage,projectile.properties);
                                projectile.kill();
                            }else if(projectile.properties.indexOf('bounce') > -1){
                                projectile.speedY=Math.abs(projectile.speedY);
                                projectile.y=450;
                                this.gameSounds[projectile.type].play();
                            }else if(projectile.properties.indexOf('mine') > -1){                                                                   
                                projectile.y=450;
                                if(!projectile.mineLanded){ 
                                    projectile.speedX=0;  
                                    projectile.mineLanded=true;  
                                    game.time.events.add(2500, this.activateMine, this, projectile);
                                }
                                
                            }else{
                                projectile.kill();
                            }

                        }
                        break;
                    }
                    case "groundstraight" : {
                        projectile.x -= projectile.speedX;
                        if(projectile.x<-50){
                            projectile.kill();
                        }
                        break;
                    }
                    case "boomerang" : {                        
                        projectile.angle-=10;
                        projectile.x -= projectile.speedX;
                        //boomerang piercing resets when coming back
                        if(projectile.speedX>0&&projectile.speedX-0.05<=0){
                            projectile.projectileId = this.nextProjectileId;
                            this.nextProjectileId++;
                        }
                        if(projectile.speedX<=0){
                            projectile.y -= projectile.speedY;
                        }
                        projectile.speedX -= 0.05; if(projectile.x<-50||projectile.x>game.global.gameWidth+50){
                            projectile.kill();
                        }
                        break;
                    }
                    case "glide" : {
                        projectile.x -= projectile.speedX;
                        if(projectile.x<150){
                            projectile.angle-=8;
                            projectile.y += projectile.speedY;
                        }
                        if(projectile.y>450){

                           projectile.kill();


                        }
                        break;
                    }

                }

            }
        }

      }
      //Fleches
        var nbArrows = this.arrows.children.length;
        if(nbArrows > 0){
            for(var i = 0, l = nbArrows; i < l; ++i){
              if(this.arrows.children[i].alive === true){

                  this.arrows.children[i].x+= 3;
                  this.arrows.children[i].y+= this.arrows.children[i].speedY;
                  this.arrows.children[i].speedY += 0.01;
                  game.physics.arcade.overlap(this.arrows.children[i], this.monster, this.killArrow, null, this);
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
        
        //barre de la pioche
        if(this.shuffling){
            this.shuffleTimer -=this.shuffleEvent.timer.elapsed;
            this.drawBarFull.scale.setTo(1,-this.shuffleTimer/this.shuffleCooldown);
        }else{
            if(this.deck.length===0&&this.hand.length===0){
            //if(this.deck.length===0){
                this.shuffling=true;
                this.shuffleEvent = game.time.events.add(this.shuffleCooldown, this.initDeck, this);
                this.shuffleTimer = this.shuffleCooldown;
            }else{
                if(this.deck.length!==0){
                    this.drawTimer -=this.autoDraw.timer.elapsed;
                    if(this.drawBoost){                        
                        this.drawBarFull.scale.setTo(1,-this.drawTimer/this.drawCooldownBoost);
                    }else{                       
                        this.drawBarFull.scale.setTo(1,-this.drawTimer/this.drawCooldown); 
                    }
                }
                
            }
        }


        if(this.defaultCard.timer>=0){
            this.defaultCard.timer--;
            this.defaultCard.cooldownSprite.scale.setTo(1,-this.defaultCard.timer/this.defaultCard.cooldown);
        }



    },

    addLifebar: function(){
        this.lifebar_under     = game.add.sprite(game.global.gameWidth/2,26,"lifebar_under");
        this.lifebar_under.x-=this.lifebar_under.width/2;
        this.lifebarFull = game.add.sprite(game.global.gameWidth/2,26,"lifebar_full");
        this.lifebarFull.x-=this.lifebarFull.width/2;
        this.lifebar_above     = game.add.sprite(game.global.gameWidth/2,17,"lifebar_above");
        this.lifebar_above.x-=this.lifebar_above.width/2;

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
              case "fast":
              case "archer":
              case "base": spawnY=this.randomGenerator.integerInRange(350,400); break;
              case "flying_dark":
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
            if(projectileData.properties.indexOf("boost")>-1){
                //boost draw rate
                if(!this.drawBoost){                    
                    this.drawBoost=true;
                    game.time.events.add(7500, this.drawBoostStop, this, 1);
                    this.drawBarFull.loadTexture("drawbar_full_boost");        
                    game.time.events.remove(this.autoDraw);
                    this.drawCards(1,true);
                    this.autoDraw = game.time.events.loop(this.drawCooldownBoost, this.drawCards, this,1,true);
                }
                
            }else{
                projectile.angle=0;
                projectile.damage = projectileData.damage;
                projectile.properties = projectileData.properties;
                projectile.trajectory=projectileData.trajectory;
                projectile.speedX = projectileData.speed.x;
                projectile.speedY = projectileData.speed.y;
                projectile.type=type;
                projectile.mineActive=false;
                projectile.mineLanded=false;
                if(projectileData.properties.indexOf("mine")>-1){                    
                    projectile.tint="0x666666";
                }
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
        
        //drop a card every several ennemies killed
        if(this.enemiesKilled%6===3){            
            this.addCardToStock(this.getCardDrop(this.randomGenerator.integerInRange(0,this.totalDropChance)));
        }

    },


    damageEnnemy: function(projectile, ennemy) {
      //Si l'ennemi ne s'est pas pris de dégat par ce projectile
      if(ennemy.damageBy.indexOf(projectile.projectileId) === -1 && ((projectile.properties.indexOf('mine')>-1&&projectile.mineActive)||projectile.properties.indexOf('mine')===-1)){
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
            this.emitterDamage.x=ennemy.x+ennemy.width/2;
            this.emitterDamage.y=ennemy.y+ennemy.height/2;
            this.emitterDamage.start(true, 400, null, 30);
            if(projectile.properties.indexOf('knockback') > -1){

                game.add.tween(ennemy).to({"x" : ennemy.x-75}).easing(Phaser.Easing.Exponential.Out).start();
               
            }
            if(projectile.properties.indexOf('fire') > -1){

                ennemy.onFire=4;
                ennemy.tint="0xff4400";
            }
        }
        ////console.log(ennemy.life);

      }

    },
    updateScore : function(){
        var scoreString= ""+this.score;

        while(scoreString.length<8){
            scoreString="0"+scoreString;
        }
        this.scoreDisplay.text="SCORE : "+scoreString;

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
        ////console.log(type);
        for(var i =0,l = this.availableEnemies.length;i<l;i++){
            if(roll>=current && roll<current+enemyData[this.availableEnemies[i]].spawnchance){
                type=this.availableEnemies[i];break;
            }
            current+=enemyData[this.availableEnemies[i]].spawnchance;
        }
        return type;
    },
    
    getCardDrop : function(roll){
        var current = 0;
        var id = "rock";
        ////console.log(type);
        var keys = Object.keys(thingsData);
        for(var i =0,l = keys.length;i<l;i++){
            if(roll>=current && roll<current+thingsData[keys[i]].dropchance){
                id=thingsData[keys[i]].id;break;
            }
            current+=thingsData[keys[i]].dropchance;
        }
        return thingsData[id];
    },

    initDeck : function(){
        this.deck=JSON.parse(JSON.stringify(this.stock));



        this.deck = this.shuffleArray(this.deck);

        this.resetHand();for(var i =0;i<3;i++){
            game.time.events.add(i*500, this.drawCards, this, 1,false);
        }
        this.gameSounds.shuffle.play();
        this.shuffling=false;
        this.shuffleEvent=null;
        this.drawBoostStop();




    },
    
    drawBoostStop : function(){
        this.drawBoost=false;
        this.drawBarFull.loadTexture("drawbar_full");        
        game.time.events.remove(this.autoDraw);
        this.autoDraw = game.time.events.loop(this.drawCooldown, this.drawCards, this,1,true);
        this.drawTimer=this.drawCooldown;
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
        if(card.discard){
            card.discard.destroy(true);
        }
        if(card.overlay){
            card.overlay.destroy(true);
        }

    },

    //redraw hand in case of delete
    redrawHand : function (){
        for(var l= this.hand.length,i=l-1;i>=0;i--){
            this.destroyCard(this.hand[i]);
            this.addCardToHand(this.hand[i],i);
        }
    },

    drawCards : function(howMany,resetTimer){
        if(!this.shuffling){
            if(resetTimer){   
                if(this.drawBoost){                   
                    this.drawTimer=this.drawCooldownBoost;
               }else{                   
                    this.drawTimer=this.drawCooldown;
               }
            }
            if(!howMany)howMany=1;
            //console.log("trying to draw "+howMany+" card(s)...");

            for(var i=0; i<howMany;i++){
                if(this.hand.length<6){

                    var card = this.deck.shift();
                    this.deckBack.frame = Math.min(3,this.deck.length);
                    this.deckDisplay.text=this.deck.length+" / "+this.stock.length;
                    if(typeof(card) !== "undefined"){
                        //console.log("drawing card...");
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
            this.redrawHand();
        }

    },

    addCardToHand : function(cardObj,handIndex){

        if(cardObj.thing.properties.indexOf("rare")>-1){
            cardObj.template = this.game.add.sprite(200+handIndex * 75, 495, 'card_template_rare');
        }else{
            cardObj.template = this.game.add.sprite(200+handIndex * 75, 495, 'card_template');
        }
        cardObj.icon = this.game.add.sprite(200+handIndex * 75 + 32, 532, 'icon_'+cardObj.thing.id);
        cardObj.icon.anchor.setTo(0.5, 0.5);
        cardObj.trajectory = this.game.add.sprite(248+handIndex * 75, 584, 'trajectory_'+cardObj.thing.trajectory);
        cardObj.trajectory.anchor.setTo(0.5, 0.5);
        cardObj.damage = this.game.add.text(219+handIndex * 75, 585, cardObj.thing.damage,{"fontSize": 18});
        cardObj.damage.anchor.setTo(0.5, 0.5);
        cardObj.overlay = this.game.add.sprite(200+handIndex * 75, 495, 'card_overlay');
        cardObj.overlay.inputEnabled=true;
        cardObj.overlay.thing=cardObj.thing;
        cardObj.overlay.handIndex=handIndex;
        cardObj.overlay.events.onInputDown.add(this.cardOnClick,this);
        if(this.stock.length>20){
            cardObj.discard =this.game.add.sprite(205+handIndex * 75 , 500, 'sprite_discard');
            cardObj.discard.anchor.setTo(0.5, 0.5);
            cardObj.discard.inputEnabled=true;
            cardObj.discard.thing=cardObj.thing;
            cardObj.discard.handIndex=handIndex;
            cardObj.discard.events.onInputDown.add(this.discard,this);
        }
        return cardObj;

    },

    cardOnClick : function(sprite, pointer){
        //console.log(sprite.thing);
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
    
    discard : function(sprite, pointer){
        //console.log(sprite.thing);        
        var thing = sprite.thing;
        if(this.stock.length>20){
            this.gameSounds.discard.play();
            this.removeFromHand(sprite.handIndex);
            this.stock.splice(thing,1);
            this.deckDisplay.text=this.deck.length+" / "+this.stock.length;
        }
    },
    
    
    
    addCardToStock : function(thing){
        //this.deck.push(thing);
        var cardObj = {"thing" : thing,};
        var xInit = this.monster.x + this.monster.width/2 -32;
        var yInit = this.monster.y - this.monster.height/4;
        
        if(cardObj.thing.properties.indexOf("rare")>-1){
            cardObj.template = this.game.add.sprite(xInit, yInit, 'card_template_rare');
        }else{
            cardObj.template = this.game.add.sprite(xInit , yInit, 'card_template');
        }
        cardObj.icon = this.game.add.sprite(xInit + 32, yInit +37, 'icon_'+cardObj.thing.id);
        cardObj.icon.anchor.setTo(0.5, 0.5);
        cardObj.trajectory = this.game.add.sprite(xInit + 48, yInit +89, 'trajectory_'+cardObj.thing.trajectory);
        cardObj.trajectory.anchor.setTo(0.5, 0.5);
        cardObj.damage = this.game.add.text(xInit + 19 , yInit + 90, cardObj.thing.damage,{"fontSize": 18});
        cardObj.damage.anchor.setTo(0.5, 0.5);
        
        //make the card move and gradually disappear
        var moveDelay = 2500;
        var disappearDelay = 2000;
        
        game.add.tween(cardObj.template).to({"y" : yInit-75},moveDelay).easing(Phaser.Easing.Exponential.Out).start();
        game.add.tween(cardObj.template).to({"alpha" : 0},disappearDelay).easing(Phaser.Easing.Exponential.In).start();
        game.add.tween(cardObj.icon).to({"y" : yInit-75+37},moveDelay).easing(Phaser.Easing.Exponential.Out).start();
        game.add.tween(cardObj.icon).to({"alpha" : 0},disappearDelay).easing(Phaser.Easing.Exponential.In).start();
        game.add.tween(cardObj.trajectory).to({"y" : yInit-75 +89},moveDelay).easing(Phaser.Easing.Exponential.Out).start();
        game.add.tween(cardObj.trajectory).to({"alpha" : 0},disappearDelay).easing(Phaser.Easing.Exponential.In).start();
        game.add.tween(cardObj.damage).to({"y" : yInit-75 +90},moveDelay).easing(Phaser.Easing.Exponential.Out).start();
        game.add.tween(cardObj.damage).to({"alpha" : 0},disappearDelay).easing(Phaser.Easing.Exponential.In).start();
        
        game.time.events.add(3000, this.destroyCard, this,cardObj);
        
        this.stock.push(thing);        
        this.deck.push(thing);        
        this.deckDisplay.text=this.deck.length+" / "+this.stock.length;
    },
    activateMine : function(projectile){
        projectile.mineActive=true;
        projectile.tint="0xffffff";
        
    },
    ennemyAttackMonster : function(damage){

        this.gameSounds.player_hit.play();
          this.monster.life -= damage;
          if(this.monster.life < 0){
            this.monster.kill();
            if(this.gameSounds.maracas.isPlaying){
                this.gameSounds.maracas.stop();
            }
            game.state.start('gameover', true, false, this.score);
          }
          this.lifebarFull.scale.setTo(this.monster.life / 100, 1);
          ////console.log(damage);
    },

    killArrow : function(arrow){
        this.ennemyAttackMonster(enemyData.archer.damage);
        ////console.log("crève")
        arrow.kill();
    }
};
