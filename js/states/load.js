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
            game.load.image('trajectoire_'+thingsData[keys[i]].trajectory , 'assets/graphics/trajectoire_'+thingsData[keys[i]].trajectory+'.png');
            game.load.audio('sound_'+keys[i],['assets/audio/sound_'+keys[i]+'.wav',]);
        }

        //load enemies
        var keys = Object.keys(enemyData);
        for(var i = 0,l = keys.length;i<l;i++){
            game.load.image('enemy_'+keys[i] , 'assets/graphics/enemy_'+keys[i]+'.png');
        }
        // Chargement des images;
        game.load.image('monster' , 'assets/graphics/monster.png');
        game.load.image('card_template' , 'assets/graphics/card_template.png');
        game.load.image('card_overlay' , 'assets/graphics/card_overlay.png');
        game.load.image('lifebar' , 'assets/graphics/lifebar.png');
        game.load.image('lifebar_full' , 'assets/graphics/lifebar_full.png');
        game.load.image('background' , 'assets/graphics/background_game.png');
        game.load.image('enemy_base' , 'assets/graphics/enemy_base.png');
        game.load.image('sprite_rock' , 'assets/graphics/sprite_rock.png');


        // Chargement des sons
        game.load.audio('enemy_hit',['assets/audio/enemy_hit.wav',]);
        game.load.audio('player_hit',['assets/audio/player_hit.wav',]);
        game.load.audio('enemy_destroyed',['assets/audio/enemy_destroyed.wav',]);
        game.load.audio('draw_rare',['assets/audio/draw_rare.wav',]);
    },
    create : function(){
        // On démarre l'état du menu
        game.state.start('game');
    },

    update : function(){


    }

};
