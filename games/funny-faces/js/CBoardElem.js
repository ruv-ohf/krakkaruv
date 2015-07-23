function CBoardElem(iRow,iCol,iXPos,iYPos,iType,oSpritesheet){
    var _iRow;
    var _iCol;
    var _iType;
    var _oSprite;
    var _oHighLight;
    var _oGroup;
    
    this._init = function(iRow,iCol,iXPos,iYPos,iType,oSpritesheet){
        _iType = iType;
        _iRow = iRow;
        _iCol = iCol;

        _oSprite = createSprite(oSpritesheet,"elem_"+iType,0,0,ELEM_SIZE,ELEM_SIZE);
        _oSprite.stop();
        _oSprite.x = iXPos;
        _oSprite.y = iYPos;
		
        _oHighLight = createBitmap(s_oSpriteLibrary.getSprite('highlight'));
        _oHighLight.x = iXPos;
        _oHighLight.y = iYPos;
        _oHighLight.visible = false;
        
        _oGroup = new createjs.Container();
        _oGroup.addChild(_oSprite,_oHighLight);
        s_oStage.addChild(_oGroup);
        
        var oParent = this;
        _oGroup.on("pressup",oParent._onElemClick);
        
        if(s_bMobile === false){
            _oGroup.on("mouseover",oParent._onElemOver);
            _oGroup.on("mouseout",oParent._onElemOut);
        }
    };
    
    this.unload = function(){
        var oParent = this;
        _oGroup.off("pressup",oParent._onElemClick);
        
        if(s_bMobile === false){
            _oGroup.off("mouseover",oParent._onElemOver);
            _oGroup.off("mouseout",oParent._onElemOut);
        }
        
        s_oStage.removeChild(_oGroup);
    };
    
    this.reset = function(iType){
        _iType = iType;
        _oSprite.gotoAndStop("elem_"+iType);
        _oSprite.alpha = 1;
        _oSprite.visible = true;
    };
    
    this.hide = function(){
        _oSprite.visible = false;
        _iType = -1;
    };
    
    this.remove = function(){
        _oSprite.alpha = 0;
        _iType = -1;
    };
    
    this.highlight = function(bVisible){
         _oHighLight.visible = bVisible;
    };
    
    this.updateType = function(iType){
        _iType = iType;
        _oSprite.gotoAndStop("elem_"+iType);
        _oSprite.alpha = 1;
        _oSprite.visible = true;
    };
    
    this._onElemClick = function(){
        s_oGame.elemClicked(_iRow,_iCol,_iType);
    };
    
    this._onElemOver = function(){
        s_oGame.elemOver(_iRow,_iCol,_iType);
    };
    
    this._onElemOut = function(){
        s_oGame.elemOut(_iRow,_iCol,_iType);
    };
    
    this.getPos = function(){
        return {row:_iRow,col:_iCol};
    };
    
    this.getRow = function(){
        return _iRow;
    };
    
    this.getCol = function(){
        return _iCol;
    };
    
    this.getType = function(){
        return _iType;
    };
    
    this._init(iRow,iCol,iXPos,iYPos,iType,oSpritesheet);
    
    return this;
}