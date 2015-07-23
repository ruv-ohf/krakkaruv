function CHelpPanel(){
    var _oText0;
    var _oText1;
    var _oMessage;

    var _oText0Page2;
    var _oText1Page2;
    var _oText2Page2;
    var _oText3Page2;
    var _oText4Page2;        

    var _oHelpBg;
    var _oHelpBgPage2;
    var _oGroup;
    var _oGroupPage2;
    var _oParent;
    
    var _oArrow;
    var _oArrowPage2;

    this._init = function(){
        var oParent = this;
        _oHelpBg = createBitmap(s_oSpriteLibrary.getSprite('bg_help'));
  
        var oText1Pos = {x: CANVAS_WIDTH/2, y: (CANVAS_HEIGHT/2)-400};          
  
        _oText0 = new createjs.Text(TEXT_HELP0," 140px blackplotan", "#008df0");
        _oText0.x = oText1Pos.x;
        _oText0.y = oText1Pos.y -100;
        _oText0.textAlign = "center";
        _oText0.textBaseline = "alphabetic";
        _oText0.lineWidth = 700; 
  
        _oText1 = new createjs.Text(TEXT_HELP1,"bold 50px Arial", "#008df0");
        _oText1.x = oText1Pos.x;
        _oText1.y = oText1Pos.y;
        _oText1.textAlign = "center";
        _oText1.textBaseline = "alphabetic";
        _oText1.lineWidth = 950;                
        
        _oGroup = new createjs.Container();
        _oGroup.addChild(_oHelpBg, _oText0, _oText1);
        s_oStage.addChild(_oGroup);        
        
        _oGroup.on("pressup",function(){oParent._onExitHelp();});
        
        _oHelpBgPage2 = createBitmap(s_oSpriteLibrary.getSprite('bg_help2'));
  
        if(s_bMobile=== false){
            _oMessage=TEXT_HELP1_PAGE2;
        } else {
            _oMessage=TEXT_HELP1_MOB_PAGE2;
        }
  
        _oText0Page2 = new createjs.Text(TEXT_HELP0_PAGE2," 140px blackplotan", "#008df0");
        _oText0Page2.x = CANVAS_WIDTH*0.5;
        _oText0Page2.y = oText1Pos.y -100;
        _oText0Page2.textAlign = "center";
        _oText0Page2.textBaseline = "alphabetic";
        _oText0Page2.lineWidth = 800;
  
        _oText1Page2 = new createjs.Text(_oMessage,"bold 35px Arial", "#008df0");
        _oText1Page2.x = CANVAS_WIDTH/2;
        _oText1Page2.y = (CANVAS_HEIGHT/2)-432;
        _oText1Page2.textAlign = "center";
        _oText1Page2.lineWidth = 900;
        _oText1Page2.textBaseline = "alphabetic";
  
        _oText2Page2 = new createjs.Text(TEXT_HELP2_PAGE2,"bold 35px Arial", "#008df0");
        _oText2Page2.x = CANVAS_WIDTH/2 -180;
        _oText2Page2.y = (CANVAS_HEIGHT/2) -272;
        _oText2Page2.textAlign = "left";
        _oText2Page2.lineWidth = 600;
        _oText2Page2.textBaseline = "alphabetic";

        _oText3Page2 = new createjs.Text(TEXT_HELP3_PAGE2,"bold 35px Arial", "#008df0");
        _oText3Page2.x = CANVAS_WIDTH/2 -380;
        _oText3Page2.y = (CANVAS_HEIGHT/2) +45;
        _oText3Page2.textAlign = "left";
        _oText3Page2.lineWidth = 600;
        _oText3Page2.textBaseline = "alphabetic";

        _oText4Page2 = new createjs.Text(TEXT_HELP4_PAGE2,"bold 35px Arial", "#008df0");
        _oText4Page2.x = CANVAS_WIDTH/2 -180;
        _oText4Page2.y = (CANVAS_HEIGHT/2) +340;
        _oText4Page2.textAlign = "left";
        _oText4Page2.lineWidth = 600;
        _oText4Page2.textBaseline = "alphabetic";
        
       
        
        _oGroupPage2 = new createjs.Container();
        _oGroupPage2.addChild(_oHelpBgPage2, _oText0Page2,  _oText1Page2, _oText2Page2,  _oText3Page2,  _oText4Page2);//Add more bitmap here
        _oGroupPage2.visible=0;
        s_oStage.addChild(_oGroupPage2);
        
        _oGroupPage2.on("pressup",function(){oParent._onExitHelp()});

        createjs.Tween.get(_oGroupPage2).to({alpha:1}, 700);
        
        _oArrow = createBitmap(s_oSpriteLibrary.getSprite('arrow'));
        _oArrow.x = 740;
        _oArrow.y = 1450 ;
        _oArrow.alpha=0;
        _oArrow.on("click", oParent._changePageTo2);
        s_oStage.addChild(_oArrow);
        
        _oArrowPage2 = createBitmap(s_oSpriteLibrary.getSprite('arrow'));
        _oArrowPage2.scaleX = -1;
        _oArrowPage2.x = 340;
        _oArrowPage2.y = 1450;
        _oArrowPage2.visible=false;
        _oArrowPage2.on("click", oParent._changePageTo1);
        s_oStage.addChild(_oArrowPage2);
        
        createjs.Tween.get(_oArrow).to({alpha:1}, 700);
        
        
    };

    this.unload = function(){
        s_oStage.removeChild(_oGroup, _oGroupPage2, _oArrow, _oArrowPage2);

        var oParent = this;
        _oGroup.off("pressup",function(){oParent._onExitHelp();});
        _oGroupPage2.off("pressup",function(){oParent._onExitHelp();});
    };
    
    this._changePageTo1 = function(){ 
        _oGroupPage2.visible=false;
        _oArrowPage2.visible=false;

        _oGroup.visible=true;
        _oArrow.visible=true;

    };

    this._changePageTo2 = function(){        
        _oGroup.visible=false;
        _oArrow.visible=false;

        _oGroupPage2.visible=true;
        _oArrowPage2.visible=true;
        
    };

    this._onExitHelp = function(){
        _oParent.unload();
        s_oGame._onExitHelp();
    };

    _oParent=this;
    this._init();

}
