MP.Preloader = function(game) {};

MP.Preloader.prototype = {
    preload: function() {
        // Add background and set loading graphic
        this.stage.backgroundColor = '#1db2f0';
        pl = this.add.sprite(0, 0, 'loading');
        this.load.setPreloadSprite(pl);
        
        // Screens and Buttons
        this.load.image('background', 'img/background.png');
        this.load.image('main_menu', 'img/main_menu.png');
        this.load.image('how_to_play', 'img/how_to_play.png');
        this.load.image('ui', 'img/ui.png');
        this.load.image('game_over', 'img/game_over.png');
        this.load.image('alpha', 'img/alpha.png');
        
        // Sprites
        this.load.image('balloon_red', 'img/sprites/balloon_red.png');
        this.load.image('balloon_yellow', 'img/sprites/balloon_yellow.png');
        this.load.image('balloon_blue', 'img/sprites/balloon_blue.png');
        this.load.image('balloon_purple', 'img/sprites/balloon_purple.png');
        this.load.image('star', 'img/sprites/star.png');
        
        // Anims
        this.load.atlasXML('pop_red', 'img/sprites/pop_red.png', 'img/sprites/pop_red.xml');
        this.load.atlasXML('pop_yellow', 'img/sprites/pop_yellow.png', 'img/sprites/pop_yellow.xml');
        this.load.atlasXML('pop_blue', 'img/sprites/pop_blue.png', 'img/sprites/pop_blue.xml');
        this.load.atlasXML('pop_purple', 'img/sprites/pop_purple.png', 'img/sprites/pop_purple.xml');
        
        // Audio
        this.load.audio('pop', ['audio/pop.mp3', 'audio/pop.ogg']);
        this.load.audio('harp', ['audio/harp.mp3', 'audio/harp.ogg']);
        this.load.audio('game_over', ['audio/game_over.mp3', 'audio/game_over.ogg']);
    },
    
    create: function() {
        // Start Main Menu
        this.state.start('MainMenu');
    }
};