function CMain(oData){

    var _iCurResource = 0;
    var RESOURCE_TO_LOAD = 0;
    var _iState = STATE_LOADING;
    var _oGameData;
	
    var _oPreloader;
    var _oMenu;
    var _oHelp;
    var _oGame;

    this.initContainer = function(){
        var canvas = document.getElementById("canvas");
        s_oStage = new createjs.Stage(canvas);
        
		var touchDevice=(window.hasOwnProperty('ontouchstart'));

		if(!!(navigator.userAgent.match(/Trident/)) && !touchDevice){
			//console.log('IE10 Desktop'); 
		}else{ 
			//console.log('touch enabled');
			createjs.Touch.enable(s_oStage); 
		}
		
		s_bMobile = jQuery.browser.mobile;
        if(s_bMobile === false){
            s_oStage.enableMouseOver(20);  
        }
        s_iPrevTime = new Date().getTime();
	createjs.Ticker.setFPS(30);
	createjs.Ticker.addEventListener("tick", this._update);
	
        s_oSpriteLibrary  = new CSpriteLibrary();

        //ADD PRELOADER
        _oPreloader = new CPreloader();
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            this._initSounds();
        }
        this._loadImages();
    };

	this._initSounds = function(){
         if (!createjs.Sound.initializeDefaultPlugins()) {
             return;
         }
         
		 if(navigator.userAgent.indexOf("Opera")>0 || navigator.userAgent.indexOf("OPR")>0){
			createjs.Sound.alternateExtensions = ["mp3"];
			 createjs.Sound.addEventListener("fileload", createjs.proxy(this.handleFileLoad, this));
			 
			 createjs.Sound.registerSound("/sites/default/files/games/bubble-shooter/sounds/explosion.ogg", "explosion");
			 createjs.Sound.registerSound("/sites/default/files/games/bubble-shooter/sounds/soundtrack.ogg", "soundtrack");
			 createjs.Sound.registerSound("/sites/default/files/games/bubble-shooter/sounds/game_over.ogg", "game_over");
			 createjs.Sound.registerSound("/sites/default/files/games/bubble-shooter/sounds/launch.ogg", "launch");
			 createjs.Sound.registerSound("/sites/default/files/games/bubble-shooter/sounds/win.ogg", "win");
		 }else{
			 createjs.Sound.alternateExtensions = ["ogg"];
			 createjs.Sound.addEventListener("fileload", createjs.proxy(this.handleFileLoad, this));
			 
			 createjs.Sound.registerSound("/sites/default/files/games/bubble-shooter/sounds/explosion.mp3", "explosion");
			 createjs.Sound.registerSound("/sites/default/files/games/bubble-shooter/sounds/soundtrack.mp3", "soundtrack");
			 createjs.Sound.registerSound("/sites/default/files/games/bubble-shooter/sounds/game_over.mp3", "game_over");
			 createjs.Sound.registerSound("/sites/default/files/games/bubble-shooter/sounds/launch.mp3", "launch");
			 createjs.Sound.registerSound("/sites/default/files/games/bubble-shooter/sounds/win.mp3", "win");
		}
         RESOURCE_TO_LOAD +=5;
    };
	
    this.handleFileLoad = function(){
         _iCurResource++;
         if(_iCurResource === RESOURCE_TO_LOAD){
            _oPreloader.unload();
            
			if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
                s_oSoundTrackSnd = createjs.Sound.play("soundtrack", {interrupt: createjs.Sound.INTERRUPT_ANY, loop:-1,volume:0.2});
            }
			
            this.gotoMenu();
         }
    };
    
    this._loadImages = function(){
		
        s_oSpriteLibrary.init( this._onImagesLoaded,this._onAllImagesLoaded, this );

        s_oSpriteLibrary.addSprite("but_play","/sites/default/files/games/bubble-shooter/sprites/but_play.png");
        s_oSpriteLibrary.addSprite("but_exit","/sites/default/files/games/bubble-shooter/sprites/but_exit.png");
        s_oSpriteLibrary.addSprite("bg_menu","/sites/default/files/games/bubble-shooter/sprites/bg_menu.jpg");
        s_oSpriteLibrary.addSprite("bg_game","/sites/default/files/games/bubble-shooter/sprites/bg_game.jpg");
        s_oSpriteLibrary.addSprite("msg_box","/sites/default/files/games/bubble-shooter/sprites/msg_box.png");
        s_oSpriteLibrary.addSprite("bg_help","/sites/default/files/games/bubble-shooter/sprites/bg_help.png");
        s_oSpriteLibrary.addSprite("balls","/sites/default/files/games/bubble-shooter/sprites/balls.png");
        s_oSpriteLibrary.addSprite("ball_explosion","/sites/default/files/games/bubble-shooter/sprites/ball_explosion.png");
        s_oSpriteLibrary.addSprite("wall_tile","/sites/default/files/games/bubble-shooter/sprites/wall_tile.jpg");
		s_oSpriteLibrary.addSprite("audio_icon","/sites/default/files/games/bubble-shooter/sprites/audio_icon.png");
		s_oSpriteLibrary.addSprite("hit_area","/sites/default/files/games/bubble-shooter/sprites/hit_area.png");
        
        RESOURCE_TO_LOAD += s_oSpriteLibrary.getNumSprites();
        s_oSpriteLibrary.loadSprites();
    };
    
    this._onImagesLoaded = function(){
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource/RESOURCE_TO_LOAD *100);

        _oPreloader.refreshLoader(iPerc);
        
        if(_iCurResource === RESOURCE_TO_LOAD){
            _oPreloader.unload();

            if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
                s_oSoundTrackSnd = createjs.Sound.play("soundtrack", {interrupt: createjs.Sound.INTERRUPT_ANY, loop:-1,volume:0.2});
            }
			
            this.gotoMenu();
        }
    };
    
    this._onAllImagesLoaded = function(){
        
    };
    
    this.onAllPreloaderImagesLoaded = function(){
        this._loadImages();
    };
    
    this.gotoMenu = function(){
        _oMenu = new CMenu();
        _iState = STATE_MENU;
    };
    
    this.gotoGame = function(){
        _oGame = new CGame(_oGameData);     
							
        _iState = STATE_GAME;
        $(s_oMain).trigger("game_start");
    };
    
    this.gotoHelp = function(){
        _oHelp = new CHelp();
        _iState = STATE_HELP;
    };
    
    this._update = function(event){
        var iCurTime = new Date().getTime();
        s_iTimeElaps = iCurTime - s_iPrevTime;
        s_iCntTime += s_iTimeElaps;
        s_iCntFps++;
        s_iPrevTime = iCurTime;
        
        if ( s_iCntTime >= 1000 ){
            s_iCurFps = s_iCntFps;
            s_iCntTime-=1000;
            s_iCntFps = 0;
        }
                
        if(_iState === STATE_GAME){
            _oGame.update();
        }
        
        s_oStage.update(event);

    };
    
    s_oMain = this;

	_oGameData = oData;
	
    this.initContainer();
}

var s_iCntTime = 0;
var s_iTimeElaps = 0;
var s_iPrevTime = 0;
var s_iCntFps = 0;
var s_iCurFps = 0;

var s_bMobile;
var s_bAudioActive = true;
var s_oSoundTrackSnd;
var s_oDrawLayer;
var s_oStage;
var s_oMain;
var s_oSpriteLibrary;