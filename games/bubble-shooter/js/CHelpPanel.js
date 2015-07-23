function CHelpPanel(oSprite){
    var _oText;
    var _oTextBack;
    var _oHelpBg;
    var _oGroup;

    this._init = function(oSprite){
        _oHelpBg = new createjs.Bitmap(oSprite); 

        _oTextBack = new createjs.Text(TEXT_HELP,"bold 40px comic_sans_msregular", "#000000");
        _oTextBack.textAlign = "center";
        _oTextBack.x = CANVAS_WIDTH/2 + 2;
        _oTextBack.y = 370;
		
	_oText = new createjs.Text(TEXT_HELP,"bold 40px comic_sans_msregular", "#ffffff");
        _oText.textAlign = "center";
        _oText.x = CANVAS_WIDTH/2;
        _oText.y = 368;

        _oGroup = new createjs.Container();
        _oGroup.addChild(_oHelpBg,_oTextBack,_oText);
        s_oStage.addChild(_oGroup);
        
        var oParent = this;
        _oGroup.on("pressup",function(){oParent._onExitHelp()});
    };

    this.unload = function(){
        s_oStage.removeChild(_oGroup);

        var oParent = this;
        _oGroup.off("pressup",function(){oParent._onExitHelp()});
    };

    this._onExitHelp = function(){
        this.unload();
        s_oGame.onStartGame();
    };

    this._init(oSprite);

}