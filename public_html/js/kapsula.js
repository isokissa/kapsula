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
    this.score = 0;
    this.remainingKapsulas = this.INITIAL_NUMBER_OF_KAPSULAS; 
    this.state = this.STATE.START;
    this.resetPositionAndHeight();
    this.occupiedPositions = [];
    this.occupiedPositions[0] = true;
    this.occupiedPositions[31] = true;
};

KapsulaStepGame.prototype.MAX_ROW = 24;
KapsulaStepGame.prototype.MAX_COLUMNS = 32;
KapsulaStepGame.prototype.INITIAL_NUMBER_OF_KAPSULAS = 40;

KapsulaStepGame.prototype.STATE = {
    START: function() {
        this.generateNewKapsula();
    },
    FLYING_FROM_LEFT: function( aUserInput ) {
        if( aUserInput ){
            this.landOrCrash();
        }
        else {
            this.position = this.position + 1; 
            if( this.position >= this.MAX_COLUMNS ){
                this.state = this.STATE.LOST;
                this.resetPositionAndHeight();
            }
        }
    },
    FLYING_FROM_RIGHT: function( aUserInput ) {
        if( aUserInput ){
            this.landOrCrash();
        }
        else{
            this.position = this.position - 1;
            if( this.position < 0 ){
                this.state = this.STATE.LOST;
                this.resetPositionAndHeight();
            }            
        }
    },
    LOST: function() {
        if( this.remainingKapsulas > 1 ){
            this.generateNewKapsula();
        }
        else {
            this.state = this.STATE.END;
            this.resetPositionAndHeight();
        }
    },
    CRASHED: function() {

    },
    LANDED: function() {
        if( this.score === this.MAX_COLUMNS - 2 ){
            this.state = this.STATE.COMPLETED;
            this.resetPositionAndHeight();
        }
        else {
            this.generateNewKapsula();        
        }
    },
    END: function() {
        
    },
    COMPLETED: function() {
        
    }
};

KapsulaStepGame.prototype.resetPositionAndHeight = function() {
    this.position = undefined; 
    this.height = undefined;     
}

KapsulaStepGame.prototype.landOrCrash = function() {
    if( this.occupiedPositions[this.position] ){
        this.state = this.STATE.CRASHED;
    }
    else{
        this.occupiedPositions[this.position] = true;
        this.state = this.STATE.LANDED;
        this.score = this.score + 1;
    }
}

KapsulaStepGame.prototype.getScore = function() {
    return this.score; 
}

KapsulaStepGame.prototype.getNumberOfKapsulas = function() {
    return this.remainingKapsulas; 
}

KapsulaStepGame.prototype.advance = function(aUserInput){
    if( aUserInput === undefined ){
        throw new InvalidParameterError("missing user input");
    }
    this.state(aUserInput);
    return { state: this.state, row: this.height, column: this.position };
};

KapsulaStepGame.prototype.generateNewKapsula = function() {
    this.remainingKapsulas--;
    this.height = this.randomizer.getRandomNumber( this.MAX_ROW - 1 );
    if( this.randomizer.getRandomNumber( 2 ) === 0 ){
        this.position = 0;
        this.state = this.STATE.FLYING_FROM_LEFT; 
    }
    else {
        this.position = this.MAX_COLUMNS-1;
        this.state = this.STATE.FLYING_FROM_RIGHT; 
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

KapsulaArcadeGame = function( aKapsulaStepGame ) {
    if( !(aKapsulaStepGame instanceof KapsulaStepGame) ){
        throw new InvalidParameterError( "StepGame is not given" );
    }
    this.kapsulaStepGame = aKapsulaStepGame; 
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

