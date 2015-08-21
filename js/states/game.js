var gameState = {
    
    //chargement des params du niveau
    init : function(){
        console.log("Game state init");
        
    },
    
    preload : function(){
        console.log("Game state preload");
        this.UP = -1;
        this.DOWN = 1;
        this.LEFT = -1;
        this.RIGHT = 1;
        this.LEVELTOP=250;
        
        this.LEVELBOTTOM=game.global.gameHeight;
        
       

       
        
    },
    
    create : function(){
        this.randomGenerator = new Phaser.RandomDataGenerator(1337);
         //Sons
        this.hollandeSound  = [game.add.audio("hollande1"),game.add.audio("hollande2")];
        this.hollandeSound[0].play();
        
        // Groupe hollande
        this.hollandes = game.add.group();
        this.hollandes.enableBody = true;
        
        this.hollandes.createMultiple(25, "hollande");

        console.log("game state create() finished");
        
        this.addHollande(400,300);
        
    },
    
    update : function(){

        var nbHollande = this.hollandes.children.length;
        if(nbHollande > 0){
            for(var i = 0, l = nbHollande; i < l; ++i){
                var hollande = this.hollandes.children[i];
                if(hollande.alive){                    
                    hollande.x+=10*hollande.direction;
                    if((hollande.direction===this.RIGHT&&hollande.x+hollande.width/2>=game.global.gameWidth)||(hollande.direction===this.LEFT&&hollande.x-hollande.width/2<=0)){
                        var sound_r = this.randomGenerator.between(0,this.hollandeSound.length-1);
                        this.hollandeSound[sound_r].play();
                        hollande.direction=-1*hollande.direction;   
                    }
                    hollande.angle-=5;
                }
            }
            //game.physics.arcade.overlap(this.player.body, this.ennemies, this.takeDamage, null, this);
        }

    }, 
    
    addHollande : function(x,y){

        var hollande = this.hollandes.getFirstDead();

        if(hollande){
            hollande.anchor.setTo(0.5,0.5);
            hollande.direction=this.RIGHT;
            hollande.scale.x=0.5;
            hollande.scale.y=0.5;
            hollande.checkWorldBounds = true;
            hollande.outOfBoundsKill = true;
            hollande.reset(x , y);
        } 
    },
    
   
    
   
}; 
