$(document).ready( function() {

    var machine = require("hmotine");
    
    
    var translate = function(x, y) {
        $("#myRect").css({"transform": "translate(" + x * 8 + "px," + y * 8 + "px)"});
    } 
    
    machine.addState("ROOT", function() {}, 
        {
            x: 0, 
        }); 
    machine.addState("TO_RIGHT", function(m) {
        if (m.get("x") < 31) {
            m.set("x", m.get("x") + 1);
            translate(m.get("x"),3);
            return m.keep(200);
        } else {
            return m.goto("TO_LEFT", 100);
        }
    }, {}, "ROOT");
    machine.addState("TO_LEFT", function(m) {
        if (m.get("x") > 0) {
            m.set("x", m.get("x") - 1);
            translate(m.get("x"),3);
            return m.keep(170);
        } else {
            return m.goto("TO_RIGHT", 500);
        }
    }, {}, "ROOT");
    
    machine.start("TO_RIGHT");
    
    
});
