/**
 * 
 */

/////////////////////////////////////
// KapsulaTurnBasedGame
/////////////////////////////////////

createKapsulaTurnBasedGame = function createKapsulaTurnBasedGame( aRandomizer ) {
    if( aRandomizer === undefined ){
        throw new InvalidParameterError("missing randomizer");
    }
    var newTurnBasedGame = Object.create( KapsulaTurnBasedGame );
    newTurnBasedGame.randomizer = aRandomizer;
    newTurnBasedGame.score = 0;
    newTurnBasedGame.remainingKapsulas = newTurnBasedGame.INITIAL_NUMBER_OF_KAPSULAS; 
    newTurnBasedGame.state = newTurnBasedGame.STATE.START;
    newTurnBasedGame.resetPositionAndHeight();
    newTurnBasedGame.occupiedPositions = [];
    newTurnBasedGame.occupiedPositions[0] = true;
    newTurnBasedGame.occupiedPositions[31] = true;
    return newTurnBasedGame; 
};

var KapsulaTurnBasedGame = {
    
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

    takeTurn: function(aUserInput){
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

createKapsulaArcadeGame = function createKapsulaArcadeGame( aTurnBasedGame, aRenderer ){
    var newArcadeGame = Object.create( KapsulaArcadeGame );
    newArcadeGame.turnBasedGame = aTurnBasedGame;
    newArcadeGame.renderer = aRenderer;
    newArcadeGame.state = newArcadeGame.STATE.ACTIVE;
    newArcadeGame.flyingDelay = newArcadeGame.INITIAL_FLYING_DELAY;
    return newArcadeGame; 
};


var KapsulaArcadeGame = {
    
    INITIAL_FLYING_DELAY: 200,
    current: {},
    
    step: function() {
        return this.state(); 
    },
        
    STATE: {
        ACTIVE: function() {
            var turnBasedGameState = this.turnBasedGame.takeTurn();
            this.renderer.showKapsula( turnBasedGameState.row, turnBasedGameState.column );
            switch( turnBasedGameState.state ){
                case this.turnBasedGame.STATE.FLYING_FROM_LEFT:
                case this.turnBasedGame.STATE.FLYING_FROM_RIGHT:
                    return this.flyingDelay; 
                case this.turnBasedGame.STATE.LANDED:
                    this.renderer.showScore( 1 );
                case this.turnBasedGame.STATE.CRASHED:
                    this.state = this.STATE.LANDING;
                    this.current.row = turnBasedGameState.row; 
                    this.current.column = turnBasedGameState.column;
                    return this.flyingDelay / 2; 
                default:
                    break;
            }
        },
        LANDING: function() {
            this.renderer.showKapsula( this.current.row, this.current.column );
            this.current.row++;
            if( this.current.row > 23){
                this.state = this.STATE.ACTIVE;
                return 1000; 
            }
            else{
                return this.flyingDelay / 2;
            }
        }
    }
    
};

////////////////////////////////
// KapsulaRenderer
////////////////////////////////

createKapsulaRenderer = function createKapsulaRenderer( aWindow ){
    var renderer = Object.create( KapsulaRenderer );
    return renderer;
};

var KapsulaRenderer = {
    showKapsula: function( row, column ) {
        
    },
    
    showScore: function( score ) {
        
    }
    
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

