function CMovingElem(iX,iY,iType,oSpriteSheet){
    var _bUpdateDown;
    var _bUpdateSide;
    var _iNewX;
    var _iNewY;
    var _iType;
    var _iNewRow;
    var _iNewCol;
    var _oSprite;
    var _oAniController = null;
    
    this._init = function(iX,iY,iType,oSpriteSheet){
        _bUpdateDown = false;
        _bUpdateSide = false;
        _iNewX = iX;
        _iNewY = iY;
        _iType = iType;

        _oSprite = createSprite(oSpriteSheet,"elem_"+iType,0,0,ELEM_SIZE,ELEM_SIZE);
        _oSprite.stop();
        _oSprite.x = iX;
        _oSprite.y = iY;
        s_oStage.addChild(_oSprite);
    };
    
    this.moveDown = function(iNewY,iNewRow,iNewCol){
        _iNewY = iNewY;
        _iNewRow = iNewRow;
        _iNewCol = iNewCol;
        
        this.initTween(_oSprite.x,_iNewY);
        _bUpdateDown = true;
    };
    
    this.moveSide = function(iNewX,iNewRow,iNewCol){
        _iNewX = iNewX;
        _iNewRow = iNewRow;
        _iNewCol = iNewCol;
        
        this.initTween(iNewX,_oSprite.y);
        _bUpdateSide = true;
    };
    
    this.initTween = function(iFinalX,iFinalY){
       _oAniController = new CTweenController( { oNode:this, 
                                                 iFinalX : iFinalX,
                                                 iFinalY : iFinalY,
                                                 iDuration : SPEED_MOVE } );

       _oAniController.start();  
    };
    
    this.setY =  function(iNewY){
        _oSprite.y = iNewY;
    };
    
    this.setX =  function(iNewX){
        _oSprite.x = iNewX;
    };
    
    this.getX =  function(){
        return _oSprite.x;
    };
    
    this.getY =  function(){
        return _oSprite.y;
    };
    
    this.update= function(iSpeed){
        if(_bUpdateDown){

            if( _oAniController.updateDown() === false){
                 _bUpdateDown = false;
                 _oSprite.y = _iNewY;
                 s_oGame.updateElemValue(_iNewRow,_iNewCol,_iType,_oSprite);
            }
        }
        
        if(_bUpdateSide){
            if( _oAniController.updateRight() === false){
                 _bUpdateSide = false;
                 _oSprite.x = _iNewX;
                 s_oGame.updateElemValue(_iNewRow,_iNewCol,_iType,_oSprite);
            }
        }
    };
    
    this._init(iX,iY,iType,oSpriteSheet);
}