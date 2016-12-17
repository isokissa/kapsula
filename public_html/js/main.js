$(document).ready( function() {


    var state = {
        name: "state",
        change: function( input ){
            
        }
    }




    var myRect = document.getElementById("myRect");
    
    
    var randomizer = createRandomizer();
    var stepGame = createKapsulaTurnBasedGame( randomizer );
    var renderer = createKapsulaRenderer( myRect );
    var arcadeGame = createKapsulaArcadeGame( stepGame, renderer );
    
    arcadeGame.prototype = Object.create( ArcadeGame );
    var gameRunner = Object.create( GameRunner );
    
    gameRunner.startLoop( arcadeGame, window.setTimeout );
    
});


