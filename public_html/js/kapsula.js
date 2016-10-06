/**
 * 
 */


// KapsulaStepGame

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

// Randomizer 

Randomizer = function() {
};

Randomizer.prototype.getRandomNumber = function(aUpperLimitOpen) {
    if( aUpperLimitOpen === undefined ){
        throw new InvalidParameterError( "no upper limit given to Randomizer" );
    }
    return 15;
};

// InvalidParameterError

InvalidParameterError = function(message) {
    this.name = 'InvalidParameterError';
    this.message = message;
    this.stack = (new Error()).stack;
};

InvalidParameterError.prototype = new Error;     

