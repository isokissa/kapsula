/**
 * 
 */

/////////////////////////////////////
// KapsulaStepGame
/////////////////////////////////////

createKapsulaStepGame = function createKapsulaStepGame( aRandomizer ) {
    if( aRandomizer === undefined ){
        throw new InvalidParameterError("missing randomizer");
    }
    var newStepGame = Object.create( KapsulaStepGame );
    newStepGame.randomizer = aRandomizer;
    newStepGame.score = 0;
    newStepGame.remainingKapsulas = newStepGame.INITIAL_NUMBER_OF_KAPSULAS; 
    newStepGame.state = newStepGame.STATE.START;
    newStepGame.resetPositionAndHeight();
    newStepGame.occupiedPositions = [];
    newStepGame.occupiedPositions[0] = true;
    newStepGame.occupiedPositions[31] = true;
    return newStepGame; 
};

var KapsulaStepGame = {
    
    MAX_ROW: 24,
    MAX_COLUMNS: 32,
    INITIAL_NUMBER_OF_KAPSULAS: 40,

    STATE: {
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
    },

    resetPositionAndHeight: function() {
        this.position = undefined; 
        this.height = undefined;     
    },

    landOrCrash: function() {
        if( this.occupiedPositions[this.position] ){
            this.state = this.STATE.CRASHED;
        }
        else{
            this.occupiedPositions[this.position] = true;
            this.state = this.STATE.LANDED;
            this.score = this.score + 1;
        }
    },

    getScore: function() {
        return this.score; 
    },

    getNumberOfKapsulas: function() {
        return this.remainingKapsulas; 
    },

    advance: function(aUserInput){
        if( aUserInput === undefined ){
            throw new InvalidParameterError("missing user input");
        }
        this.state(aUserInput);
        return { state: this.state, row: this.height, column: this.position };
    },

    generateNewKapsula: function() {
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
    }
};

/////////////////////////////////
// Randomizer 
/////////////////////////////////

Randomizer = {
    
    getRandomNumber: function(aUpperLimitOpen) {
        if( aUpperLimitOpen === undefined ){
            throw new InvalidParameterError( "no upper limit given to Randomizer" );
        }
        if( aUpperLimitOpen < 2 ){
            throw new InvalidParameterError( "upper limit must be bigger than 1" );
        }
        return Math.floor( Math.random() * aUpperLimitOpen );
    }
    
};


////////////////////////////////
// KapsulaArcadeGame
////////////////////////////////

createKapsulaArcadeGame = function createKapsulaArcadeGame( aStepGame ){
    var newArcadeGame = Object.create( KapsulaArcadeGame );
    newArcadeGame.stepGame = aStepGame;
    return newArcadeGame; 
};


var KapsulaArcadeGame = {
    step: function() {
        this.stepGame.advance( false );
    }
};


////////////////////////////////
// InvalidParameterError
////////////////////////////////

InvalidParameterError = function(message) {
    this.name = 'InvalidParameterError';
    this.message = message;
    this.stack = (new Error()).stack;
};

InvalidParameterError.prototype = new Error;     

