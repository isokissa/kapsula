$(document).ready( function() {
    
    const HEIGHT = 24;
    const WIDTH = 32;
    const KAPSULAS_PER_LEVEL = 40;
    const KAPSULAS_TO_LAND_ON_LEVEL = 10;
    const INITIAL_FLIGHT_DELAY = 220; 
    const SPEED_INCREASE_FACTOR = 1.1;
    
    var machine = require("hmotine");

    var render = require("./render.js");
    render.clean();
    var input = require("./input.js");
    input.init();
    
    machine.addState("START", function(m) {
            return m.goto("GAME_START");
        }, 
        {
            highScore: 0 
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
            landed: [],
        },
        "GAME_START");

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
                    m.set("score", m.get("score") + Math.trunc(m.get("remaining")/3));
                    return m.goto("LEVEL_START", 200);
                }
                return m.goto("KAPSULA_START");
            } else {
                return m.goto("CRASH");
            }
        }
    }, {}, "KAPSULA_START");
    
    machine.addState("CRASH", function(m) {
        render.crash();
        return m.end();
    });
    
    machine.start("START");
    
});
