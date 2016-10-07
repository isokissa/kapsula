/**
 * 
 */

/////////////////////////////////////
// KapsulaStepGame
/////////////////////////////////////

KapsulaStepGame = function( aRandomizer ) {
    if( aRandomizer === undefined ){
        throw new InvalidParameterError("missing randomizer");
    }
    if( !(aRandomizer instanceof Randomizer) ){
        throw new InvalidParameterError("invalid randomizer");
    }
    this.randomizer = aRandomizer;
    this.position = undefined; 
    this.height = undefined; 
    this.direction = undefined; 
};

KapsulaStepGame.prototype.MAX_ROW = 24;
KapsulaStepGame.prototype.MAX_COLUMNS = 32;

KapsulaStepGame.prototype.getScore = function() {
    return 0; 
}

KapsulaStepGame.prototype.advance = function(aUserInput){
    if( aUserInput === undefined ){
        throw new InvalidParameterError("missing user input");
    }
    var nextState = "FLYING";
    if( this.position === undefined ){
        this.generateNewKapsula();
    }
    else{
        this.position = this.position + this.direction;
        if( this.position === -1 || this.position === this.MAX_COLUMNS ){
            nextState = "LOST";
            this.position = undefined; 
            this.height = undefined; 
        }
    }
    return { state: nextState, row: this.height, column: this.position };
};

KapsulaStepGame.prototype.generateNewKapsula = function() {
    this.height = this.randomizer.getRandomNumber( this.MAX_ROW - 1 );
    if( this.randomizer.getRandomNumber( 2 ) === 0 ){
        this.position = 0;
        this.direction = 1; 
    }
    else {
        this.position = this.MAX_COLUMNS-1;
        this.direction = -1; 
    }
};

/////////////////////////////////
// Randomizer 
/////////////////////////////////

Randomizer = function() {
};

Randomizer.prototype.getRandomNumber = function(aUpperLimitOpen) {
    if( aUpperLimitOpen === undefined ){
        throw new InvalidParameterError( "no upper limit given to Randomizer" );
    }
    if( aUpperLimitOpen < 2 ){
        throw new InvalidParameterError( "upper limit must be bigger than 1" );
    }
    return Math.floor( Math.random() * aUpperLimitOpen );
};

////////////////////////////////
// KapsulaArcadeGame
////////////////////////////////

KapsulaArcadeGame = function( aKapsulaStepGame, aTimeoutFunction, aRendererFunction ) {
    if( !(aKapsulaStepGame instanceof KapsulaStepGame) ){
        throw new InvalidParameterError( "StepGame is not given" );
    }
    this.kapsulaStepGame = aKapsulaStepGame; 
    if( !(aTimeoutFunction instanceof Function )){
        throw new InvalidParameterError( "Timeout function is not given" );
    }
    this.timeoutFunction = aTimeoutFunction; 
    if( !(aRendererFunction instanceof Function )){
        throw new InvalidParameterError( "Renderer function is not given" );
    }
    this.rendererFunction = aRendererFunction; 
};

KapsulaArcadeGame.prototype.startLoop = function() {
    this.timeoutFunction( this.step, 100 );
};

KapsulaArcadeGame.prototype.step = function() {
    
}

////////////////////////////////
// InvalidParameterError
////////////////////////////////

InvalidParameterError = function(message) {
    this.name = 'InvalidParameterError';
    this.message = message;
    this.stack = (new Error()).stack;
};

InvalidParameterError.prototype = new Error;     

