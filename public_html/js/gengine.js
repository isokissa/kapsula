/** 
 * (c) 2016 pt_jr
 */

////////////////////////////////
// GameRunner
////////////////////////////////

GameRunner = function( aArcadeGame, aTimeoutFunction, aRendererFunction ) {
    if( !(aArcadeGame instanceof ArcadeGame) ){
        throw new InvalidParameterError( "ArcadeGame is not given" );
    }
    this.arcadeGame = aArcadeGame; 
    if( !(aTimeoutFunction instanceof Function )){
        throw new InvalidParameterError( "Timeout function is not given" );
    }
    this.timeoutFunction = aTimeoutFunction; 
    if( !(aRendererFunction instanceof Function )){
        throw new InvalidParameterError( "Renderer function is not given" );
    }
    this.rendererFunction = aRendererFunction; 
};

GameRunner.prototype.startLoop = function() {
    this.step( this.arcadeGame.advance );
};

GameRunner.prototype.step = function( advanceFunction ) {
    advanceFunction();
    var that = this; 
    this.timeoutFunction( function() {
        that.step( that.arcadeGame.advance );
    }, this.arcadeGame.howManyMillisecondsToWait );   
}

ArcadeGame = function() {
    this.howManyMillisecondsToWait = 100;
};

ArcadeGame.prototype.advance = function() {
    console.log( "do I know about " + this.howManyMillisecondsToWait );
};
