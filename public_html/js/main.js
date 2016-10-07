$(document).ready( function() {

    var myRect = document.getElementById("myRect");
    
    
    var randomizer = new Randomizer();
    var stepGame = new KapsulaStepGame( randomizer );
    var arcadeGame = new KapsulaArcadeGame( stepGame, window.setTimeout, undefined );
    
    arcadeGame.loop();
    
});


