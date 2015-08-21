var game;

window.onload = function() {

    
    game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameDiv');
    //console.log(achievements);
    game.global =
    {
        enterLastValue : false,
        gameWidth : 800,
        gameHeight : 600        
        
    };
    
    
    // Ajout de tous les états du jeu
    game.state.add('boot', bootState);
    game.state.add('load', loadState);
    game.state.add('game', gameState);    

    // Etat de départ
    game.state.start('boot');
};