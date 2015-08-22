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



        // Chargement des images
        game.load.image('hollande' , 'assets/graphics/hollande_sprite.png');
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
