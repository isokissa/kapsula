$(document).ready( function() {


    var obj = {
        tata: function() {}
    }
    
    var sin = { 
        dete: function() {}
    }
    
    d = Object.create( obj );
    d.dete = function () {};
    d.dete();
    d.tata();



    var myRect = document.getElementById("myRect");
    
    
    var randomizer = createRandomizer();
    var stepGame = createKapsulaTurnBasedGame( randomizer );
    var renderer = createKapsulaRenderer( myRect );
    var arcadeGame = createKapsulaArcadeGame( stepGame, renderer );
    
    arcadeGame.prototype = Object.create( ArcadeGame );
    var gameRunner = Object.create( GameRunner );
    
    gameRunner.startLoop( arcadeGame, window.setTimeout );
    
});


