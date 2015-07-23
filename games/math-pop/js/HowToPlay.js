MP.HowToPlay= function(game) {};

MP.HowToPlay.prototype = {
    create: function() {
        // Set background image and help screen graphic
        this.add.sprite(0, 0, 'background');
        this.add.sprite(0, 0, 'how_to_play');
        // Fullscreen continue button
        var b_continue = this.buttonContinue = this.add.button(0, 0, 'alpha', this.mainMenu, this);
        b_continue.width = 960;
        b_continue.height = 640;
    },
    mainMenu: function() {
        // Back to Main Menu
        this.state.start('MainMenu');
    }
};