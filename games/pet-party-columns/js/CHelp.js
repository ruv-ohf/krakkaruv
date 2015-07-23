function CHelp(oSprite){
    var _oText;
    var _oHelpBg;

    this._init = function(oSprite){
        _oHelpBg = createBitmap(oSprite); 
        s_oStage.addChild(_oHelpBg);

        var oParent = this;
        _oHelpBg.on("pressup",function(){oParent._onExitHelp()});
		
		_oText = new createjs.Text(TEXT_HELP,"bold 38px Arial", "#ffffff");
		_oText.shadow =  new createjs.Shadow("#000000", 2, 2, 2);
        _oText.textAlign = "center";
        _oText.x = CANVAS_WIDTH/2;
        _oText.y = 320;
		_oText.lineWidth = 420;
        s_oStage.addChild(_oText);
    };

    this.unload = function(){
        s_oStage.removeChild(_oHelpBg);
        s_oStage.removeChild(_oText);

        var oParent = this;
        _oHelpBg.off("pressup",function(){oParent._onExitHelp()});
    };

    this._onExitHelp = function(){
        this.unload();

        s_oGame.onExitHelp();
    };

    this._init(oSprite);

}