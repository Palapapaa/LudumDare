var bootState = {
 
    preload : function(){
        console.log("Boot state preload");

        // Mise en place de la progress bar
        game.load.image('progress_bar_bg' , 'assets/progress_bar_bg.png');
        game.load.image('progress_bar' , 'assets/progress_bar.png');
    },
    
    create : function(){
        // Mise en place des paramètres de base du jeu
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        // On démarre l'état de chargement
        game.state.start('load');        
    },
    
};