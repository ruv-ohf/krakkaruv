function CInterface(iLevel,iLives){
    var _oButExit;
    var _oAudioToggle;
    var _oScoreTextBack;
    var _oScoreText;
    var _oEndPanel;
    var _oLifeSprite;
    var _oLifeTextBack;
    var _oLifeText;
    var _oLevelTextBack;
    var _oLevelText;
    
    this._init = function(iLevel,iLives){
        
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _oButExit = new CGfxButton(CANVAS_WIDTH - (oSprite.width/2) - 120,60,oSprite,true);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle = new CToggle(CANVAS_WIDTH - 60,60,s_oSpriteLibrary.getSprite('audio_icon'));
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
        }
        
        _oScoreTextBack = new createjs.Text(TEXT_SCORE+": 0","bold 40px Arial", "#000000");
        _oScoreTextBack.x = (CANVAS_WIDTH - 160);
        _oScoreTextBack.y = CANVAS_HEIGHT - 63;
        _oScoreTextBack.textAlign = "center";
        s_oStage.addChild(_oScoreTextBack);
        
        _oScoreText = new createjs.Text(TEXT_SCORE+": 0","bold 40px Arial", "#ffffff");
        _oScoreText.x = (CANVAS_WIDTH - 158);
        _oScoreText.y = CANVAS_HEIGHT - 65;
        _oScoreText.textAlign = "center";
        s_oStage.addChild(_oScoreText);
        
        var oSpriteLife = s_oSpriteLibrary.getSprite("life");
        _oLifeSprite = createBitmap(oSpriteLife);
        _oLifeSprite.x = 10;
        _oLifeSprite.y = CANVAS_HEIGHT - oSpriteLife.height -10;
        s_oStage.addChild(_oLifeSprite);
        
        _oLifeTextBack = new createjs.Text("X"+iLives,"bold 40px Arial", "#000000");
        _oLifeTextBack.x = _oLifeSprite.x + oSpriteLife.width + 7;
        _oLifeTextBack.y = CANVAS_HEIGHT - oSpriteLife.height +5;
        s_oStage.addChild(_oLifeTextBack);
        
        _oLifeText = new createjs.Text("X"+iLives,"bold 40px Arial", "#ffffff");
        _oLifeText.x = _oLifeSprite.x + oSpriteLife.width + 5;
        _oLifeText.y = CANVAS_HEIGHT - oSpriteLife.height +3;
        s_oStage.addChild(_oLifeText);
        
        _oLevelTextBack = new createjs.Text(TEXT_LEVEL+" "+iLevel,"bold 40px Arial", "#000000");
        _oLevelTextBack.x = 122;
        _oLevelTextBack.y = 42;
        _oLevelTextBack.textAlign = "center";
        s_oStage.addChild(_oLevelTextBack);
        
        _oLevelText = new createjs.Text(TEXT_LEVEL+" "+iLevel,"bold 40px Arial", "#ffffff");
        _oLevelText.x = 120;
        _oLevelText.y = 40;
        _oLevelText.textAlign = "center";
        s_oStage.addChild(_oLevelText);
        
        _oEndPanel = new CEndPanel(s_oSpriteLibrary.getSprite('msg_box'));
    };
    
    this.unload = function(){
        _oButExit.unload();
        _oButExit = null;
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        
        s_oStage.removeChild(_oLevelText);   
        s_oStage.removeChild(_oLifeTextBack);
        s_oStage.removeChild(_oLifeText);
        s_oStage.removeChild(_oLifeSprite);
        s_oStage.removeChild(_oScoreText);
        s_oStage.removeChild(_oScoreTextBack);
    };
    
    this.refreshScore = function(iScore){
      _oScoreText.text = TEXT_SCORE +": "+ iScore;
      _oScoreTextBack.text = TEXT_SCORE +": "+ iScore;
    };
    
    this.refreshLives = function(iLives){
        _oLifeText.text = "X"+iLives;
        _oLifeTextBack.text = "X"+iLives;
    };
    
    this.refreshLevel = function(iLevel){
        _oLevelText.text = TEXT_LEVEL+" "+iLevel;
        _oLevelTextBack.text = TEXT_LEVEL+" "+iLevel;
    };
    
    this.gameOver = function(iScore){
        _oEndPanel.show(iScore);
    };
    
    this._onExit = function(){
      s_oGame.onExit();  
    };
    
    this._onAudioToggle = function(){
        createjs.Sound.setMute(!s_bAudioActive);
    };
    
    this._init(iLevel,iLives);
    
    return this;
}