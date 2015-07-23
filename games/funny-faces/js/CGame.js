function CGame(oInfo){
    var _iState;
    var _iScore;
    var _iNumTweensActive = 0;
    var _iLives;
    var _iElemInGrid;
    var _iCurLevel;
    var _iCurLevelColors;
    var _aElemsInBoard;
    var _aElemToDelete;
    var _aElemToHighlight;
    var _aElemToMove;
    var _aCurMovingElems = new Array();
    var _oElemSpriteSheet;
    var _oEndPanel;
    var _oBg;
    var _oRectBg;
    var _oHurtFade;
    var _oHelpPanel;
    var _oNextLevel;
    var _oInterface;
    
    this._init = function(){
        this.createBoard();
    };
    
    this.unload = function(){
        s_oStage.removeChild(_oBg);
        s_oStage.removeChild(_oRectBg);
        
        for(var i=0;i<BOARD_ROWS;i++){
            for(var j=0;j<BOARD_COLS;j++){
                _aElemsInBoard[i][j].unload();
            }
        }
    };
    
    this.createBoard = function() {
        _aElemsInBoard= new Array();
        var iXPos = BOARD_OFFSET_X;
        var iYPos = BOARD_OFFSET_Y;
        _iState = GAME_STATE_NO_MOVE;
        _iScore = 0;
        _iCurLevel = 1;
        _iElemInGrid = BOARD_ROWS * BOARD_COLS;
        _iCurLevelColors = 2;
        _iLives = NUM_LIVES;
        
        //ATTACH GAME BG
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('game_bg'));
        s_oStage.addChild(_oBg);

        _oRectBg = new createjs.Shape();
        _oRectBg.graphics.beginFill("rgba(0,0,0,0.5)").drawRoundRect(BOARD_OFFSET_X,BOARD_OFFSET_Y,
                                                                        (BOARD_COLS*ELEM_SIZE),(BOARD_ROWS*ELEM_SIZE),10);
        s_oStage.addChild(_oRectBg);

        var k;
        var oAnims ={};
        for(k=0;k<NUM_COLORS;k++){
            oAnims["elem_"+k] = [k,(k+1)];
        }
        oAnims["invisible"] = [NUM_COLORS,NUM_COLORS+1];
		
        var oData = {   
                        images: [s_oSpriteLibrary.getSprite('elems')], 
                        // width, height & registration point of each sprite
                        frames: {width: ELEM_SIZE, height: ELEM_SIZE, regX: 0, regY: 0}, 
                        animations: oAnims
                   };
        
        _oElemSpriteSheet = new createjs.SpriteSheet(oData);
        
        for(var i=0;i<BOARD_ROWS;i++){
            _aElemsInBoard[i] = new Array();
            for(var j=0;j<BOARD_COLS;j++){
                var iRandColor = Math.floor(Math.random()*_iCurLevelColors);
                _aElemsInBoard[i][j] = new CBoardElem(i,j,iXPos,iYPos,iRandColor,_oElemSpriteSheet);
                iXPos += ELEM_SIZE;
            }
            iXPos = BOARD_OFFSET_X;
            iYPos += ELEM_SIZE;
        }
        
        _oInterface = new CInterface(_iCurLevel,NUM_LIVES);

        _oHurtFade = new createjs.Shape();
        _oHurtFade.graphics.beginFill("red").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        _oHurtFade.alpha = 0;
        s_oStage.addChild(_oHurtFade);

        _oHelpPanel = new CHelpPanel(s_oSpriteLibrary.getSprite('bg_help'));
    };
    
    this.initNextLevel = function(){
         _iState = GAME_STATE_NO_MOVE;
         _iElemInGrid = BOARD_ROWS * BOARD_COLS;
         
        if(_iCurLevelColors < NUM_COLORS){
            _iCurLevelColors++;
        }
        
        for(var i=0;i<BOARD_ROWS;i++){
            for(var j=0;j<BOARD_COLS;j++){
                var iRandColor = Math.floor(Math.random()*_iCurLevelColors);
                _aElemsInBoard[i][j].reset(iRandColor);
            }
        }
        _oInterface.refreshLevel(_iCurLevel);
        
    };
    
    this._findSimilarAdjacent = function(iRow,iCol,iCounter,iType,aArray){
        var iNewRow = iRow;
        var iNewCol = iCol;

        do{
            switch (iCounter) {
                case 0:
                        iNewRow = iRow - 1;
                        iCounter++;
                        if (iNewRow < 0) continue;
                        break;
                case 1:
                        iNewRow = iRow + 1;
                        iCounter++;
                        if (iNewRow >= BOARD_ROWS) continue;
                        break;
                case 2:
                        iNewRow = iRow;
                        iNewCol = iCol - 1;
                        iCounter++;
                        if (iNewCol < 0) continue;
                        break;
                case 3:
                        iNewRow = iRow;
                        iNewCol = iCol + 1;
                        iCounter++;
                        if (iNewCol >= BOARD_COLS) continue;
                        break;
            }
            
            if(_aElemsInBoard[iNewRow][iNewCol].getType() === iType && 
                                    this.findElemInArray(_aElemsInBoard[iNewRow][iNewCol],aArray) === false ){
                
                //WE FOUND A SIMILAR ADJACENT ELEM
                aArray.push(_aElemsInBoard[iNewRow][iNewCol]);

                this._findSimilarAdjacent(iNewRow,iNewCol,0,iType,aArray);
            }
            
        }while(iCounter < 4);
    };
    
    this.elemClicked = function(iRow,iCol,iType){
        if(_iState !== GAME_STATE_NO_MOVE){
            return;
        }
        
        if(s_bMobile === false){
            this.elemOut();
        }
        _aElemToDelete = new Array();
        this._findSimilarAdjacent(iRow,iCol,0,iType,_aElemToDelete);
        //REMOVE FROM BOARD ELEM STORED IF MORE THAN 3    
        if(_aElemToDelete.length > 1){           
            _iScore += SCORE_PER_ELEM * (_aElemToDelete.length * _aElemToDelete.length);
            
            _oInterface.refreshScore(_iScore);
            if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
                createjs.Sound.play("matching");
            }
        }else{
            _iLives--;
            _oInterface.refreshLives(_iLives);
            
            if(_iLives === 0){
                this.gameOver();
                return;
            }
            
            this.showHurt();

            _aElemToDelete.push(_aElemsInBoard[iRow][iCol]);
        }
        
        
        for(var i=0;i<_aElemToDelete.length;i++){
                _aElemToDelete[i].remove();
                _iElemInGrid--;
        }

        this.compactGridVertically();     
        this.moveElemsDown(); 
    };

    this.elemOver = function(iRow,iCol,iType){
        if(_iState !== GAME_STATE_NO_MOVE){
            return;
        }
        
        _aElemToHighlight = new Array();
        this._findSimilarAdjacent(iRow,iCol,0,iType,_aElemToHighlight);
        
        for(var i=0;i<_aElemToHighlight.length;i++){
            _aElemToHighlight[i].highlight(true);
        }
    };
    
    this.elemOut = function(){
        for(var i=0;i<_aElemToHighlight.length;i++){
            _aElemToHighlight[i].highlight(false);
        }
    };
    
    this.findElemInArray = function(oElem,aArrayToCheck){
      for(var i=0;i<aArrayToCheck.length;i++){
          if(aArrayToCheck[i] === oElem){
              return true;
          }
      }  
      
      return false;
    };
    
    this.compactGridVertically = function(){
        var aColsChecked = new Array();
        _aElemToMove = new Array();
        _aCurMovingElems = new Array();
        for(var i=(BOARD_ROWS-1);i>-1;i--){
            for(var j=0;j<BOARD_COLS;j++){
                
                if(_aElemsInBoard[i][j].getType() === -1 && this.findElemInArray(j,aColsChecked) === false){
                    this.findElemsToMoveVertically(i,j);
                    aColsChecked.push(j);
                }
            }
        }
    };
    
    this.findElemsToMoveVertically = function(iRow,iCol){
        var iCurRow = iRow;
        var iDist = 0;

        while(iCurRow>-1){     
            if(_aElemsInBoard[iCurRow][iCol].getType() !== -1){
                _aElemToMove.push({row:iCurRow,col:iCol,type:_aElemsInBoard[iCurRow][iCol].getType(),dist:iDist});
                
            }else{
                iDist += ELEM_SIZE;
            }
            iCurRow--;
        }
    };
    
    this.moveElemsDown = function(){
        if(_aElemToMove.length>0){
            _iState = GAME_STATE_MOVE_VERTICAL;
        }else{
            _iState = GAME_STATE_NO_MOVE;
            _aCurMovingElems = new Array();
            this.compactGridHorizontally();
            this.moveElemRight();
            return;
        }
        
        _iNumTweensActive = _aElemToMove.length;
        for(var i=0;i<_aElemToMove.length;i++){
            var iX = BOARD_OFFSET_X + (_aElemToMove[i].col * ELEM_SIZE);
            var iY = BOARD_OFFSET_Y + (_aElemToMove[i].row * ELEM_SIZE);
            var oMovingElem = new CMovingElem(iX,iY,_aElemToMove[i].type,_oElemSpriteSheet);
            _aCurMovingElems.push(oMovingElem);

            var iNewY = iY + _aElemToMove[i].dist;
            
            //UPDATE LOGIC GRID
            _aElemsInBoard[_aElemToMove[i].row][_aElemToMove[i].col].hide();
            var iNewRow = Math.floor((iNewY - BOARD_OFFSET_Y)/ELEM_SIZE);
            var iNewCol = _aElemToMove[i].col;

            oMovingElem.moveDown(iNewY,iNewRow,iNewCol);   
        }
    };
    
    this.compactGridHorizontally = function(){
        _aElemToMove = new Array();
        for(var j=(BOARD_COLS-1);j>-1;j--){
            var bColEmpty = true;
            for(var i=0;i<BOARD_ROWS;i++){
                
                if(_aElemsInBoard[i][j].getType() !== -1){
                    bColEmpty = false;
                    break;
                }
            }
            
            if(bColEmpty){

                _iState = GAME_STATE_MOVE_HORIZONTAL;
                this.findElemsToMoveHorizontally(j);
            }
        }
    };
    
    this.findElemsToMoveHorizontally = function(iCol){        
        for(var i=0;i<BOARD_ROWS;i++){
            for(var j=0;j<iCol;j++){
                if( _aElemsInBoard[i][j].getType() !== -1 ){
                    //CHECK IF THIS ELEM HAS ALREADY ADDED IN LIST TO MOVE. IF SO ADD SOME DISTANCE
                    var iCheck = this.checkElemToMove(i,j);
                    if(iCheck > -1){
                        _aElemToMove[iCheck].dist += ELEM_SIZE;
                    }else{
                        _aElemToMove.push({row:i,col:j,type:_aElemsInBoard[i][j].getType(),dist:ELEM_SIZE});
                    }
                    
                    
                }
            }
        }
    };
    
    this.checkElemToMove = function(iRow,iCol){
        for(var i=0;i<_aElemToMove.length;i++){
            if(_aElemToMove[i].row === iRow && _aElemToMove[i].col === iCol){
                return i;
            }
        }
        
        return -1;
    };
    
    this.moveElemRight = function(){
        if(_aElemToMove.length === 0){
            _iState = GAME_STATE_NO_MOVE;
            _aCurMovingElems = new Array();

            if(_iElemInGrid === 0){
                this.showNextLevel();
            }
            return;
        }
        
        _iNumTweensActive = _aElemToMove.length;
        
        for(var i=0;i<_aElemToMove.length;i++){
            var iX = BOARD_OFFSET_X + (_aElemToMove[i].col * ELEM_SIZE);
            var iY = BOARD_OFFSET_Y + (_aElemToMove[i].row * ELEM_SIZE);
            var oMovingElem = new CMovingElem(iX,iY,_aElemToMove[i].type,_oElemSpriteSheet);
            _aCurMovingElems.push(oMovingElem);

            var iNewX = iX + _aElemToMove[i].dist;
            
            //UPDATE LOGIC GRID
            _aElemsInBoard[_aElemToMove[i].row][_aElemToMove[i].col].hide();
            var iNewRow = _aElemToMove[i].row;
            var iNewCol = Math.floor((iNewX - BOARD_OFFSET_X)/ELEM_SIZE);

            oMovingElem.moveSide(iNewX,iNewRow,iNewCol); 
        }
    };
    
    this.updateElemValue = function(iRow,iCol,iType,oMovingSprite){
        _aElemsInBoard[iRow][iCol].updateType(iType);
        
        s_oStage.removeChild(oMovingSprite);
        
        _iNumTweensActive--;
        if(_iNumTweensActive === 0){ 
            _aCurMovingElems = new Array();
            if(_iState === GAME_STATE_MOVE_VERTICAL){
                _iState = GAME_STATE_NO_MOVE;
                this.compactGridHorizontally();
                this.moveElemRight();
            }else if(_iState === GAME_STATE_MOVE_HORIZONTAL){
                _iState = GAME_STATE_NO_MOVE;

                if(_iElemInGrid === 0){
                        this.showNextLevel();
                }
            }
        }
    };
    
    this.gameOver = function(){   
        _oEndPanel = CEndPanel(s_oSpriteLibrary.getSprite('msg_box'));
        _oEndPanel.show(_iScore);
    };
	
    this.showNextLevel = function(){
        _iCurLevel++;
        _oNextLevel = new CNextLevelPanel(s_oSpriteLibrary.getSprite("msg_box"));
        _oNextLevel.show(_iCurLevel);
    };
    
    this.showHurt = function(){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            createjs.Sound.play("life_lost");
        }
        createjs.Tween.get(_oHurtFade).to({alpha:0.5}, 300).call(function() {this.alpha = 0});
    };
    
    this.onExit = function(){
        _oInterface.unload();
        
        this.unload();
        s_oMain.gotoMenu();
		
	$(s_oMain).trigger("restart");
    };
    
    this.update = function(){
	for(var i=0;i<_aCurMovingElems.length;i++){
            _aCurMovingElems[i].update(SPEED_MOVE);
        }
    };
    
    s_oGame=this;
    
    BOARD_COLS = oInfo.col;
    BOARD_ROWS = oInfo.row;
    SCORE_PER_ELEM = oInfo.score_per_elem;
    SPEED_MOVE = oInfo.speed_move;
    NUM_LIVES = oInfo.num_lives;
	
    this._init();
}

var s_oGame;