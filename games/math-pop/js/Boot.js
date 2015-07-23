var MP = {};

MP.Boot = function(game) {};

MP.Boot.prototype = {
    preload: function() {
        // Load preloading image
        this.load.image('loading', 'img/loading.png');
    },
    create: function() {
        // Set scaling/pointer options
        this.input.maxPointers = 1;
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.scale.setShowAll();
        this.scale.refresh();
        // Start preloader
        this.state.start('Preloader');
    }
};