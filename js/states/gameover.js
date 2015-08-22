var gameoverState = {

    init: function(score){
      this.score = score;
    },

    preload : function(){
        console.log("Gameover state preload");

        this.spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.menuSwitchCooldown=30;//temps avant de valider la sélection
    },


    create : function(){


        // Affichage du fond
        var background = game.stage.backgroundColor = '#199BC4';

        var goTitle = game.add.text(game.world.centerX, 120, 'GAME OVER',
        { font: 'bold 64px Arial', fill: '#ffffff' });
        goTitle.anchor.setTo(0.5, 0.5);
        var score = game.add.text(game.world.centerX, 300, 'Score : ' + this.score,
        { font: 'bold 64px Arial', fill: '#ffffff' });
        score.anchor.setTo(0.5, 0.5);
        var screenTitle = game.add.text(game.world.centerX, 480, 'Appuyez sur la touche espace pour continuer...',
        { font: 'bold 32px Arial', fill: '#ffffff' });
        screenTitle.anchor.setTo(0.5, 0.5);



    },

    update : function(){
         /*if(this.menuSwitchCooldown>0){
            this.menuSwitchCooldown--;
        }*/



        // On quitte le menu
        if(this.spacebar.isDown){
            this.select();
        }


    },


    //appui sur la touche select
    select : function(){
        //if(this.menuSwitchCooldown <= 0){

            game.state.start("game");
      //  }
    }
};
