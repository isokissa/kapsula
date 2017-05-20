/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

/* 
 * The MIT License
 *
 * Copyright 2017 isokissa.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var state = __webpack_require__(3);

var machine = {
    addState: function(name, advanceFn, data, parentName) {
        if (!name) {
            throw "State must have the name";
        } else if (this.states[name]) {
            throw "State '" + name + "' is already defined";
        }
        if (!advanceFn) {
            throw "State must have the advance() function"; 
        }
        if (parentName && !this.states[parentName]) {
            throw "The parent state '" + parentName + "' is undefined";
        }
        var parent = parentName && this.states[parentName];        
        var newState = state.createInstance(name, advanceFn, data, parent);
        this.states[name] = newState; 
    }, 
    
    start: function(startState) {
        if (!startState) {
            throw "hmotine start state not given";
        }
        if (!this.states[startState]) {
            this.state = null;
            throw "Tried to start from nonexisting state '" + startState + "'"; 
        }
        this.state = this.states[startState]; 
        var advance = function(m) {
            if (!m.state) return;
            var startTime = new Date().getTime();
            var result = m.state.advance(m);
            if (!result) {
                var name = m.state.name;
                m.state = null;
                throw "The advance of state '" + name + "' does not "
                      + "return correct state transition object";
            }
            if (m.debugMode) {
                console.log("HMOTINE: " + m.state.name + 
                        " " + JSON.stringify(m.state.getAllData()));
            }
            if (result.nextState === null) {
                m.state = null;
                return;
            }
            if (result.nextState) {
                m.state = m.states[result.nextState];
            }
            var elapsedTime = new Date().getTime() - startTime;
            var waitingTime = result.nextTime ? result.nextTime - elapsedTime : 0; 
            setTimeout(advance, waitingTime, m);                    
        };
        advance(this);
    }, 
            
    get: function(parameter) {
        return this.state.getS(parameter);
    },
    
    set: function(parameter, value) {
        this.state.setS(parameter, value);
    },
    
    clean: function() {
        this.states = {};
        this.state = null;
    },
    
    goto: function(nextState, nextTime) {
        if (nextState && !this.states[nextState]) {
            this.state = null;
            throw "Tried to switch to nonexisting '" + nextState + "'"; 
        }
        return { nextState: nextState, 
                 nextTime: nextTime };
    },
    
    keep: function(nextTime) {
        return { nextTime: nextTime };
    },
    
    end: function() {
        return { nextState: null };
    },
    
    running: function() {
        return !!this.state;
    },

    debugOn: function() {
        this.debugMode = true; 
    },
    
    debugOff: function() {
        this.debugMode = false; 
    },
    
    debugMode: false,
    
    states: {},
    
    state: null
};

module.exports = machine; 



/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = {
    
    init: function() {
        var stateRef = this.state; 
        $("body").keypress(function(e) {
            var code = e.which || e.keyCode;
            if (code === 32) {
                stateRef.land = true; 
            } else if (code === 13) {
                stateRef.next = true; 
            }
        });
        $("#next").on("click", function() {
            stateRef.next = true; 
        });
        $("#screen,#crash").on("click", function() {
            stateRef.land = true; 
        });
    },
    
    state: {},
    
    consume: function() {
        var state = {
            land: !!this.state.land,
            next: !!this.state.next
        }; 
        this.state.land = false;
        this.state.next = false; 
        return state; 
    }

};



/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = {

//    kapsulaTemplate: '<polygon points="1,7 1,2 6,2 6,1 2,1 2,4 6,4 6,2 7,2 7,7 6,7 6,5 2,5 2,7"' + 
//                     ' style="fill:rgb(0,0,10);stroke-width:0;" class="kapsula"/>',

    clean: function() {
        $("#screen .kapsula").remove();
        this.crashHide();
        this.nextHide();
    },
    
    createKapsula: function(id) {        
        var kapsula = $(document.createElementNS("http://www.w3.org/2000/svg", "polygon"));
        kapsula.attr("points", "1,7 1,2 6,2 6,1 2,1 2,4 6,4 6,2 7,2 7,7 6,7 6,5 2,5 2,7");
        kapsula.attr("style", "fill:rgb(0,0,10);stroke-width:0;");
        kapsula.attr("class", "kapsula");
        kapsula.attr("id", "i" + id);
        kapsula.hide();
        $("#screen").append(kapsula);
    },
    
    plot: function(id, x, y) {
        $("#screen #i" + id).css({"transform": "translate(" + x * 8 + "px," + y * 8 + "px)"}).show();
    },
    
    unplot: function(id) {
        $("#screen #i" + id).hide();        
    },
    
    level: function(level) {
        $("#result #level").text(level);
    },
    
    result: function(score, remaining) {
        $("#result #score").text(score);
        $("#result #remaining").text(remaining);        
    },
    
    highScore: function(highScore) {
        $("#result #highScore").text("HI: " + highScore);
    },
    
    crashShow: function() {
        $("#crash").show();
    }, 
    
    crashHide: function() {
        $("#crash").hide();
    }, 
    
    nextShow: function() {
        $("#next").show();
    }, 

    nextHide: function() {
        $("#next").hide();
    }, 
    
    instructionsShow: function() {
        $("#instructions").show();        
    },

    instructionsHide: function() {
        $("#instructions").hide();        
    },

};




/***/ }),
/* 3 */
/***/ (function(module, exports) {

/* 
 * The MIT License
 *
 * Copyright 2017 isokissa.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var baseState = {
    createInstance: function(name, advanceFn, fields, parentState) {
        var newState = Object.create(this);
        newState.data = fields || {};
        newState.name = name || "default"; 
        newState.advance = advanceFn || function() {
            throw "default state should not be used";        
        };
        newState.parent = parentState;
        return newState;
    },
        
    getS: function(parameter) {
        var current = this; 
        while (!!current) {
            if (current.data.hasOwnProperty(parameter)) {
                return current.data[parameter];
            }
            current = current.parent; 
        }
        throw "Not found parameter '" + parameter + "' in state '" + this.name + "'";
    },
    
    setS: function(parameter, value) {
        var current = this; 
        while (current) {
            if (current.data.hasOwnProperty(parameter)) {
                current.data[parameter] = value; 
                return; 
            }
            current = current.parent; 
        }
        throw "Not found parameter '" + parameter + "' in state '" + 
              this.name + "'";
    },
    
    getAllData: function() {
        var d = {};
        var current = this; 
        while (!!current) {
            for (k in current.data) {
                d[k] = current.data[k];
            }
            current = current.parent; 
        }
        return d;
    },
    
    data: {}
            
}; 

module.exports = baseState; 



/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

$(document).ready( function() {
    
    const HEIGHT = 24;
    const WIDTH = 32;
    const KAPSULAS_PER_LEVEL = 40;
    const KAPSULAS_TO_LAND_ON_LEVEL = 30;
    const MIN_KAPSULAS_TO_LAND_ON_LEVEL = 10; 
    const INITIAL_FLIGHT_DELAY = 220; 
    const SPEED_INCREASE_FACTOR = 1.15;
    
    var machine = __webpack_require__(0);

    var render = __webpack_require__(2);
    render.clean();
    var input = __webpack_require__(1);
    input.init();
    
    machine.addState("START", function(m) {
        return m.goto("INSTRUCTIONS", 500);
    }, 
    {
        highScore: 0 
    });

    machine.addState("INSTRUCTIONS", function(m) {
        render.instructionsShow();
        var pressed = input.consume();
        if (!pressed.land) {
            return m.keep(100);
        } else {
            render.instructionsHide();
            return m.goto("GAME_START",200);
        }
    });
        
    machine.addState("GAME_START", function(m) {
        m.set("score", 0);
        m.set("level", 0);
        m.set("flightDelay", INITIAL_FLIGHT_DELAY );
        return m.goto("LEVEL_START");
    },
    {
        score: 0,
        level: 0,
        flightDelay: 0
    }, "START");

    machine.addState("LEVEL_START", function(m) {
        m.set("remaining", KAPSULAS_PER_LEVEL);
        m.set("stillToLand", KAPSULAS_TO_LAND_ON_LEVEL);
        render.clean();
        m.set("flightDelay", m.get("flightDelay") / SPEED_INCREASE_FACTOR);
        m.set("level", m.get("level") + 1);
        render.level(m.get("level"));
        var landed = [];
        landed[0] = true; 
        landed[WIDTH - 1] = true; 
        m.set("landed", landed);
        return m.goto("KAPSULA_START", 500);
    },
    {
        remaining: 0,
        stillToLand: 0,
        landed: []
    }, "GAME_START");

    machine.addState("KAPSULA_START", function(m) {
        render.result(m.get("score"), m.get("remaining"));
        if (KAPSULAS_TO_LAND_ON_LEVEL - m.get("stillToLand") >= MIN_KAPSULAS_TO_LAND_ON_LEVEL) {
            render.nextShow();
        }
        if (m.get("remaining") === 0) {
            return m.goto("CRASH");
        }
        if (Math.random() - 0.5 < 0) {
            m.set("direction", -1);
            m.set("limit", 0);
            m.set("x", WIDTH - 1);
        } else {
            m.set("direction", 1);
            m.set("limit", WIDTH - 1);
            m.set("x", 0);
        }
        m.set("y", Math.trunc(Math.random() * (HEIGHT - 2)));
        m.set("remaining", m.get("remaining") - 1);
        render.createKapsula(m.get("remaining"));
        return m.goto("FLY",0);
    }, 
    {
        direction: 0,
        limit: 0,
        x: 0, 
        y: 0
    }, "LEVEL_START");

    machine.addState("FLY", function(m) {
        if (m.get("x") !== m.get("limit")) {
            var pressed = input.consume();
            if (pressed.next && 
                (KAPSULAS_TO_LAND_ON_LEVEL - m.get("stillToLand") >= MIN_KAPSULAS_TO_LAND_ON_LEVEL)) {
                return m.goto("LEVEL_START", 100);
            } else if (pressed.land) {
                return m.goto("LANDING", 30);
            } else {
                m.set("x", m.get("x") + m.get("direction"));
                render.plot(m.get("remaining"), m.get("x"), m.get("y"));
                return m.keep(m.get("flightDelay"));
            }
        } else {
            render.unplot(m.get("remaining"));
            return m.goto("KAPSULA_START", 300);
        }
    }, {}, "KAPSULA_START");

    machine.addState("LANDING", function(m) {
        if (m.get("y") < HEIGHT - 2) {
            m.set("y", m.get("y") + 1);
            render.plot(m.get("remaining"), m.get("x"), m.get("y"));
            return m.keep(50);
        } else {
            var landed = m.get("landed");
            if (!landed[m.get("x")]) {
                landed[m.get("x")] = true;
                m.set("landed", landed); 
                m.set("score", m.get("score") + 1);
                m.set("stillToLand", m.get("stillToLand") - 1);
                if (m.get("stillToLand") === 0) {
                    m.set("score", m.get("score") + Math.trunc(m.get("remaining")/2));
                    return m.goto("LEVEL_START", 200);
                }
                return m.goto("KAPSULA_START");
            } else {
                return m.goto("CRASH");
            }
        }
    }, {}, "KAPSULA_START");
    
    machine.addState("CRASH", function(m) {
        if (m.get("score") > m.get("highScore")) {
            m.set("highScore", m.get("score"));
            render.highScore(m.get("highScore"));
        }
        render.crashShow();
        return m.goto("END",2000);
    }, {}, "KAPSULA_START");
    
    machine.addState("END", function(m) {
        var pressed = input.consume();
        if (!pressed.land) {
            return m.keep(100);
        } else {
            render.crashHide();
            return m.goto("GAME_START",200);
        }
    });
    
    machine.start("START");
    
});


/***/ })
/******/ ]);