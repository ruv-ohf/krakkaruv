function CModeMenu(){
    var _oBg;
    var _oContainerEasy;
    var _oContainerNormal;
    var _oContainerHard;
    var _oTextEasy;
    var _oButEasy;
    var _oTextMedium;
    var _oButMedium;
    var _oTextHard;
    var _oButHard;
    var _oTextTop;
    
    var _oParent;
    
    var _oFade;
    var _oAudioToggle;
    
    this._init = function(){
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_mode_menu'));
        s_oStage.addChild(_oBg);
       
        _oTextTop = new createjs.Text(TEXT_TOP_MODE," 100px blackplotan", "#008df0");
        _oTextTop.x = CANVAS_WIDTH/2;
        _oTextTop.y = 200;
        _oTextTop.textAlign = "center";
        _oTextTop.lineWidth = 800;
        s_oStage.addChild(_oTextTop);
       
       
        var oTablePos = {x: CANVAS_WIDTH/2, y: 300};
       
        _oContainerEasy = new createjs.Container();
        _oContainerEasy.x = oTablePos.x;
        _oContainerEasy.y = oTablePos.y + 50;
        
        _oContainerNormal = new createjs.Container();
        _oContainerNormal.x = oTablePos.x;
        _oContainerNormal.y = oTablePos.y+500;
        
        _oContainerHard = new createjs.Container();
        _oContainerHard.x = oTablePos.x;
        _oContainerHard.y = oTablePos.y +950;
        
        _oTextEasy = new createjs.Text(TEXT_EASY," 50px blackplotan", "#008df0");
	_oTextEasy.textBaseline = "alphabetic";
        _oTextEasy.textAlign = "center";
        _oTextEasy.lineWidth = 400;
        _oContainerEasy.addChild(_oTextEasy);

        var oSprite = s_oSpriteLibrary.getSprite('mod_easy_icon');
        _oButEasy = new CGfxButton(oTablePos.x , oTablePos.y +230,oSprite, s_oStage);
        _oButEasy.addEventListener(ON_MOUSE_UP, this._selectEasy, this);
        
        _oTextMedium = new createjs.Text(TEXT_MEDIUM," 50px blackplotan", "#008df0");
        _oTextMedium.textBaseline = "alphabetic";
        _oTextMedium.textAlign = "center";
        _oTextMedium.lineWidth = 400;
        _oContainerNormal.addChild(_oTextMedium);
     
        var oSprite = s_oSpriteLibrary.getSprite('mod_medium_icon');
        _oButMedium = new CGfxButton(oTablePos.x , oTablePos.y +680,oSprite, s_oStage);
        _oButMedium.addEventListener(ON_MOUSE_UP, this._selectMedium, this);
        
        _oTextHard = new createjs.Text(TEXT_HARD," 50px blackplotan", "#008df0");
        _oTextHard.textBaseline = "alphabetic";
        _oTextHard.textAlign = "center";
        _oTextHard.lineWidth = 400;
        _oContainerHard.addChild(_oTextHard);
        
        var oSprite = s_oSpriteLibrary.getSprite('mod_hard_icon');
        _oButHard = new CGfxButton(oTablePos.x , oTablePos.y +1130,oSprite, s_oStage);
        _oButHard.addEventListener(ON_MOUSE_UP, this._selectHard, this);
        
        s_oStage.addChild(_oContainerEasy, _oContainerNormal, _oContainerHard);

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        
        s_oStage.addChild(_oFade);
        
        createjs.Tween.get(_oFade).to({alpha:0}, 400).call(function(){_oFade.visible = false;});
           
    };

    
    this._selectEasy = function(){
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            createjs.Sound.play("click");
        }
        _oParent.unload();
        s_oMain.gotoGame(0);
    };
    
    
    this._selectMedium = function(){
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            createjs.Sound.play("click");
        }
        _oParent.unload();
        s_oMain.gotoGame(1);
    };

    this._selectHard = function(){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            createjs.Sound.play("click");
        }
        
        _oParent.unload();        
        s_oMain.gotoGame(2);
    };
    
    this.unload = function(){
        s_oStage.removeAllChildren();
        _oBg = null;
    };
    
    this._onAudioToggle = function(){
        createjs.Sound.setMute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    this._onButPlayRelease = function(){
        this.unload();
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            createjs.Sound.play("click");
        }
        
        s_oMain.gotoGame();
    };

    _oParent=this;
    this._init();
}