module.exports = {
    
    init: function() {
        var pressed = this.pressed; 
        $("body").keypress(function(e) {
            if (e.keyCode === 32) {
                pressed.state = true; 
            }
        });  
        $("#screen").click(function() {
            pressed.state = true; 
        });
    },
    
    pressed: { state: false },
    
    consume: function() {
        console.log("CON");
        var pressed = this.pressed.state; 
        this.pressed.state = false;
        return pressed; 
    }

};

