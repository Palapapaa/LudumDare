var gameoverState = {

    init: function(score){
      this.score = score;
    },

    preload : function(){
        console.log("Gameover state preload");

        this.menuSwitchCooldown=30;//temps avant de valider la sélection
    },


    create : function(){


        // Affichage du fond
        game.add.sprite(0,0,"background_gameover");

       /* var goTitle = game.add.text(game.world.centerX, 120, 'GAME OVER',
        { font: 'bold 64px Arial', fill: '#ffffff' });
        goTitle.anchor.setTo(0.5, 0.5);*/
        var score = game.add.text(game.world.centerX, 300, 'FINAL SCORE : ' + this.score,
        { font: 'bold 64px Arial', fill: '#ffffff' });
        score.anchor.setTo(0.5, 0.5);
        
        this.clickable=false;
        game.time.events.add(1000, this.addTryAgain, this);

    },

    update : function(){
         /*if(this.menuSwitchCooldown>0){
            this.menuSwitchCooldown--;
        }*/



        // On quitte le menu
        if(game.input.activePointer.isDown&&this.clickable){
            this.select();
        }


    },


    //appui sur la touche select
    select : function(){
        //if(this.menuSwitchCooldown <= 0){

            game.state.start("game");
      //  }
    },
    
    addTryAgain : function(){
        var screenTitle = game.add.text(game.world.centerX, 480, 'Click to try again !',
        { font: 'bold 32px Arial', fill: '#ffffff' });
        screenTitle.anchor.setTo(0.5, 0.5);
        this.clickable=true;
    }
};
