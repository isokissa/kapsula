$(document).ready( function() {
    
    var machine = require("hmotine");

    var render = require("./render.js");
    var input = require("./input.js");
    input.init();
    
    machine.addState("ROOT", function() {}, 
        {
            x: 0, 
            y: 3
        }); 
    machine.addState("TO_RIGHT", function(m) {
        if (m.get("x") < 31) {
            pressed = input.consume();
            if (pressed) {
                return m.goto("LANDING", 30);
            } else {
                m.set("x", m.get("x") + 1);
                render.plot(m.get("x"),m.get("y"));
                return m.keep(200);
            }
        } else {
            return m.goto("TO_LEFT", 100);
        }
    }, {}, "ROOT");
    machine.addState("TO_LEFT", function(m) {
        if (m.get("x") > 0) {
            if (pressed) {
                return m.goto("LANDING", 30);
            } else {
                m.set("x", m.get("x") - 1);
                render.plot(m.get("x"),m.get("y"));
                return m.keep(170);
            }
        } else {
            return m.goto("TO_RIGHT", 500);
        }
    }, {}, "ROOT");
    machine.addState("LANDING", function(m) {
        alert("LANDING");
        return m.end();
    })
    
    machine.start("TO_RIGHT");
    
});
