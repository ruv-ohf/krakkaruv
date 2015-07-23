function CInterface(){
    
    var _aButton;
    var _oButDelete;
    var _oToggleNote;
    var _oToggleMode;
    var _oButHelp;
    var _oTimeText;
    var _oTimeNum;
    var _oTimePane;
    var _oAudioToggle;
    var _oButConf;
    var _oButExit;
    
    
    var _pStartPosExit;
    var _pStartPosAudio;
    var _pStartPosConf;
    var _pStartPosHelp;
    
    
    this._init = function(){                
        
        _aButton = new Array();
        var oButStartPos = {x: 97, y: 1500};
        var oOffset = {x: 177.5, y:150};
        for(var i=0; i<9; i++){
            if(i>5){
                _aButton[i+1] = new CNumButton(oButStartPos.x + (i-6)*oOffset.x , oButStartPos.y + oOffset.y ,i+1);
            }else {
                _aButton[i+1] = new CNumButton(oButStartPos.x +i*oOffset.x, oButStartPos.y  ,i+1);
            }                        
        };
        
        var oSprite = s_oSpriteLibrary.getSprite('but_del_toggle');
        _oButDelete = new CDeleteButton(oButStartPos.x + 3*oOffset.x , oButStartPos.y  + oOffset.y, oSprite,false);
        _oButDelete.changeMode();
        
        var oSprite = s_oSpriteLibrary.getSprite('note_toggle');
        _oToggleNote = new CToggle(oButStartPos.x + 4*oOffset.x , oButStartPos.y  + oOffset.y,oSprite,true);
        _oToggleNote.addEventListener(ON_MOUSE_UP, this._onNoteToggle, this); 
        
        var oSprite = s_oSpriteLibrary.getSprite('mode_toggle');
        _oToggleMode = new CToggle(oButStartPos.x + 5*oOffset.x , oButStartPos.y  + oOffset.y,oSprite,true);
        _oToggleMode.addEventListener(ON_MOUSE_UP, this._onModeToggle, this);
        
        
       
        var oExitX;        
        
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {x: CANVAS_WIDTH - (oSprite.height/2)- 20, y: (oSprite.height/2) + 10};
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite, s_oStage);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);
        
        oExitX = CANVAS_WIDTH - (oSprite.width/2) - 175;
        _pStartPosAudio = {x: oExitX, y: (oSprite.height/2) + 10};
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);          
        }
        
        oExitX = CANVAS_WIDTH - (oSprite.width/2) - 257;
        
        var oSprite = s_oSpriteLibrary.getSprite('config_icon');
        _pStartPosConf = {x: oExitX, y: (oSprite.height/2) + 10};
        _oButConf = new CGfxButton(_pStartPosConf.x,_pStartPosConf.y,oSprite,s_oStage);
        _oButConf.addEventListener(ON_MOUSE_UP, this._onConf, this);

        oExitX = CANVAS_WIDTH - (oSprite.width/2) - 490;
        
        var oSprite = s_oSpriteLibrary.getSprite('but_help_icon');
        _pStartPosHelp = {x: oExitX, y: (oSprite.height/2) + 10};
        _oButHelp = new CGfxButton(_pStartPosHelp.x,_pStartPosHelp.y,oSprite,s_oStage);
        _oButHelp.addEventListener(ON_MOUSE_UP, this._onHelpPress, this);


        var oSprite = s_oSpriteLibrary.getSprite('time_display');
        _oTimePane = createBitmap(oSprite);
        _oTimePane.x = 220;
        _oTimePane.y = 260;
        s_oStage.addChild(_oTimePane);

        _oTimeText = new createjs.Text(TEXT_TIME,"bold 60px Arial", "#008df0");
        _oTimeText.x = 40;
        _oTimeText.y = 325;
        _oTimeText.textAlign = "left";
        _oTimeText.textBaseline = "alphabetic";
        _oTimeText.lineWidth = 200;
        s_oStage.addChild(_oTimeText);

        _oTimeNum = new createjs.Text("00:00","bold 60px Arial", "#ffffff");
        _oTimeNum.x = 245;
        _oTimeNum.y = 325;
        _oTimeNum.textAlign = "left";
        _oTimeNum.textBaseline = "alphabetic";
        _oTimeNum.lineWidth = 200;
        s_oStage.addChild(_oTimeNum);

        
       
       this.refreshButtonPos(s_iOffsetX,s_iOffsetY);
    };
    
    this.unload = function(){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }

        _oButExit.unload();

        for(var i=0; i<9; i++){
            _aButton[i+1].unload();
        }
        _oButDelete.unload();
        _oToggleNote.unload();
        _oToggleMode.unload();
        _oButHelp.unload();

    };
    
    this.refreshButtonPos = function(iNewX,iNewY){
        _oButExit.setPosition(_pStartPosExit.x - iNewX,iNewY + _pStartPosExit.y);
        _oButConf.setPosition(_pStartPosConf.x - iNewX,iNewY + _pStartPosConf.y);
        _oButHelp.setPosition(_pStartPosHelp.x - iNewX,iNewY + _pStartPosHelp.y)
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX,iNewY + _pStartPosAudio.y);
        }    
    };
    
    this.refreshTime = function(iValue){
        _oTimeNum.text = iValue;
    };

    this._onConf = function(){
        new CConfigPanel();
    };
   
    this.setNoTime = function(){
        s_oStage.removeChild(_oTimeText, _oTimeNum, _oTimePane);
    };
   
    this._onHelpPress = function(){
        new CHelpPanel();
        s_oGame.pauseTimer(true);
    };
   
    this._onNoteToggle = function(){
        s_oGame.setNoteState();
    };

    this._onModeToggle = function(){
        for(var i=0; i<9; i++){
            _aButton[i+1].changeMode();
        }
        _oButDelete.changeMode();
        this.setAllBlackColor();
        s_oGame.setDigitState();
    };
    
    this.updateCounterOnButton = function(iNum, iLength){
        _aButton[iNum].clearCounter();
        _aButton[iNum].setCounter(iLength);
    };
    
    this.pressNumButton = function(iNum){
        _aButton[iNum].buttonDown();
    };
    
    this.releaseNumButton = function(iNum){
        _aButton[iNum].buttonRelease();
    };
    
    this.pressDelButton = function(){
        _oButDelete.buttonDown();
    };
    
    this.releaseDelButton = function(iNum){
        _oButDelete.buttonRelease();
    };

    this.setAllBlackColor = function(){
        for(var i=0; i<9; i++){
            _aButton[i+1].changeNumColor(false);
        }
        
        _oButDelete.reset();
    };  

    this._onButHelpRelease = function(){
        _oHelpPanel = new CHelpPanel();
    };
    
    this._onButRestartRelease = function(){
        s_oGame.restartGame();
    };
    
    this.onExitFromHelp = function(){
        _oHelpPanel.unload();
    };
    
    this._onAudioToggle = function(){
        createjs.Sound.setMute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    this._onExit = function(){
      s_oGame.onExit();  
    };
    
    s_oInterface = this;
    
    this._init();
    
    return this;
}

var s_oInterface = null;