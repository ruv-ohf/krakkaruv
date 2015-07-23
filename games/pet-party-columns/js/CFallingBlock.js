function CFallingBlock(oBlockSpriteSheet){
    var _iSpeed = BLOCK_SPEED;
    var _oFallingBlock;
    var _oBlock1;
    var _oBlock2;
    var _oBlock3;
    
    this._init = function(oBlockSpriteSheet){
        _oFallingBlock = new createjs.Container();
        _oBlock1 = createSprite(oBlockSpriteSheet, "invisible",0,0,GRID_SIZE,GRID_SIZE);
        _oBlock1.y = GRID_SIZE*2;
        _oBlock2 = createSprite(oBlockSpriteSheet, "invisible",0,0,GRID_SIZE,GRID_SIZE);
        _oBlock2.y = GRID_SIZE;
        _oBlock3 = createSprite(oBlockSpriteSheet, "invisible",0,0,GRID_SIZE,GRID_SIZE);
        _oBlock3.y = 0;
        
        _oFallingBlock.addChild(_oBlock1);
        _oFallingBlock.addChild(_oBlock2);
        _oFallingBlock.addChild(_oBlock3);
        
        _oFallingBlock.regY = GRID_SIZE*3;
        
	s_oStage.addChild(_oFallingBlock);
    };
    
    this.setBlock = function(iBlock1,iBlock2,iBlock3){
        _oBlock1.gotoAndStop("block_"+iBlock1);
        _oBlock2.gotoAndStop("block_"+iBlock2);
        _oBlock3.gotoAndStop("block_"+iBlock3);
    };
    
    this.decreaseY = function(iDecreaseValue){
        _oFallingBlock.y -= iDecreaseValue;
    };
    
    this.increaseHeight = function(){
        _oFallingBlock.y += _iSpeed;   
    };
    
    this.setSpeed = function(iNewSpeed){
        _iSpeed = iNewSpeed;
    };
    
    this.setX = function(iNewX){
        _oFallingBlock.x = iNewX;
    };
    
    this.setY = function(iNewY){
        _oFallingBlock.y = iNewY;
    };
    
    this.getX = function(){
        return _oFallingBlock.x;
    };
    
    this.getY = function(){
        return _oFallingBlock.y;
    };
    
    this.getSpeed = function(){
        return _iSpeed;
    };
    
    this._init(oBlockSpriteSheet);
    
    return this;
}