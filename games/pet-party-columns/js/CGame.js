function CGame(oInfo){
    
    var _iIncreaseSpeed = 0;
    var _aTable=new Array();
    var _aTableBools=new Array();
    var _aTableBlocks=new Array();
    var _iState;
    var _iCurrent1;
    var _iCurrent2;
    var _iCurrent3;
    var _iNext1;
    var _iNext2;
    var _iNext3;
    var _bBreaking = true;
    var _iTimeElaps;
    var _iScore = 0;

    var _oFallingBlock;
    var _oInterface;
    var _oHelpPanel;
    
    this._init = function(){
	if(s_bMobile === false){
            document.onkeyup   = onKeyUp; 
        }
		
        var oBg = createBitmap(s_oSpriteLibrary.getSprite('game_bg'));
        s_oStage.addChild(oBg);

        for(var i=0;i<GRID_COLS;i++){ 
                _aTable[i] = new Array(GRID_ROWS);
                _aTableBools[i] = new Array(GRID_ROWS);
                _aTableBlocks[i] = new Array(GRID_ROWS);
        }
	
        var k;
        var oAnims ={};
        for(k=0;k<NUM_COLORS;k++){
            oAnims["block_"+(k+1)] = [k,(k+1)];
        }
        oAnims["invisible"] = [-1,0];
        
        var oData = {   
                        images: [s_oSpriteLibrary.getSprite('block')], 
                        // width, height & registration point of each sprite
                        frames: {width: GRID_SIZE, height: GRID_SIZE, regX: 0, regY: 0}, 
                        animations: oAnims
                   };
        
        var oBlockSpriteSheet = new createjs.SpriteSheet(oData);

	for(var j=0;j<GRID_ROWS;j++){
            for(var i=0;i<GRID_COLS;i++){
                _aTable[i][j] = BLOCK_EMPTY;
                var oBlockSprite = createSprite(oBlockSpriteSheet, "invisible",0,0,GRID_SIZE,GRID_SIZE);
                oBlockSprite.stop();
                _aTableBlocks[i][j] = oBlockSprite;
                oBlockSprite.x = GRID_OFFSET_X + (i*GRID_SIZE);
                oBlockSprite.y = GRID_OFFSET_Y + (j*GRID_SIZE);
                
                s_oStage.addChild(oBlockSprite);
            }
        }

        do{
            _iNext1 = Math.floor(1+Math.random()*(NUM_COLORS)); 
            _iNext2 = Math.floor(1+Math.random()*(NUM_COLORS));
            _iNext3 = Math.floor(1+Math.random()*(NUM_COLORS));
        }while( (_iNext1 === _iNext2) &&( _iNext1=== _iNext3) && (_iNext2 === _iNext3) );
        
	_oFallingBlock = new CFallingBlock(oBlockSpriteSheet);
        _oInterface = new CInterface(oBlockSpriteSheet);
        
        var oSprite = s_oSpriteLibrary.getSprite('bg_help');
        _oHelpPanel = new CHelp(oSprite);
        
	this.setFallingInfo();
	_iTimeElaps = 0;
	
	_iState=STATE_MOVE;
    };
    
    this.unload = function(){
        _oInterface.unload();       
    };
	
    function onKeyUp(evt) {         
        if(!evt){ 
            var evt = window.event; 
        }  

        switch(evt.keyCode) {  
           // left  
           case 37: s_oGame.shiftLeft();
           break;                    
           // up  
           case 38: s_oGame.releaseButUp(); 
           break;  
           // right  
           case 39: s_oGame.shiftRight();
           break;  
           // down  
           case 40: s_oGame.pressButDown(); 
           break;    
       }  
   }  
    
    this.onExitHelp = function(){
        _bBreaking=false;
    };
    
    this.setFallingInfo = function(){
        _oFallingBlock.setSpeed(BLOCK_SPEED + _iIncreaseSpeed);
        var iX = (Math.floor(GRID_COLS/2))*GRID_SIZE;
	_oFallingBlock.setY(0); 
	_oFallingBlock.setX(GRID_OFFSET_X+iX);
	
	_iCurrent1=_iNext1;
	_iCurrent2=_iNext2;
	_iCurrent3=_iNext3;

        this.refreshFallingBlock();

        do{
            _iNext1 = Math.floor(1+Math.random()*(NUM_COLORS)); 
            _iNext2 = Math.floor(1+Math.random()*(NUM_COLORS));
            _iNext3 = Math.floor(1+Math.random()*(NUM_COLORS));
        }while( (_iNext1 === _iNext2) &&( _iNext1=== _iNext3) && (_iNext2 === _iNext3) );
        
	_oInterface.setNextBlock(_iNext1,_iNext2,_iNext3);
    };

    this.refreshFallingBlock =function(){
        _oFallingBlock.setBlock(_iCurrent1,_iCurrent2,_iCurrent3);
    };

    this.blockDown = function(){
        if(_iTimeElaps>TIME_SHOW_NEW_BLOCK){ 

            var iBlockRow = Math.floor( (_oFallingBlock.getX() - GRID_OFFSET_X)/GRID_SIZE);
            var iBlockCol = Math.floor( (_oFallingBlock.getY() + _oFallingBlock.getSpeed() - GRID_OFFSET_Y)/GRID_SIZE);

            //CHECK WHEN BLOCK REACH MAX BOARD HEIGHT OR TOUCH OTHER BLOCKS
            if( (_oFallingBlock.getY() + _oFallingBlock.getSpeed()) < (GRID_OFFSET_Y+(GRID_ROWS * GRID_SIZE)) && 
                                            (_aTable[iBlockRow][iBlockCol] === BLOCK_EMPTY || _aTable[iBlockRow][iBlockCol] === undefined)){
                                        
                _oInterface.setNextBlock(_iNext1,_iNext2,_iNext3);

                _oFallingBlock.increaseHeight();
            }else{
                if(_oFallingBlock.getY() < GRID_OFFSET_Y + (GRID_SIZE*3)){
                    this.gameOver();
                }else{  
                    _iTimeElaps = 0;

                    this.putBlk(iBlockRow,iBlockCol-1,_iCurrent1);
                    this.putBlk(iBlockRow,iBlockCol-2,_iCurrent2);
                    this.putBlk(iBlockRow,iBlockCol-3,_iCurrent3);

                    this.setFallingInfo(); 
                     
                    _iState = STATE_LINE;   
                }
            }
        }
    };

    this.putBlk = function(iBlockRow,iBlockCol,iValue){
        if(iBlockCol>=0){ 
            _aTable[iBlockRow][iBlockCol] = iValue;
            
            _aTableBlocks[iBlockRow][iBlockCol].gotoAndStop("block_"+iValue);
        }
    };

    this.checkColorMatching = function(){
        var iValue;
        var iNumBlock;
        _bBreaking=false;

        for(var j=0;j<GRID_ROWS;j++){ 
            for(var i=0;i<GRID_COLS;i++){
                _aTableBools[i][j] = false;
            }
        }

        for(j=0;j<GRID_ROWS;j++){
            for(var i1=0;i1<GRID_COLS;i1++){
                if(_aTable[i1][j] !== BLOCK_EMPTY){
                    iValue = _aTable[i1][j];
                    iNumBlock = 0;
                    for(var i2 = i1;i2 < GRID_COLS;i2++){
                        if(_aTable[i2][j] === iValue){
                            iNumBlock++;
                        }else{
                            i2--; 
                            break;
                        }
                    }

                    if(iNumBlock >= BLOCK_LINE){ 
                            _bBreaking = true;
                            if(i2 === GRID_COLS){ 
                                i2--;
                            };

                            for(i=i1;i<=i2;i++){ 
                                _aTableBools[i][j] = true;
                            }
                            _iScore+=(iNumBlock * iNumBlock);
                    }
                    i1=i2;
                }
            }
        }

        for(i=0;i<GRID_COLS;i++){
            for(var j1 = 0;j1 < GRID_ROWS;j1++){
                if(_aTable[i][j1] !== BLOCK_EMPTY){
                    iValue=_aTable[i][j1];
                    iNumBlock = 0;
                    for(var j2=j1;j2<GRID_ROWS;j2++){
                        if(_aTable[i][j2] === iValue){
                            iNumBlock++;
                        }else{
                            j2--;
                            break;
                        }
                    }

                    if(iNumBlock >= BLOCK_LINE){ 
                        _bBreaking=true;
                        if(j2 === GRID_ROWS){
                            j2--;
                        } 
                        for(j=j1;j<=j2;j++){ 
                            _aTableBools[i][j]=true;
                        }
                        _iScore+=(iNumBlock * iNumBlock);
                    }
                    j1=j2;
                }
            }
        }

       
        for(j=0;j<GRID_ROWS-(BLOCK_LINE-1);j++){
            for(i=0;i<GRID_COLS-(BLOCK_LINE-1);i++){
                i2=i;
                j2=j;
                iValue=_aTable[i2][j2];
                if(iValue !== BLOCK_EMPTY){
                    iNumBlock=0;
                    while(i2<GRID_COLS && j2<GRID_ROWS && _aTable[i2][j2] === iValue){ 
                        iNumBlock++;
                        i2++;
                        j2++;
                    }

                    if(iNumBlock >= BLOCK_LINE){ 
                        _bBreaking=true;
                        i2--;
                        j2--;
                        i1=i;
                        j1=j;
                        while(j1<=j2) {
                            _aTableBools[i1++][j1++] = true;
                        };
                        _iScore+=(iNumBlock * iNumBlock)*2;
                    }
                }
            }
        }

       
        for(j=0;j<GRID_ROWS-(BLOCK_LINE-1);j++){
            for(i=GRID_COLS-1;i>=(BLOCK_LINE-1);i--){
                i2=i;
                j2=j;
                iValue=_aTable[i2][j2];
                if(iValue !== BLOCK_EMPTY){
                    iNumBlock = 0;
                    while(i2>=0 && j2<GRID_ROWS && _aTable[i2][j2] === iValue){ 
                        iNumBlock++;
                        i2--;
                        j2++;
                    }

                    if(iNumBlock >= BLOCK_LINE){ 
                        _bBreaking=true;
                        i2++; 
                        j2--;
                        i1=i;
                        j1=j;
                        while(j1<=j2){ 
                            _aTableBools[i1--][j1++] = true;
                        };
                        _iScore+=(iNumBlock * iNumBlock)*2;
                    }
                }
            }
        }

        
        if(_bBreaking){
            if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
                createjs.Sound.play("explosion");
            }
            
            for(j=0;j<GRID_ROWS;j++){
                for(i=0;i<GRID_COLS;i++){
                    if(_aTableBools[i][j]){ 
                        _aTable[i][j] = BLOCK_EMPTY;
                        _aTableBlocks[i][j].gotoAndStop("invisible");
                    }
                 }
             }
             _oInterface.refreshScore(_iScore);
             
             _iIncreaseSpeed = Math.floor(_iScore/100);

             _iState = STATE_FALL; 
             _bBreaking = false;
        }else{ 
            _iState = STATE_MOVE; 
        }
    };

    this.blockFall = function(){
            var bFall = false;

            for(var j=GRID_ROWS-1;j>0;j--){
                for(var i=0;i<GRID_COLS;i++){
                    if(_aTable[i][j] === BLOCK_EMPTY && _aTable[i][j-1] !== BLOCK_EMPTY){
                        bFall = true;
                      
                        var iValue = _aTable[i][j-1]; 
                        _aTable[i][j] = iValue;
                        _aTableBlocks[i][j].gotoAndStop("block_"+iValue);

                        _aTable[i][j-1] = BLOCK_EMPTY;
                        _aTableBlocks[i][j-1].gotoAndStop("invisible");
                    }
                }
            }
            
            if(!bFall){
                _iState = STATE_LINE;
            } 
    };

    this.gameOver = function(){
        _bBreaking = true;
        _oInterface.gameOver(_iScore);
    };
    
    this.shiftLeft = function(){
        if(_iState === STATE_MOVE){
            if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
                createjs.Sound.play("move");
            }
            
            var iBlockRow = Math.floor( (_oFallingBlock.getX() - GRID_OFFSET_X) / GRID_SIZE);
            var jBlockRow = Math.floor( (_oFallingBlock.getY() - GRID_OFFSET_Y) / GRID_SIZE); 
            if(iBlockRow>0 && _oFallingBlock.getX() > 0 && (_aTable[iBlockRow-1][jBlockRow+1] === BLOCK_EMPTY )){
                    _oFallingBlock.setX(_oFallingBlock.getX() - GRID_SIZE);       
            }
        }
    };
    
    this.shiftRight = function(){
        if(_iState === STATE_MOVE){
            if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
                createjs.Sound.play("move");
            }
            var iBlockRow = Math.floor( (_oFallingBlock.getX() - GRID_OFFSET_X)/ GRID_SIZE);
            var jBlockRow = Math.floor( (_oFallingBlock.getY() - GRID_OFFSET_Y) / GRID_SIZE); 
            
            if(_oFallingBlock.getX() < GRID_OFFSET_Y +((GRID_COLS-1) * GRID_SIZE) && (_aTable[iBlockRow+1][jBlockRow+1] === BLOCK_EMPTY )){
                    _oFallingBlock.setX(_oFallingBlock.getX() + GRID_SIZE);
            }
        }
    };
    
    this.pressButDown = function(){
        if(_oFallingBlock.getY() < 100){
            return;
        }
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            createjs.Sound.play("move");
        }
         _oFallingBlock.setSpeed(BLOCK_DOWN_SPEED);    
    };
    
    this.releaseButUp = function(){
        var iTmp =_iCurrent3;
        _iCurrent3 = _iCurrent2;
        _iCurrent2 = _iCurrent1;
        _iCurrent1 = iTmp;

        this.refreshFallingBlock();
    };
    
    this.onExit = function(){
        this.unload();
        s_oMain.gotoMenu();
		
	$(s_oMain).trigger("restart");
    };
    
    this.update = function(){
	if(!_bBreaking){
            _iTimeElaps += s_iTimeElaps;
            
            switch(_iState){
                case STATE_MOVE:
                    this.blockDown();
                    break;
                case STATE_LINE: 
                    this.checkColorMatching();
                    break;
                case STATE_FALL: 
                    this.blockFall();
            }
	}
    };
    
    s_oGame=this;
    
    //THIS A MULTIPLIER FACTOR THAT IS USEFUL IF CANVAS HEIGHT CHANGES. THE REFERENCE HEIGHT IS 480px.
    var iMult = CANVAS_HEIGHT / 480;
    iMult = iMult.toFixed(2);

    GRID_ROWS = oInfo.rows;
    GRID_COLS = oInfo.cols;
    GRID_SIZE = oInfo.cell_size;
    GRID_OFFSET_X = oInfo.offset_x;
    GRID_OFFSET_Y = oInfo.offset_y;
    TIME_SHOW_NEW_BLOCK = oInfo.time_show_block;
    NUM_COLORS = oInfo.num_colors;
    BLOCK_SPEED = oInfo.speed * iMult;
    BLOCK_DOWN_SPEED = oInfo.speed_down * iMult;
    
    this._init();
}

var s_oGame;