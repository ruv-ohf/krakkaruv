function CConfigPanel(){
    var _oText1;
    var _oText1Back;
    var _oText2;
    var _oText2Back;    
    var _oText3;
    var _oText3Back;
    var _oText4;
    var _oText4Back;
    var _oText5;
    var _oText5Back;
    var _oText6;
    var _oText6Back;

    var _oHelpBg;
    var _oGroup;
    var _oParent;
    var _oButHelp;
    var _oButDel;
    var _oButSolve;
    var _oButReset;
    var _oButTime;
    var _oButHint;
    
    var _oHelp1Container;
    var _oHelp2Container;
    var _oHelp3Container;
    var _oHelp4Container;
    var _oHelp5Container;
    var _oHelp6Container;

    this._init = function(){
        s_oGame.pauseTimer(true);
        
        var oButtonX = 750;
        
        var oParent = this;
        _oHelpBg = createBitmap(s_oSpriteLibrary.getSprite('msg_box'));        
        
        _oHelp1Container = new createjs.Container();
        _oHelp1Container.x = 130;
        _oHelp1Container.y = 430;
        s_oStage.addChild(_oHelp1Container);
  
        _oText1 = new createjs.Text(TEXT_GETHINT," 50px blackplotan", "#008df0");
        _oText1.textAlign = "left";
        _oText1.textBaseline = "alphabetic";
        _oText1.lineWidth = 700;                  
        
        _oHelp1Container.addChild(_oText1);
       
        var oSprite = s_oSpriteLibrary.getSprite('but_help_hint');
        _oButHint = new CGfxButton(oButtonX, 0,oSprite,_oHelp1Container);
        _oButHint.addEventListener(ON_MOUSE_UP, this._onHintPress, this); 
       
        
  
        //////////////////////////////////////////////////////////////////
        
        _oHelp2Container = new createjs.Container();
        _oHelp2Container.x = 130;
        _oHelp2Container.y = 630;
        s_oStage.addChild(_oHelp2Container);
  
        _oText2 = new createjs.Text(TEXT_FILL_WITH_NOTE," 50px blackplotan", "#008df0");
        _oText2.textAlign = "left";
        _oText2.textBaseline = "alphabetic";
        _oText2.lineWidth = 700;                    
        
        _oHelp2Container.addChild(_oText2);
        
        var oSprite = s_oSpriteLibrary.getSprite('but_help_note');
        _oButHelp = new CGfxButton(oButtonX, 0,oSprite,_oHelp2Container);
        _oButHelp.addEventListener(ON_MOUSE_UP, this._onHelpPress, this); 
     
         //////////////////////////////////////////////////////////////////
        
        _oHelp3Container = new createjs.Container();
        _oHelp3Container.x = 130;
        _oHelp3Container.y = 830;
        s_oStage.addChild(_oHelp3Container);
  
        _oText3 = new createjs.Text(TEXT_SOLVE," 50px blackplotan", "#008df0");
        _oText3.textAlign = "left";
        _oText3.textBaseline = "alphabetic";
        _oText3.lineWidth = 700;                    
        
        _oHelp3Container.addChild(_oText3);
        
        var oSprite = s_oSpriteLibrary.getSprite('but_solve');
        _oButSolve = new CGfxButton(oButtonX, 0,oSprite,_oHelp3Container);
        _oButSolve.addEventListener(ON_MOUSE_UP, this._onSolvePress, this);
        
         //////////////////////////////////////////////////////////////////
        
        _oHelp4Container = new createjs.Container();
        _oHelp4Container.x = 130;
        _oHelp4Container.y = 1130;
        s_oStage.addChild(_oHelp4Container);
  
        _oText4 = new createjs.Text(TEXT_RESET," 50px blackplotan", "#008df0");
        _oText4.textAlign = "left";
        _oText4.textBaseline = "alphabetic";
        _oText4.lineWidth = 700;                    
        
        _oHelp4Container.addChild(_oText4);
        
        var oSprite = s_oSpriteLibrary.getSprite('but_reset');
        _oButReset = new CGfxButton(oButtonX, 0,oSprite,_oHelp4Container);
        _oButReset.addEventListener(ON_MOUSE_UP, this._onResetPress, this);
        
        //////////////////////////////////////////////////////////////////
        
        _oHelp5Container = new createjs.Container();
        _oHelp5Container.x = 130;
        _oHelp5Container.y = 1330;
        s_oStage.addChild(_oHelp5Container);
  
        _oText5 = new createjs.Text(TEXT_DELETE_ALL_NOTE," 50px blackplotan", "#008df0");
        _oText5.textAlign = "left";
        _oText5.textBaseline = "alphabetic";
        _oText5.lineWidth = 700;                    
        
        _oHelp5Container.addChild(_oText5);
        
        var oSprite = s_oSpriteLibrary.getSprite('but_del_note');
        _oButDel = new CGfxButton(oButtonX, 0,oSprite,_oHelp5Container);
        _oButDel.addEventListener(ON_MOUSE_UP, this._onDelPress, this); 
                
        //////////////////////////////////////////////////////////////////
        
        _oHelp6Container = new createjs.Container();
        _oHelp6Container.x = 130;
        _oHelp6Container.y = 1530;
        s_oStage.addChild(_oHelp6Container);
  
        _oText6 = new createjs.Text(TEXT_SETNOTIME," 50px blackplotan", "#008df0");
        _oText6.textAlign = "left";
        _oText6.textBaseline = "alphabetic";
        _oText6.lineWidth = 700;                       
        
        _oHelp6Container.addChild(_oText6);
        
        var oSprite = s_oSpriteLibrary.getSprite('but_time');
        _oButTime = new CGfxButton(oButtonX, 0,oSprite,_oHelp6Container);
        _oButTime.addEventListener(ON_MOUSE_UP, this._onTimePress, this);
                     
        _oGroup = new createjs.Container();
        _oGroup.addChild(_oHelpBg, _oHelp1Container, _oHelp2Container, _oHelp3Container, _oHelp4Container, _oHelp5Container, _oHelp6Container);
        s_oStage.addChild(_oGroup);     
        
        _oGroup.on("pressup",function(){oParent._onExitHelp();});
        
        
    };

    this.unload = function(){
        s_oStage.removeChild(_oGroup);
        var oParent = this;
        _oGroup.off("pressup",function(){oParent._onExitHelp()});
    };

    this._onHelpPress = function(){
        s_oGame.fillWithNote();
    };
    
    this._onDelPress = function(){
        s_oGame.deleteAllNote();
    };

    this._onSolvePress = function(){
        s_oGame.solveAndWrite();
    };
    
    this._onResetPress = function(){
        s_oGame.resetGame();
    };
    
    this._onTimePress = function(){
        s_oGame.setNoTime();
    };    

    this._onHintPress = function(){
        s_oGame.getHint();
    };

    this._onExitHelp = function(){
        _oParent.unload();
        s_oGame.pauseTimer(false);
    };

    _oParent=this;
    this._init();

}


