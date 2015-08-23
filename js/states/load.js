var loadState = {

    preload : function(){
        console.log("Load state preload");

        // Affichage de l'image de fond
        var background = game.stage.backgroundColor = '#199BC4';


        // Affichage de la progress bar
        //This is the bright blue bar that is hidden by the dark bar
        this.barBg = game.add.sprite(game.world.centerX, game.world.centerY + 80, 'progress_bar_bg');
        this.barBg.anchor.setTo(0.5, 0.5);
        //This bar will get cropped by the setPreloadSprite function as the game loads!
        this.bar = game.add.sprite(game.world.centerX - 240, game.world.centerY + 80, 'progress_bar');
        this.bar.anchor.setTo(0, 0.5);
        game.load.setPreloadSprite(this.bar);



        //load things
        var keys = Object.keys(thingsData);
        for(var i = 0,l = keys.length;i<l;i++){
            game.load.image('sprite_'+keys[i] , 'assets/graphics/sprite_'+keys[i]+'.png');
            game.load.image('icon_'+keys[i] , 'assets/graphics/icon_'+keys[i]+'.png');
            game.load.image('trajectory_'+thingsData[keys[i]].trajectory , 'assets/graphics/trajectoire_'+thingsData[keys[i]].trajectory+'.png');
            game.load.audio('sound_'+keys[i],['assets/audio/sound_'+keys[i]+'.wav',]);
        }

        //load enemies
        var keys = Object.keys(enemyData);
        for(var i = 0,l = keys.length;i<l;i++){
            //game.load.image();
            if(keys[i]==="flying_base"){                
                game.load.spritesheet('enemy_'+keys[i] , 'assets/graphics/enemy_'+keys[i]+'.png', 65, 150,4);
            }else{
                game.load.spritesheet('enemy_'+keys[i] , 'assets/graphics/enemy_'+keys[i]+'.png', 65, 100,4);
                    
            }

        }
        // Chargement des images;
        game.load.spritesheet('monster' , 'assets/graphics/monster.png', 128, 220, 4);
        game.load.spritesheet('deck_back' , 'assets/graphics/card_back.png', 70, 107, 4);

        game.load.image('card_template' , 'assets/graphics/card_template.png');
        game.load.image('card_template_default' , 'assets/graphics/card_template_default.png');
        game.load.image('card_template_rare' , 'assets/graphics/card_template_rare.png');
        game.load.image('card_overlay' , 'assets/graphics/card_overlay.png');
        game.load.image('card_cooldown' , 'assets/graphics/card_cooldown.png');
        game.load.image('lifebar' , 'assets/graphics/lifebar.png');
        game.load.image('lifebar_full' , 'assets/graphics/lifebar_full.png');
        game.load.image('lifesprite_full' , 'assets/graphics/lifesprite_full.png');
        game.load.image('lifesprite_dead' , 'assets/graphics/lifesprite_dead.png');
        game.load.image('drawbar' , 'assets/graphics/drawbar.png');
        game.load.image('drawbar_full' , 'assets/graphics/drawbar_full.png');
        game.load.image('background' , 'assets/graphics/background_game.png');
        
        game.load.image('particle_fire' , 'assets/graphics/particle_fire.png');
        game.load.image('explosion_overlay' , 'assets/graphics/explosion_overlay.png');

        // Chargement des sons
        game.load.audio('draw_rare',['assets/audio/draw_rare.wav',]);
        game.load.audio('enemy_destroyed',['assets/audio/enemy_destroyed.wav',]);
        game.load.audio('enemy_hit',['assets/audio/enemy_hit.wav',]);
        game.load.audio('player_hit',['assets/audio/player_hit.wav',]);
        
        //
        game.load.audio('MonstA',['assets/audio/MonstA.ogg',]);
        game.load.audio('maracas',['assets/audio/maracas.ogg',]);
        game.load.audio('shuffle',['assets/audio/shuffle.ogg',]);
        game.load.audio('draw',['assets/audio/draw.ogg',]);
        
       
        
        
        
    },
    create : function(){
        game.global.bgm = game.add.audio("MonstA");
        game.global.bgm.play("",0,0.3,true);
        // On démarre l'état du menu
        game.state.start('game');
    },

    update : function(){


    }

};
