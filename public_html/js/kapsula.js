/**
 * 
 * @returns {KapsulaStepGame}
 */


KapsulaStepGame = function( aRandomizer ) {
    if( aRandomizer === undefined ){
        throw new InvalidParameterError("missing randomizer");
    }
    if( !(aRandomizer instanceof Randomizer) ){
        throw new InvalidParameterError("invalid randomizer");
    }
    this.randomizer = aRandomizer;   
};

KapsulaStepGame.prototype.advance = function (){
    this.randomizer.getNextRandomNumber();
};

Randomizer = function() {
    
}

Randomizer.prototype.getNextRandomNumber = function() {
    return 0;
}


InvalidParameterError = function(message) {
    this.name = 'InvalidParameterError';
    this.message = message;
    this.stack = (new Error()).stack;
};

InvalidParameterError.prototype = new Error;     

