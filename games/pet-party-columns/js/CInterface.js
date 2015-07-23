function CInterface(oSpriteSheet){
    var NEXT1_POS = {x:CANVAS_WIDTH - 100,y:260+(GRID_SIZE*2)};
    var NEXT2_POS = {x:CANVAS_WIDTH - 100,y:260+GRID_SIZE};
    var NEXT3_POS = {x:CANVAS_WIDTH - 100,y:260};
    
    
    var BUT_LEFT_POS  = {x:60,y:CANVAS_HEIGHT-60};
    var BUT_RIGHT_POS = {x:700,y:CANVAS_HEIGHT-60};
    var BUT_DOWN_POS  = {x:580,y:CANVAS_HEIGHT-60};
    var BUT_UP_POS    = {x:180,y:CANVAS_HEIGHT-60};

    var _oNext1;
    var _oNext2;
    var _oNext3;
    
    var _oButExit;
    var _oButLeft;
    var _oButRight;
    var _oButUp;
    var _oButDown;
    var _oAudioToggle;
    var _oScoreTextBack;
    var _oScoreText;
    var _oNextText;
    var _oNextBackText;
    var _oEndPanel;
    
    this._init = function(oSpriteSheet){
        _oNext1 = createSprite(oSpriteSheet, "invisible",0,0,GRID_SIZE,GRID_SIZE);
        _oNext1.stop();
        _oNext1.x = NEXT1_POS.x;
        _oNext1.y = NEXT1_POS.y;
        
        _oNext2 = createSprite(oSpriteSheet, "invisible",0,0,GRID_SIZE,GRID_SIZE);
        _oNext2.stop();
        _oNext2.x = NEXT2_POS.x;
        _oNext2.y = NEXT2_POS.y;
        
        _oNext3 = createSprite(oSpriteSheet, "invisible",0,0,GRID_SIZE,GRID_SIZE);
        _oNext3.stop();
        _oNext3.x = NEXT3_POS.x;
        _oNext3.y = NEXT3_POS.y;
        
        s_oStage.addChild(_oNext1);
        s_oStage.addChild(_oNext2);
        s_oStage.addChild(_oNext3);
        
        var oSprite = s_oSpriteLibrary.getSprite('but_left');
        _oButLeft = new CGfxButton(BUT_LEFT_POS.x,BUT_LEFT_POS.y,oSprite,true);
        _oButLeft.addEventListener(ON_MOUSE_UP, this._onReleaseLeft, this);
        
        oSprite = s_oSpriteLibrary.getSprite('but_right');
        _oButRight = new CGfxButton(BUT_RIGHT_POS.x,BUT_RIGHT_POS.y,oSprite,true);
        _oButRight.addEventListener(ON_MOUSE_UP, this._onReleaseRight, this);
        
        oSprite = s_oSpriteLibrary.getSprite('but_down');
        _oButDown = new CGfxButton(BUT_DOWN_POS.x,BUT_DOWN_POS.y,oSprite,true);
        _oButDown.addEventListener(ON_MOUSE_UP, this._onReleaseButDown, this);
        
        oSprite = s_oSpriteLibrary.getSprite('but_up');
        _oButUp = new CGfxButton(BUT_UP_POS.x,BUT_UP_POS.y,oSprite,true);
        _oButUp.addEventListener(ON_MOUSE_UP, this._onReleaseButUp, this);
        
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _oButExit = new CGfxButton(CANVAS_WIDTH - (oSprite.width/2) - 10, 10+ (oSprite.height/2),oSprite,true);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);

        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle = new CToggle(CANVAS_WIDTH - (oSprite.width/2) - 10,180,s_oSpriteLibrary.getSprite('audio_icon'));
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
        }
        
	_oScoreTextBack = new createjs.Text("0 PT","bold 40px Arial", "#000000");
        _oScoreTextBack.textAlign = "center";
        _oScoreTextBack.x = CANVAS_WIDTH/2 + 1;
        _oScoreTextBack.y = CANVAS_HEIGHT - 70;
        s_oStage.addChild(_oScoreTextBack);
		
        _oScoreText = new createjs.Text("0 PT","bold 40px Arial", "#ffffff");
        _oScoreText.textAlign = "center";
        _oScoreText.x = CANVAS_WIDTH/2;
        _oScoreText.y = CANVAS_HEIGHT - 72;
        s_oStage.addChild(_oScoreText);
        
        _oNextBackText = new createjs.Text(TEXT_NEXT,"bold 32px Arial", "#000000");
        _oNextBackText.x = CANVAS_WIDTH - 108;
        _oNextBackText.y = 472;
        s_oStage.addChild(_oNextBackText);
        
        _oNextText = new createjs.Text(TEXT_NEXT,"bold 32px Arial", "#ffffff");
        _oNextText.x = CANVAS_WIDTH - 110;
        _oNextText.y = 470;
        s_oStage.addChild(_oNextText);
        
        _oEndPanel = new CEndPanel(s_oSpriteLibrary.getSprite('msg_box'));
    };
    
    this.unload = function(){
        _oButExit.unload();
        _oButExit = null;
        
        _oButLeft.unload();
        _oButLeft = null;
        
        _oButRight.unload();
        _oButRight = null;
		
        _oButDown.unload();
        _oButDown = null;

        _oButUp.unload();
        _oButUp = null;
        
        if(_oAudioToggle){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        
        s_oStage.removeChild(_oScoreText);
        s_oStage.removeChild(_oScoreTextBack);
        s_oStage.removeChild(_oNextBackText);
        s_oStage.removeChild(_oNextText);

        s_oStage.removeChild(_oNext1);
        s_oStage.removeChild(_oNext2);
        s_oStage.removeChild(_oNext3);
    };
    
    this.setNextBlock = function(iNext1,iNext2,iNext3){
        _oNext1.gotoAndStop("block_"+iNext1);
        _oNext2.gotoAndStop("block_"+iNext2);
        _oNext3.gotoAndStop("block_"+iNext3);
    };
    
    this.refreshScore = function(iScore){
      _oScoreText.text = iScore+ " PT";  
	  _oScoreTextBack.text = iScore+ " PT";
    };
    
    this.gameOver = function(iScore){
        _oEndPanel.show(iScore);
    };
    
    this._onReleaseLeft = function(){
        s_oGame.shiftLeft();
    };
    
    this._onReleaseRight = function(){
        s_oGame.shiftRight();
    };
    
    this._onReleaseButDown = function(){ 
       s_oGame.pressButDown(); 
    };
    
    this._onReleaseButUp = function(){
       s_oGame.releaseButUp();  
        
    };
    
    this._onAudioToggle = function(){
        createjs.Sound.setMute(!s_bAudioActive);
    };
    
    this._onExit = function(){
      s_oGame.onExit();  
    };
    
    this._init(oSpriteSheet);
    
    return this;
}