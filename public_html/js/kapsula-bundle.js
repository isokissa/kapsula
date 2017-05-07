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
        var pressed = this.pressed; 
        $("body").keypress(function(e) {
            if (e.keyCode === 32) {
                pressed.state = true; 
            }
        });  
        $("#screen").on("click", function() {
            pressed.state = true; 
        });
    },
    
    pressed: { state: false },
    
    consume: function() {
        var pressed = this.pressed.state; 
        this.pressed.state = false;
        return pressed; 
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
    
    result: function(score, remaining) {
        $("#result #score").text(score);
        $("#result #remaining").text(remaining);        
    }
    
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
    
    var machine = __webpack_require__(0);

    var render = __webpack_require__(2);
    var input = __webpack_require__(1);
    input.init();
    
    machine.addState("START", function(m) {
            return m.goto("LEVEL_START");
        }, 
        {
            score: 0 
        });

    machine.addState("LEVEL_START", function(m) {
            m.set("remaining", KAPSULAS_PER_LEVEL);
            render.clean();
            return m.goto("KAPSULA_START", 3000);
        },
        {
            remaining: 0
        },
        "START");

    machine.addState("KAPSULA_START", function(m) {
            render.result(m.get("score"), m.get("remaining"));
            if (m.get("remaining") === 0) {
                return m.goto("LEVEL_END");
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
            pressed = input.consume();
            if (pressed) {
                return m.goto("LANDING", 30);
            } else {
                m.set("x", m.get("x") + m.get("direction"));
                render.plot(m.get("remaining"), m.get("x"), m.get("y"));
                return m.keep(200);
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
            return m.goto("KAPSULA_START");
        }
    }, {}, "KAPSULA_START");
    
    machine.start("START");
    
});


/***/ })
/******/ ]);