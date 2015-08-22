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
        for(var i = 0,l = thingsData.length;i<l;i++){
            game.load.image('sprite_'+thingsData[i].id , 'assets/graphics/sprite_'+thingsData[i].id+'.png');
            game.load.image('icon_'+thingsData[i].id , 'assets/graphics/icon_'+thingsData[i].id+'.png');
            game.load.image('trajectoire_'+thingsData[i].id , 'assets/graphics/trajectoire_'+thingsData[i].id+'.png');
            game.load.audio('sound_'+thingsData[i].id,['assets/audio/sound_'+thingsData[i].id+'.wav',]);
        }
        
        //load enemies
        for(var i = 0,l = enemyData.length;i<l;i++){
            game.load.image('enemy_'+enemyData[i].id , 'assets/graphics/enemy_'+enemyData[i].id+'.png');
        }
        // Chargement des images;
        game.load.image('monster' , 'assets/graphics/monster.png');
        game.load.image('lifebar' , 'assets/graphics/lifebar.png');
        game.load.image('background' , 'assets/graphics/background_game.png');
        game.load.image('enemy_base' , 'assets/graphics/enemy_base.png');


        // Chargement des sons
        game.load.audio('hollande1',['assets/audio/hollande1.ogg',]);
        game.load.audio('hollande2',['assets/audio/hollande2.ogg',]);
    },
    create : function(){
        // On démarre l'état du menu
        game.state.start('game');
    },

    update : function(){


    }




};
