MP.GameOver = function(game) {};

MP.GameOver.prototype = {
    create: function() {
        // Set background and game over graphic
        this.add.sprite(0, 0, 'background');
        this.add.sprite(0, 0, 'game_over');
        // Play Again button
        var buttonPlayAgain = this.add.button(225, 420, 'alpha', this.playGame, this);
        buttonPlayAgain.width = 515;
        buttonPlayAgain.height = 140;
        
        // Text
        var reason = 'Þú bættir við of miklu!';
        if (timeLeft <= 0) {
            reason = 'Tíminn er liðinn!';
        }
        if (movesLeft <= 0) {
            reason = 'Ekki fleiri aðgerðir!';
        }
        var t_reason = this.add.text(0, 230, reason, { font: '36px ' + t_font, fill: '#F8FF75' });
        t_reason.x = 480 - t_reason._width / 2;
        var t_go_score = this.add.text(0, 310, 'Stig: ' + score.toString(), { font: '60px ' + t_font, fill: '#ffffff' });
        t_go_score.x = 480 - t_go_score._width / 2;
    },
    playGame: function() {
        // Play Game Again
        this.state.start('Game');
    }
};