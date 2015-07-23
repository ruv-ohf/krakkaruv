function CNextLevelPanel(iLevel,iScore){
    
    var _oContainer;
    
    this._init = function(iLevel,iScore){
        var oBg = new createjs.Bitmap(s_oSpriteLibrary.getSprite('msg_box'));
        
        var oLevelTextBack = new createjs.Text(TEXT_LEVEL+" "+iLevel+" "+TEXT_COMPLETED,"bold 40px comic_sans_msregular", "#000000");
        oLevelTextBack.x = CANVAS_WIDTH/2 + 1;
        oLevelTextBack.y = 422;
        oLevelTextBack.textAlign = "center";
        
        var oLevelText = new createjs.Text(TEXT_LEVEL+" "+iLevel+" "+TEXT_COMPLETED,"bold 40px comic_sans_msregular", "#ffffff");
        oLevelText.x = CANVAS_WIDTH/2;
        oLevelText.y = 420;
        oLevelText.textAlign = "center";
        
        var oScoreTextBack = new createjs.Text(TEXT_SCORE+": "+iScore,"bold 44px comic_sans_msregular", "#000000");
        oScoreTextBack.x = CANVAS_WIDTH/2 + 1;
        oScoreTextBack.y = 522;
        oScoreTextBack.textAlign = "center";
        
        var oScoreText = new createjs.Text(TEXT_SCORE+": "+iScore,"bold 44px comic_sans_msregular", "#ffffff");
        oScoreText.x = CANVAS_WIDTH/2;
        oScoreText.y = 520;
        oScoreText.textAlign = "center";
        
        _oContainer = new createjs.Container();
        _oContainer.addChild(oBg,oLevelTextBack,oLevelText,oScoreTextBack,oScoreText);
        
        s_oStage.addChild(_oContainer);
        
        _oContainer.on("mousedown",this._onExit);
    };
    
    this._onExit = function(){
        _oContainer.off("mousedown");
        _oContainer.removeAllChildren();
        s_oGame.resetLevel();
    };
    
    this._init(iLevel,iScore);
}