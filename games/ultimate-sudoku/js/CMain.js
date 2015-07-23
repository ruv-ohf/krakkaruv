function CMain(oData){
    var _bUpdate;
    var _iCurResource = 0;
    var RESOURCE_TO_LOAD = 0;
    var _iState = STATE_LOADING;
    var _oData;
    
    var _oPreloader;
    var _oMenu;
    var _oModeMenu;
    var _oHelp;
    var _oGame;

    this.initContainer = function(){
        s_oCanvas = document.getElementById("canvas");
        s_oStage = new createjs.Stage(s_oCanvas);
        createjs.Touch.enable(s_oStage);
		
	s_bMobile = jQuery.browser.mobile;
        if(s_bMobile === false){
            s_oStage.enableMouseOver(20);  
            $('body').on('contextmenu', '#canvas', function(e){ return false; });
        }
		
        s_iPrevTime = new Date().getTime();

	createjs.Ticker.addEventListener("tick", this._update);
        createjs.Ticker.setFPS(20);
        
        if(navigator.userAgent.match(/Windows Phone/i)){
                DISABLE_SOUND_MOBILE = true;
        }
        
        s_oSpriteLibrary  = new CSpriteLibrary();

        //ADD PRELOADER
        _oPreloader = new CPreloader();
		
	
    };
    
    this.preloaderReady = function(){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            this._initSounds();
        }
        
        this._loadImages();
    };
    
    this.soundLoaded = function(){
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource/RESOURCE_TO_LOAD *100);
        _oPreloader.refreshLoader(iPerc);

         if(_iCurResource === RESOURCE_TO_LOAD){
             _oPreloader.unload();
            this.gotoMenu();
         }
    };
    
    this._initSounds = function(){
         if (!createjs.Sound.initializeDefaultPlugins()) {
             return;
         }

        if(navigator.userAgent.indexOf("Opera")>0 || navigator.userAgent.indexOf("OPR")>0){
                createjs.Sound.alternateExtensions = ["mp3"];
                createjs.Sound.addEventListener("fileload", createjs.proxy(this.soundLoaded, this));
               
                createjs.Sound.registerSound("./sounds/press_button.ogg", "click");
                createjs.Sound.registerSound("./sounds/game_over.ogg", "game_over");
        }else{
                createjs.Sound.alternateExtensions = ["ogg"];
                createjs.Sound.addEventListener("fileload", createjs.proxy(this.soundLoaded, this));

                createjs.Sound.registerSound("./sounds/press_button.mp3", "click");
                createjs.Sound.registerSound("./sounds/game_over.mp3", "game_over");

              
        }
        
        RESOURCE_TO_LOAD += 2;
        
    };

    this._loadImages = function(){
        s_oSpriteLibrary.init( this._onImagesLoaded,this._onAllImagesLoaded, this );

        s_oSpriteLibrary.addSprite("but_play","./sprites/but_play.png");
        s_oSpriteLibrary.addSprite("msg_box","./sprites/msg_box.png");
        
        s_oSpriteLibrary.addSprite("bg_menu","./sprites/bg_menu.jpg");
        s_oSpriteLibrary.addSprite("bg_mode_menu","./sprites/bg_mode_menu.jpg");
        s_oSpriteLibrary.addSprite("mod_easy_icon","./sprites/mod_easy_icon.png");
        s_oSpriteLibrary.addSprite("mod_medium_icon","./sprites/mod_medium_icon.png");
        s_oSpriteLibrary.addSprite("mod_hard_icon","./sprites/mod_hard_icon.png");
        s_oSpriteLibrary.addSprite("bg_game","./sprites/bg_game.jpg");
        s_oSpriteLibrary.addSprite("bg_help","./sprites/bg_help.png");
        s_oSpriteLibrary.addSprite("bg_help2","./sprites/bg_help2.png");     
        s_oSpriteLibrary.addSprite("arrow","./sprites/arrow.png");
        
        s_oSpriteLibrary.addSprite("but_exit","./sprites/but_exit.png");
        s_oSpriteLibrary.addSprite("audio_icon","./sprites/audio_icon.png");
        s_oSpriteLibrary.addSprite("config_icon","./sprites/config_icon.png");    
        s_oSpriteLibrary.addSprite("but_help_icon","./sprites/but_help_icon.png"); 
        s_oSpriteLibrary.addSprite("but_help_note","./sprites/but_help_note.png");
        s_oSpriteLibrary.addSprite("but_del_note","./sprites/but_del_note.png");
        s_oSpriteLibrary.addSprite("but_solve","./sprites/but_solve.png");
        s_oSpriteLibrary.addSprite("but_reset","./sprites/but_reset.png");
        s_oSpriteLibrary.addSprite("but_time","./sprites/but_time.png");
        s_oSpriteLibrary.addSprite("but_help_hint","./sprites/but_help_hint.png");
        s_oSpriteLibrary.addSprite("time_display","./sprites/time_display.png");
        
        s_oSpriteLibrary.addSprite("given_bg","./sprites/given_bg.png");
        s_oSpriteLibrary.addSprite("blank","./sprites/blank.png");
        s_oSpriteLibrary.addSprite("background","./sprites/background.png");
        s_oSpriteLibrary.addSprite("highlight","./sprites/highlight.png");
        s_oSpriteLibrary.addSprite("cell_selected","./sprites/cell_selected.png");
        s_oSpriteLibrary.addSprite("but_num","./sprites/but_num.png");
        s_oSpriteLibrary.addSprite("but_del_toggle","./sprites/but_del_toggle.png");
        s_oSpriteLibrary.addSprite("note_toggle","./sprites/note_toggle.png");
        s_oSpriteLibrary.addSprite("mode_toggle","./sprites/mode_toggle.png");
        
        
        RESOURCE_TO_LOAD += s_oSpriteLibrary.getNumSprites();
        s_oSpriteLibrary.loadSprites();
    };
    
    this._onImagesLoaded = function(){
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource/RESOURCE_TO_LOAD *100);
        //console.log("PERC: "+iPerc);
        _oPreloader.refreshLoader(iPerc);
        
        if(_iCurResource === RESOURCE_TO_LOAD){
            _oPreloader.unload();
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
        
    this.goToModeMenu = function(){
        _oModeMenu = new CModeMenu();
        _iState = STATE_MENU;
    };    

    this.gotoGame = function(iMode){
        s_iDifficultyMode=iMode;
        _oGame = new CGame(_oData);  
        
        _iState = STATE_GAME;

        $(s_oMain).trigger("game_start");
    };
    
    this.gotoHelp = function(){
        _oHelp = new CHelp();
        _iState = STATE_HELP;
    };
	
	this.stopUpdate = function(){
		_bUpdate = false;
	};
	
	this.startUpdate = function(){
            s_iPrevTime = new Date().getTime();
		_bUpdate = true;
	};
    
    this._update = function(event){
        if(_bUpdate === false){
                return;
        }
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
    
    _oData = oData;
    
    this.initContainer();
}
var s_bMobile;
var s_iDifficultyMode;
var s_bAudioActive = true;
var s_iCntTime = 0;
var s_iTimeElaps = 0;
var s_iPrevTime = 0;
var s_iCntFps = 0;
var s_iCurFps = 0;

var s_oDrawLayer;
var s_oStage;
var s_oMain;
var s_oSpriteLibrary;
var s_oCanvas;
