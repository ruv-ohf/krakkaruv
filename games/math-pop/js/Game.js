MP.Game = function(game) {};

MP.Game.prototype = {

    // PHASER CREATE
    create: function() {
        
        
        // CONFIG
        ///////////////////////////////////////////////////////////////////////
        
        // Min/max to increase Star Number 
        levelIncrease = [7, 15];
        // Init percentage of Star Number to set Balloon Number to
        balloonNumberLimit = .3;
        // Out of 100 - Chance to double the balloon number
        doubleNumberChance = 50;
        // Out of 100 - Chance to half the balloon number (stacks with double)
        halfNumberChance = 50;
        // Out of 100 - Chance to set balloon number to single digit (Overrides chances above)
        singleDigitNumberChance = 4;
        // Out of 100 - Chance to set balloon number to the level-winning number
        // (only occurs if yourNumber is >= 75% of starNumber) (Overrides chances above)  
        perfectNumberChance = 8;
        // Chance per frame out of 1000
        balloonSpawnRate = 30;
        // Balloon speed, random min/max
        balloonSpeed = [4, 8];
        // Balloon "wind" (left or right) random max
        balloonWindLimit = 2;
        // Moves to start with (moves do not reset after a level)
        movesStart = 9;
        // Multiplied by Star Number to increase moves by after winning a level
        movesLeftInc = .05;
        // Level starting seconds ("seconds" are relative to framerate of 60 fps)
        timeLeftStart = 25;
        // Scoring settings...
        scoring = {
            // Increase score by when winning a level
            'level': 1000,
            // Increase score by multiplying time left by (runs after winning a level, and at game over)
            'timeMultiplier': 10,
            // Increase score by multiplying moves left by (runs at game over)
            'movesMultiplier': 10
        };
        ///////////////////////////////////////////////////////////////////////
        
        
        // Runtimes
        f = 0;
        score = 0;
        level = 0;
        yourNumber = 0;
        starNumber = 0;
        movesLeft = movesStart - 1;
        timeLeft = 0;
        newLevel = 1;
        
        // UI
        this.add.sprite(0, 0, 'background');
        this.add.sprite(0, 0, 'ui');
        
        // Init Sprites and Audio
        balloons = new Array();
        balloonRemoveQueue = new Array();
        balloonText = new Array();
        sounds = new Array();
        sounds['pop'] = this.add.audio('pop');
        sounds['harp'] = this.add.audio('harp');
        sounds['game_over'] = this.add.audio('game_over');
        
        // Win animation star
        star = this.add.sprite(-9999, -9999, 'star');
        star.anchor.setTo(.5, .5);
        
        // Init Pop Animations
        pop_anims = {
            'red': this.add.sprite(-999, -999, 'pop_red'),
            'yellow': this.add.sprite(-999, -999, 'pop_yellow'),
            'blue': this.add.sprite(-999, -999, 'pop_blue'),
            'purple': this.add.sprite(-999, -999, 'pop_purple')
        };
        pop_anims.red.animations.add('pop');
        pop_anims.yellow.animations.add('pop');
        pop_anims.blue.animations.add('pop');
        pop_anims.purple.animations.add('pop');

        // Text
        t_font = "Arial, Verdana, Helvetica, sans-serif";
        t_score = this.add.text(12, 12, 'SCORE: ' + score.toString(), { font: '24px ' + t_font, fill: '#ffffff' });
        t_your_number = this.add.text(9999, 522, yourNumber.toString(), { font: '60px ' + t_font, fill: '#323232' });
        t_star_number = this.add.text(9999, 496, starNumber.toString(), { font: '60px ' + t_font, fill: '#ff0000' });
        t_moves_left_label = this.add.text(12, 325, 'MOVES: ', { font: '18px ' + t_font, fill: '#ffffff' });
        t_moves_left = this.add.text(24 + t_moves_left_label._width, 312, movesLeft.toString(), { font: '42px ' + t_font, fill: '#E8E8E8' });
        t_time_left_label = this.add.text(12, 375, 'TIME: ', { font: '18px ' + t_font, fill: '#ffffff' });
        t_time_left = this.add.text(24 + t_moves_left_label._width, 362, timeLeft.toString(), { font: '42px ' + t_font, fill: '#F8FF75' });
    },
    
    // PHASER UPDATE
    update: function() {
    
        // Inc frame
        f += 1;
        
        // Timer
        if (f % 60 == 0) {
            timeLeft -= 1;
        }
        // Reusable vars
        var i = 0;
        var j = 0;
        var diff = 0;
        
        // New Level
        if (newLevel > 0) {
            this.newLevel();
        }
        
        // Update text values
        t_score.text = 'SCORE: ' + score.toString();
        t_your_number.text = yourNumber.toString();
        t_star_number.text = starNumber.toString();
        t_moves_left.text = movesLeft.toString();
        t_time_left.text = timeLeft.toString();
        this.fixTextPos();
    
        // Win / New level
        if (yourNumber ==  starNumber) {
            this.win();
        }
        
        // Handle win animation
        if (star.play == 1) {
            star.height += 3;
            star.width += 3;
            star.alpha -= .01;
            if (star.alpha <= 0) {
                star.play = 0;
                star.x = -999;
                star.y = -999;
            }
        }
        
        // Game Over
        if (movesLeft <= 0 || yourNumber > starNumber || timeLeft <= 0) {
            score += timeLeft * scoring.timeMultiplier;
            score += movesLeft * scoring.movesMultiplier;
            sounds['game_over'].play();
            this.state.start('GameOver');
        }
        
        // Spawn Balloon
        if (this.randomInt(1, 1000) <= balloonSpawnRate) {
            this.spawnBalloon();
        }
        
        // Balloon Handling
        for (i in balloons) {
            // Update id
            balloons[i].id = i;
            // Remove escaped
            if (balloons[i].y < -200) {
                balloonRemoveQueue.push(i);
            }
            // Movement
            balloons[i].y -= balloons[i].speed;
            balloons[i].x += balloons[i].wind;
            balloonText[i].y -= balloons[i].speed;
            balloonText[i].x += balloons[i].wind;
        }
        
        // Handle balloon removal queue
        balloonRemoveQueue = this.arrayUnique(balloonRemoveQueue);
        for (i in balloonRemoveQueue) {
            this.removeBalloon(balloonRemoveQueue[i]);
        }
        balloonRemoveQueue = new Array();
    },

    // Remove Balloon Handler
    removeBalloon: function(i) {
        if (balloons[i] != null) {
            balloons[i].kill();
            balloonText[i].destroy();
        }
        balloons.splice(i, 1);
        balloonText.splice(i, 1);
    },
    
    // Balloon Pop Handler
    popBalloon: function(i) {
        if (typeof balloons[i] != 'undefined') {
            movesLeft -= 1;
            yourNumber += balloons[i].numval;
            score += balloons[i].numval;
            pop_anims[balloons[i].color].x = balloons[i].x - 67;
            pop_anims[balloons[i].color].y = balloons[i].y - 42;
            pop_anims[balloons[i].color].play('pop', 45, false);
            sounds['pop'].play();
            this.removeBalloon(i);
        }
    },
    
    // Spawn Balloon Handler
    spawnBalloon: function() {
        // Color
        var c = this.randomInt(1, 4);
        var color = 'red';
        switch (c) {
            case 2:
                color = 'yellow';
                break;
            case 3:
                color = 'blue';
                break;
            case 4:
                color = 'purple';
                break;
        }
        var b = this.add.sprite(0, 0, 'balloon_' + color);
        // Position
        b.y = 640;
        b.x = this.randomInt(0, 960 - b.width);
        // Value (number)
        var numval = this.randomInt(1, Math.round(starNumber * balloonNumberLimit));
        if (this.randomInt(1, 100) <= doubleNumberChance) {
            numval *= 2;
        }
        if (this.randomInt(1, 100) <= halfNumberChance) {
            numval = Math.round(numval / 2);
        }
        if (this.randomInt(1, 100) <= singleDigitNumberChance) {
            numval = this.randomInt(1, 9);
        }
        if (this.randomInt(1, 100) <= perfectNumberChance) {
            if (yourNumber > starNumber / 4 * 3) {
                numval = starNumber - yourNumber;
            }
        }        
        b.numval = numval;
        bt = this.add.text(b.x, b.y + 60, numval.toString(), { font: '60px ' + t_font, fill: '#000' });
        bt.x += b.width / 2 - bt._width / 2;
        balloonText.push(bt);
        // Speed
        var speed = this.randomInt(balloonSpeed[0], balloonSpeed[1]);
        b.speed = speed;
        // Wind
        var wind = this.randomInt(0, balloonWindLimit);
        if (this.randomInt(1, 2) == 1) {
            wind = -Math.abs(wind);
        }
        b.wind = wind;
        b.color = color;
        // Set inpout handling (clicks/touches)
        b.inputEnabled = true;
        b.input.pixelPerfectClick = true;
        b.input.pixelPerfectAlpha = 10;
        b.events.onInputDown.add(this.balloonClick, this);
        // Push
        b.id = balloons.length;
        balloons.push(b);
    },
    
    balloonClick: function(b) {
        this.popBalloon(b.id);
    },
    
    // Win (level)
    win: function() {
        sounds['harp'].play();
        score += scoring.level;
        score += timeLeft * scoring.timeMultiplier;
        this.winAnim();
        this.newLevel();
    },
    
    winAnim: function() {
        star.play = 1;
        star.width = 244;
        star.height = 232;
        star.x = 832;
        star.y = 512;
        star.alpha = 1;
    },
    
    // New Level
    newLevel: function() {
        level += 1;
        starNumber += this.randomInt(levelIncrease[0], levelIncrease[1]);
        yourNumber = 0;
        movesLeft += Math.ceil(starNumber * movesLeftInc);
        timeLeft = timeLeftStart;
        newLevel = 0;
    },
    
    fixTextPos: function() {
        // Handles centering UI text
        t_your_number.x = 86 - t_your_number._width / 2;
        t_star_number.x = 826 - t_star_number._width / 2;
    },
    
    // Random Integer Helper
    randomInt: function(min, max) {
        var r = Math.random();
        var ri = Math.floor(r * (max - min + 1) + min);
        return ri;    
    },
    
    // Get Unique Array Helper
    arrayUnique: function(a) {
        return a.reduce(function(p, c) {
            if (p.indexOf(c) < 0) p.push(c);
            return p;
        }, []);
    }
};