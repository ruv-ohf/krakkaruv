function CMain(oData){

    var _iCurResource = 0;
    var RESOURCE_TO_LOAD = 0;
    var _iState = STATE_LOADING;
	var _oData = oData;
    
    var _oPreloader;
    var _oMenu;
    var _oHelp;
    var _oGame;

    this.initContainer = function(){
        var canvas = document.getElementById("canvas");
        s_oStage = new createjs.Stage(canvas);
        createjs.Touch.enable(s_oStage);

        s_bMobile = jQuery.browser.mobile;
        
        s_iPrevTime = new Date().getTime();

	createjs.Ticker.addEventListener("tick", this._update);
        
        s_oSpriteLibrary  = new CSpriteLibrary();

        //ADD PRELOADER
        _oPreloader = new CPreloader();
        this._loadImages();
		
		if(navigator.userAgent.match(/Windows Phone/i)){
			DISABLE_SOUND_MOBILE = true;
		}
		
		if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            this._initSounds();
        }
    };
    
    this._initSounds = function(){
         if (!createjs.Sound.initializeDefaultPlugins()) {
             return;
         }
         
		 if(navigator.userAgent.indexOf("Opera")>0 || navigator.userAgent.indexOf("OPR")>0){
			createjs.Sound.alternateExtensions = ["mp3"];
			 createjs.Sound.addEventListener("fileload", createjs.proxy(this.handleFileLoad, this));
			 
			 createjs.Sound.registerSound("./sounds/soundtrack.ogg", "soundtrack");     
			 createjs.Sound.registerSound("./sounds/move.ogg", "move");
			 createjs.Sound.registerSound("./sounds/explosion.ogg", "explosion");
		 }else{
			createjs.Sound.alternateExtensions = ["ogg"];
			 createjs.Sound.addEventListener("fileload", createjs.proxy(this.handleFileLoad, this));
			 
			 createjs.Sound.registerSound("./sounds/soundtrack.mp3", "soundtrack");     
			 createjs.Sound.registerSound("./sounds/move.mp3", "move");
			 createjs.Sound.registerSound("./sounds/explosion.mp3", "explosion");
		 }
         
         
         RESOURCE_TO_LOAD +=3;
    };
    
    this._loadImages = function(){
        s_oSpriteLibrary.init( this._onImagesLoaded,this._onAllImagesLoaded, this );

        s_oSpriteLibrary.addSprite("but_play","./sprites/but_play.png");
        s_oSpriteLibrary.addSprite("but_exit","./sprites/but_exit.png");
        s_oSpriteLibrary.addSprite("bg_menu","./sprites/bg_menu.jpg");
        s_oSpriteLibrary.addSprite("but_right","./sprites/but_right.png");
        s_oSpriteLibrary.addSprite("but_left","./sprites/but_left.png");
        s_oSpriteLibrary.addSprite("but_down","./sprites/but_down.png");
        s_oSpriteLibrary.addSprite("but_up","./sprites/but_up.png");
        s_oSpriteLibrary.addSprite("game_bg","./sprites/bg_game.jpg");
        s_oSpriteLibrary.addSprite("block","./sprites/block.png");
        s_oSpriteLibrary.addSprite("msg_box","./sprites/msg_box.png");
        s_oSpriteLibrary.addSprite("bg_help","./sprites/bg_help.png");
        s_oSpriteLibrary.addSprite("audio_icon","./sprites/audio_icon.png");
        
        RESOURCE_TO_LOAD += s_oSpriteLibrary.getNumSprites();
        s_oSpriteLibrary.loadSprites();
    };
    
    this.handleFileLoad = function(evt){
         _iCurResource++;

         if(_iCurResource === RESOURCE_TO_LOAD){
             _oPreloader.unload();
            
			if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
				createjs.Sound.play("soundtrack", { loop:-1,volume:0.5});
			}
            this.gotoMenu();
         }
    };
    
    this._onImagesLoaded = function(){
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource/RESOURCE_TO_LOAD *100);
        _oPreloader.refreshLoader(iPerc);
		
        if(_iCurResource === RESOURCE_TO_LOAD){
            _oPreloader.unload();
            
			if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
				createjs.Sound.play("soundtrack", {loop:-1,volume:0.5});
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
        _oGame = new CGame(_oData);
                          
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

    this.initContainer();
}

var s_iCntTime = 0;
var s_iTimeElaps = 0;
var s_iPrevTime = 0;
var s_iCntFps = 0;
var s_iCurFps = 0;

var s_bMobile;
var s_bAudioActive = true;
var s_oDrawLayer;
var s_oStage;
var s_oMain;
var s_oSpriteLibrary;