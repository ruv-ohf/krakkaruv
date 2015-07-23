MP.MainMenu = function(game) {};

MP.MainMenu.prototype = {
    create: function() {
        // Add background and UI for Main Menu
        this.add.sprite(0, 0, 'background');
        this.add.sprite(0, 0, 'main_menu');
        // Play Button
        var b_play = this.add.button(230, 300, 'alpha', this.playGame, this);
        b_play.width = 500;
        b_play.height = 220;
        // Help Button
        var b_help = this.add.button(800, 485, 'alpha', this.howToPlay, this);
        b_help.width = 116;
        b_help.height = 116;
    },
    playGame: function() {
        // Start Game
        this.state.start('Game');
    },
    howToPlay: function() {
        // Show Help Screen
        this.state.start('HowToPlay');
    }
};