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
};

KapsulaStepGame.prototype.MAX_ROW = 24;
KapsulaStepGame.prototype.MAX_COLUMNS = 32;

KapsulaStepGame.prototype.advance = function(aUserInput){
    if( aUserInput === undefined ){
        throw new InvalidParameterError("missing user input");
    }
    var a = this.randomizer.getRandomNumber( 2 * (this.MAX_ROWS-2) );
    return { state: "FLYING", row: a, column: 0 };
};

// Randomizer 

Randomizer = function() {
};

Randomizer.prototype.getRandomNumber = function(aUpperLimit) {
    if( aUpperLimit === undefined ){
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

