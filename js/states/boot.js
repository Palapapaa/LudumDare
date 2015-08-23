var bootState = {
 
    preload : function(){
        console.log("Boot state preload");

        // Mise en place de la progress bar
        game.load.image('progress_bar_bg' , 'assets/graphics/progress_bar_bg.png');
        game.load.image('progress_bar' , 'assets/graphics/progress_bar.png');
        game.load.image('background_load' , 'assets/graphics/background_load.png');
    },
    
    create : function(){
        // Mise en place des paramètres de base du jeu
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        // On démarre l'état de chargement
        game.state.start('load');        
    },
    
};