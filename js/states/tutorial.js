var tutorialState = {

    init: function(){
    },

    preload : function(){
        console.log("tutorial state preload");

    },


    create : function(){
        this.clickable=true;

        // Affichage du fond
        game.add.sprite(0,0,"background_tutorial");
        
        
        this.mask = game.add.sprite(0,0,"tutorial_step1");
        this.mask.blendMode = PIXI.blendModes.MULTIPLY;
        
        this.tutorial_step=1;
        var score = game.add.text(10, 20, 'Tutorial\nClick to continue...',
        { font: 'bold 28px Arial', fill: '#888888' });
        
        var credits = game.add.text(game.global.gameWidth - 230, 10, 'Made for Ludum Dare 33\nTheme : "You are the monster"\n    Code : Vladirien & Palapapaa\n    Graphics : Lysero\n    Music : Nemix',
        { font: 'bold 14px Arial', fill: '#888888' });
        
        this.indic1 = game.add.text(game.global.gameWidth - 270, 200, 'You are the monster!',
        { font: 'bold 19px Arial', fill: '#ffffff' });
        this.indic2 = game.add.text(game.global.gameWidth - 240, 10, '',
        { font: 'bold 18px Arial', fill: '#ffffff' });
        
        
        

    },

    update : function(){
        
        if(game.input.activePointer.isDown&&this.clickable){
            this.nextStep();
        }


    },


    //appui sur la touche select
    nextStep : function(){
            this.clickable=false;
            game.time.events.add(150, this.makeClickable, this);
            this.tutorial_step++;
            this.indic1.text="";
            this.indic2.text="";
            switch(this.tutorial_step){
                case 1:{
                    this.mask.loadTexture("tutorial_step"+this.tutorial_step);
                    break;   
                }
                case 2:{
                    this.indic1.text="Foolish adventurers invaded your home with the intent of killing you!\nKick them out before they get to you!";
                    this.indic1.x = 100;
                    this.indic1.y = 250;
                    this.mask.loadTexture("tutorial_step"+this.tutorial_step);
                    break;   
                }
                case 3:{
                    this.indic1.text="Click on the cards to throw things at them!\nKill enough enemies to get more cards.\nYou deck will be shuffled when both your deck and your hand are empty\nOnce you have enough cards, you can remove some from your deck.";
                    this.indic1.x = 100;
                    this.indic1.y = 350;
                    this.mask.loadTexture("tutorial_step"+this.tutorial_step);
                    break;   
                }
                case 4:{
                    this.indic1.text="Keep track of your health and good luck!";
                    this.indic1.x = 225;
                    this.indic1.y = 110;
                    this.mask.loadTexture("tutorial_step"+this.tutorial_step);
                    break;   
                }
                case 5:{
                    game.state.start("game");
                    break;   
                }
                    
            }
     
        
    },
    
    makeClickable : function(){
        this.clickable=true;   
    }
    
};
