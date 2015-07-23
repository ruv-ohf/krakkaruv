function CInterface(oBallSpriteSheet){
    var _oButExit;
    var _oHitArea;
    var _oNextBall;
    var _oNext;
    var _oNextBack;
    var _oScoreTextBack;
    var _oScoreText;
    var _oLevelText;
    var _oLevelTextBack;
    var _oCongratsText;
    var _oCongratsTextBack;
    var _oNextLevelPanel;
	var _oAudioToggle;
    
    this._init = function(oBallSpriteSheet){
        var oParent = this;
        
        var oBgGUI = new createjs.Shape();
        oBgGUI.graphics.beginFill("rgba(0,0,0,0.5)").drawRect(0,0,CANVAS_WIDTH,110);
        s_oStage.addChild(oBgGUI);
        
	_oScoreTextBack = new createjs.Text(TEXT_SCORE +": 0","bold 40px comic_sans_msregular", "#000000");
        _oScoreTextBack.x = CANVAS_WIDTH/2 +2;
        _oScoreTextBack.y = CANVAS_HEIGHT - 14;
        _oScoreTextBack.textAlign = "center";
		_oScoreTextBack.textBaseline = "alphabetic";
        s_oStage.addChild(_oScoreTextBack);
		
	_oScoreText = new createjs.Text(TEXT_SCORE +": 0","bold 40px comic_sans_msregular", "#ffffff");
        _oScoreText.x = CANVAS_WIDTH/2;
        _oScoreText.y = CANVAS_HEIGHT - 16;
        _oScoreText.textAlign = "center";
		_oScoreText.textBaseline = "alphabetic";
        s_oStage.addChild(_oScoreText);
        
        _oNextBack = new createjs.Text(TEXT_NEXT,"bold 34px comic_sans_msregular", "#000000");
        _oNextBack.x = CANVAS_WIDTH/2 - 31;
        _oNextBack.y = 94;
        _oNextBack.textAlign = "center";
		_oNextBack.textBaseline = "alphabetic";
        s_oStage.addChild(_oNextBack);
		
	_oNext = new createjs.Text(TEXT_NEXT ,"bold 34px comic_sans_msregular", "#ffffff");
        _oNext.x = (CANVAS_WIDTH/2) - 30;
        _oNext.y = 92;
        _oNext.textAlign = "center";
		_oNext.textBaseline = "alphabetic";
        s_oStage.addChild(_oNext);
        
        _oNextBall = new createjs.Sprite(oBallSpriteSheet,"ball_0");
        _oNextBall.stop();
        _oNextBall.x = (CANVAS_WIDTH/2) + 26;
        _oNextBall.y = 56;
        s_oStage.addChild(_oNextBall);
        
        _oLevelTextBack = new createjs.Text(TEXT_LEVEL +" 1","bold 34px comic_sans_msregular", "#000000");
        _oLevelTextBack.x = CANVAS_WIDTH/2 + 1;
        _oLevelTextBack.y = 40;
        _oLevelTextBack.textAlign = "center";
		_oLevelTextBack.textBaseline = "alphabetic";
        s_oStage.addChild(_oLevelTextBack);
        
        _oLevelText = new createjs.Text(TEXT_LEVEL +" 1","bold 34px comic_sans_msregular", "#ffffff");
        _oLevelText.x = CANVAS_WIDTH/2;
        _oLevelText.y = 38;
        _oLevelText.textAlign = "center";
		_oLevelText.textBaseline = "alphabetic";
        s_oStage.addChild(_oLevelText);

        _oCongratsTextBack = new createjs.Text(TEXT_VERYGOOD ,"bold 60px comic_sans_msregular", "#000000");
        _oCongratsTextBack.x = CANVAS_WIDTH/2 + 4;
        _oCongratsTextBack.y = -76;
        _oCongratsTextBack.textAlign = "center";
		_oCongratsTextBack.textBaseline = "alphabetic";
        s_oStage.addChild(_oCongratsTextBack);
        
        _oCongratsText = new createjs.Text(TEXT_VERYGOOD ,"bold 60px comic_sans_msregular", "#ffffff");
        _oCongratsText.x = CANVAS_WIDTH/2;
        _oCongratsText.y = -80;
        _oCongratsText.textAlign = "center";
		_oCongratsText.textBaseline = "alphabetic";
        s_oStage.addChild(_oCongratsText);
        
        var oParent = this;
		_oHitArea = new createjs.Bitmap(s_oSpriteLibrary.getSprite('hit_area'));
        s_oStage.addChild(_oHitArea);
		_oHitArea.on("pressup",function(e){oParent._onTapScreen(e.stageX,e.stageY)});  
        
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _oButExit = new CGfxButton(CANVAS_WIDTH - (oSprite.width/2) -20,60,oSprite,true);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);
		
		if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle = new CToggle((oSprite.width/2)+20,60,s_oSpriteLibrary.getSprite('audio_icon'));
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
        }
    };
    
    this.unload = function(){
        _oButExit.unload();
        _oButExit = null;
        
        s_oStage.removeChild(_oScoreText);
        s_oStage.removeChild(_oScoreTextBack);
		
		if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
		
		var oParent = this;
		_oHitArea.off("pressup",function(e){oParent._onTapScreen(e.stageX,e.stageY)});
		s_oStage.removeChild(_oHitArea);
    };

    this.refreshScore = function(iScore){
        _oScoreTextBack.text = TEXT_SCORE +": "+iScore;
        _oScoreText.text = TEXT_SCORE +": "+iScore;
    };
    
    this.setNextBall = function(iCodeColor){
        _oNextBall.gotoAndStop("ball_"+iCodeColor);
    };
    
    this.showCongrats = function(szText){
        _oCongratsText.text = szText;
        _oCongratsTextBack.text = szText;
        
        createjs.Tween.get(_oCongratsText).to({y:CANVAS_HEIGHT/2} , 500,createjs.Ease.quintOut).call(function() {
                                                    createjs.Tween.get(_oCongratsText).to({y:-60} , 700,createjs.Ease.quintIn);
                                                });
                                                
        createjs.Tween.get(_oCongratsTextBack).to({y:CANVAS_HEIGHT/2} , 500,createjs.Ease.quintOut).call(function() {
                                                    createjs.Tween.get(_oCongratsTextBack).to({y:-56} , 700,createjs.Ease.quintIn);
                                                });
    };
    
    this.showNextLevel = function(iLevel,iScore){
		$(s_oMain).trigger("end_level");
        _oNextLevelPanel = new CNextLevelPanel(iLevel,iScore);
    };
    
    this.refreshLevelText = function(iLevel){
        _oLevelText.text = TEXT_LEVEL +" "+iLevel;
        _oLevelTextBack.text = TEXT_LEVEL +" "+iLevel;
    };
    
    this._onExit = function(){
        s_oGame.onExit();  
    };
    
    this._onTapScreen = function(iX,iY){
        s_oGame.tapScreen(iX,iY);
    };
	
	this._onAudioToggle = function(){
        createjs.Sound.setMute(!s_bAudioActive);
    };
    
    this._init(oBallSpriteSheet);
    
    return this;
}