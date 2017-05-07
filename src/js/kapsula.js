$(document).ready( function() {
    
    const HEIGHT = 24;
    const WIDTH = 32;
    const KAPSULAS_PER_LEVEL = 40;
    
    var machine = require("hmotine");

    var render = require("./render.js");
    var input = require("./input.js");
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
