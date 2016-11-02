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
    newTurnBasedGame.score = undefined;
    newTurnBasedGame.remainingKapsulas = undefined; 
    newTurnBasedGame.remainingLives = undefined; 
    newTurnBasedGame.state = undefined;
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
    
    start: function() {
        this.score = 0;
        this.remainingLives = 1; 
        this.state = this.STATE.NEW_KAPSULA;
        this.remainingKapsulas = this.INITIAL_NUMBER_OF_KAPSULAS;
    },

    STATE: {
        NEW_KAPSULA: function() {
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
            this.resetPositionAndHeight();
            if( this.remainingKapsulas > 1 ){
                this.state = this.STATE.NEW_KAPSULA;
            }
            else {
                this.state = this.STATE.END_FAIL;
            }
        },
        CRASHED: function() {
            this.remainingLives --;
            if( this.remainingLives > 0 ){
                this.state = this.STATE.NEW_KAPSULA; 
            }
            else{
                this.state = this.STATE.END_FAIL; 
            }
        },
        LANDED: function() {
            if( this.score === this.MAX_COLUMNS - 2 ){
                this.state = this.STATE.END_WIN;
                this.resetPositionAndHeight();
            }
            else {
                this.score ++; 
                this.state = this.STATE.NEW_KAPSULA;        
            }
        },
        END_FAIL: function() {
            
        },
        END_WIN: function() {
            
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

    getNumberOfRemainingKapsulas: function() {
        return this.remainingKapsulas; 
    },

    getRemainingLives: function() {
        return this.remainingLives; 
    },

    takeTurn: function(aUserInput){
        if( aUserInput === undefined ){
            throw new InvalidParameterError("missing user input");
        }
        this.state(aUserInput);
        return { state: this.state, row: this.height, column: this.position };
    },

};

/////////////////////////////////
// Randomizer 
/////////////////////////////////

createRandomizer = function createRandomizer(){
    randomizer = Object.create( Randomizer );
    return randomizer; 
}

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
    var newArcadeGame = Object.create( ArcadeGame );
    newArcadeGame.turnBasedGame = aTurnBasedGame;
    newArcadeGame.renderer = aRenderer;
    newArcadeGame.score = 0;
    newArcadeGame.level = 1; 
    newArcadeGame.INITIAL_FLYING_DELAY = 300;
    newArcadeGame.flyingDelay = newArcadeGame.INITIAL_FLYING_DELAY;

    newArcadeGame.current = {};
    
    newArcadeGame.step = function() {
        return this.state(); 
    };
        
    newArcadeGame.STATE = {
        START: function() {
            newArcadeGame.state = newArcadeGame.STATE.START_LEVEL; 
            return 1; 
        },
        START_LEVEL: function() {
            newArcadeGame.turnBasedGame.start();
            newArcadeGame.state = newArcadeGame.STATE.FLYING; 
            return 1; 
        },
        FLYING: function() {
            var turnBasedGameState = newArcadeGame.turnBasedGame.takeTurn( false );
            this.renderer.showKapsula( turnBasedGameState.row, turnBasedGameState.column );
            switch( turnBasedGameState.state ){
                case this.turnBasedGame.STATE.FLYING_FROM_LEFT:
                case this.turnBasedGame.STATE.FLYING_FROM_RIGHT:
                    return this.flyingDelay; 
                case this.turnBasedGame.STATE.LANDED:
                    this.score ++;
                    this.renderer.showScore( this.score );
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
                this.state = this.STATE.FLYING;
                return 1000; 
            }
            else{
                return this.flyingDelay / 2;
            }
        }
    };

    newArcadeGame.state = newArcadeGame.STATE.START;

    return newArcadeGame; 
};


////////////////////////////////
// KapsulaRenderer
////////////////////////////////

createKapsulaRenderer = function createKapsulaRenderer( aKapsulaElement ){
    var renderer = Object.create( KapsulaRenderer );
    renderer.currentKapsulaElement = aKapsulaElement; 
    return renderer;
};

var KapsulaRenderer = {
    
    showKapsula: function( row, column ) {
        this.currentKapsulaElement.setAttribute( "x", column * 8 );
        this.currentKapsulaElement.setAttribute( "y", row * 8 );
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

