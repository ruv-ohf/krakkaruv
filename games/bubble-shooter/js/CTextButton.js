function CTextButton(iXPos,iYPos,oSprite,szText,szFont,szColor,iFontSize){
    
    var _aCbCompleted;
    var _aCbOwner;
    var _oButton;
    
    this._init =function(iXPos,iYPos,oSprite,szText,szFont,szColor,iFontSize){
        
        _aCbCompleted=new Array();
        _aCbOwner =new Array();

        var oButtonBg = new createjs.Bitmap( oSprite);

        var iStepShadow = Math.ceil(iFontSize/20);

        var oTextBack = new createjs.Text(szText,"bold "+iFontSize+"px "+szFont, "#000000");
        oTextBack.textAlign = "center";
        var oBounds = oTextBack.getBounds();    
        oTextBack.x = oSprite.width/2 + iStepShadow;
        oTextBack.y = Math.floor((oSprite.height)/2) +10 + iStepShadow;
		oTextBack.textBaseline = "alphabetic";
		
        var oText = new createjs.Text(szText,"bold "+iFontSize+"px "+szFont, szColor);
        oText.textAlign = "center";
        var oBounds = oText.getBounds();    
        oText.x = oSprite.width/2;
        oText.y = Math.floor((oSprite.height)/2) +10;
		oText.textBaseline = "alphabetic";
		
        _oButton = new createjs.Container();
        _oButton.x = iXPos;
        _oButton.y = iYPos;
        _oButton.regX = oSprite.width/2;
        _oButton.regY = oSprite.height/2;
        _oButton.addChild(oButtonBg,oTextBack,oText);

        s_oStage.addChild(_oButton);

        this._initListener();
    };
    
    this.unload = function(){
       _oButton.off("mousedown");
       _oButton.off("pressup");
    };
    
    this.setVisible = function(bVisible){
        _oButton.visible = bVisible;
    };
    
    this._initListener = function(){
       oParent = this;

       _oButton.on("mousedown", this.buttonDown);
       _oButton.on("pressup" , this.buttonRelease);      
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
    
    this.buttonRelease = function(){
        _oButton.scaleX = 1;
        _oButton.scaleY = 1;

        if(_aCbCompleted[ON_MOUSE_UP]){
            _aCbCompleted[ON_MOUSE_UP].call(_aCbOwner[ON_MOUSE_UP]);
        }
    };
    
    this.buttonDown = function(){
        _oButton.scaleX = 0.9;
        _oButton.scaleY = 0.9;

       if(_aCbCompleted[ON_MOUSE_DOWN]){
           _aCbCompleted[ON_MOUSE_DOWN].call(_aCbOwner[ON_MOUSE_DOWN]);
       }
    };
    
    this.setPosition = function(iXPos,iYPos){
         _oButton.x = iXPos;
         _oButton.y = iYPos;
    };
    
    this.setX = function(iXPos){
         _oButton.x = iXPos;
    };
    
    this.setY = function(iYPos){
         _oButton.y = iYPos;
    };
    
    this.getButtonImage = function(){
        return _oButton;
    };

    this.getX = function(){
        return _oButton.x;
    };
    
    this.getY = function(){
        return _oButton.y;
    };

    this._init(iXPos,iYPos,oSprite,szText,szFont,szColor,iFontSize);
    
    return this;
    
}