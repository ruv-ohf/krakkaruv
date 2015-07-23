function CNextLevelPanel(oSpriteBg){
    var _oGroup;
    var _oBg;
    var _oMsgText;
    var _oMsgTextBack;
	
    this._init = function(oSpriteBg){
        _oBg = createBitmap(oSpriteBg);

        _oMsgTextBack = new createjs.Text("","bold 70px Arial", "#000000");
        _oMsgTextBack.x = CANVAS_WIDTH/2 +2;
        _oMsgTextBack.y = (CANVAS_HEIGHT/2) - 28;
        _oMsgTextBack.textAlign = "center";

        _oMsgText = new createjs.Text("","bold 70px Arial", "#ffffff");
        _oMsgText.x = CANVAS_WIDTH/2;
        _oMsgText.y = (CANVAS_HEIGHT/2) - 30;
        _oMsgText.textAlign = "center";
		
	_oGroup = new createjs.Container();
        _oGroup.alpha = 0;
        _oGroup.visible=false;
        
        _oGroup.addChild(_oBg, _oMsgTextBack, _oMsgText);

        s_oStage.addChild(_oGroup);
		
        var oParent = this;
	_oGroup.on("mousedown",oParent._onExit);
    };

    this.show = function(iLevel){
        _oMsgTextBack.text = TEXT_LEVEL + " "+iLevel;
        _oMsgText.text = TEXT_LEVEL + " "+iLevel;

        _oGroup.visible = true;

        createjs.Tween.get(_oGroup).to({alpha:1 }, 500).call(function() {s_oGame.initNextLevel()});
    };
    
    this._onExit = function(){
        var oParent = this;
        _oGroup.off("mousedown",oParent._onExit);
        s_oStage.removeChild(_oGroup);
    };

    this._init(oSpriteBg);
}