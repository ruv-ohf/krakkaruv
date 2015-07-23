function CGame(oData){
    var _bUpdate = false;
    var _bVictory;
    var _bGameOver;
    var _bWaitTime;
    var _bLaunch;
    var _bKickBall;
    var _iScore;
    var _iCurLevel;
    var _iAngRotDegree;
    var _iAngRotRadian;
    var _iCombo; 
    var _iBankBonus; 
    var _iBallDim;
    var _iBallDimHalf;		
    var _iCntWaitTime;
    var _iLimitDx;
    var _iPosWall;
    var _iCntLaunch;	
    var _iStepWall;
    var _iCodeCurrentBall;
    var _iCodePreviewBall;
	var _aLevelsData;
    var _aListCheckXAdjacences;
    var _aListCheckYAdjacences;
    var _aOffsetBall;
    var _aBricks = new Array();
    var _aMatId;
    var _aMatBalls;
    var _vStartPosLaunchingBall;
    var _vCurPosLaunchingBall;
    var _vCurDirLaunchingBall;		
    var _vNormalForBounce;
    var _oBallContainer;
    var _oBallSpriteSheet;
    var _oLaunchingBall;
    var _oWallContainer;
    var _oBg;
    var _oHelpPanel;
    var _oInterface;
    var _oEndPanel;
    
    this._init = function(){ 
        _oBg = new createjs.Bitmap(s_oSpriteLibrary.getSprite('bg_game'));
        s_oStage.addChild(_oBg);
        
		var oSprite = s_oSpriteLibrary.getSprite('balls');
		_iBallDim = Math.floor(oSprite.width/NUM_BALL_COLORS);
        
        var oData = {   
                        images: [oSprite], 
                        // width, height & registration point of each sprite
                        frames: {width: _iBallDim, height: oSprite.height, regX: 0, regY: 0}, 
                        animations: {ball_0:[9],ball_1:[0],ball_2:[1],ball_3:[2],ball_4:[3],ball_5:[4],
																		ball_6:[5],ball_7:[6],ball_8:[7],ball_9:[8]}
                    };
        
        _oBallSpriteSheet = new createjs.SpriteSheet(oData);
		
		
        this._initLevel(oSprite);
        
        _oInterface = new CInterface(_oBallSpriteSheet);
        _oInterface.setNextBall(_iCodePreviewBall-1);

        _oHelpPanel = new CHelpPanel(s_oSpriteLibrary.getSprite('bg_help'));
    };
    
    this.unload = function(){
        _bUpdate = false;
        _oInterface.unload();
        
        if(_oEndPanel){
            _oEndPanel.unload();
        }
        
        s_oStage.removeAllChildren();
    };
    
    this._initLevel = function(oSprite){
        _iScore = 0;
        _iCurLevel = 0;		

        _iBallDimHalf = _iBallDim/2;
        var iStepY   = _iBallDim-5;
        BOARD_OFFSET_X = ( CANVAS_WIDTH - (_iBallDim*BOARD_COLS))/2;

        var iStepPairX = _iBallDim/2;	

        _vStartPosLaunchingBall = new CVector2();
        _vCurPosLaunchingBall   = new CVector2();
        _vCurDirLaunchingBall   = new CVector2();		
        
        _vNormalForBounce = new CVector2();

        _iLimitDx = _iBallDim*BOARD_COLS + BOARD_OFFSET_X;

        //*************************************************************
        var iOffCellaY;
        var iOffCellaX;
        _aOffsetBall = new Array();
        for ( var r = 0; r < BOARD_ROWS; r++ ){
            var aoCol = new Array();
            for ( var c = 0; c < BOARD_COLS; c++ ){
                iOffCellaY = BOARD_OFFSET_Y + (r * iStepY);
                iOffCellaX = BOARD_OFFSET_X + (c * _iBallDim);
                if ( r & 0x1 ){ // IF ROW IS UNEVEN, SHIFT THE RECT SOME PIXELS ON THE RIGHT
                        iOffCellaX += iStepPairX;
                }
                aoCol.push( { x:iOffCellaX, y:iOffCellaY } );				
            }
            _aOffsetBall.push( aoCol );
        }
        
        
        OFFSET_Y_GAME_OVER = iOffCellaY;
        iOffCellaY = BOARD_OFFSET_Y + ( (BOARD_ROWS+1) * (iStepY));
        _vStartPosLaunchingBall.set(CANVAS_WIDTH/2,  iOffCellaY);
        
        _oLaunchingBall = new createjs.Sprite(_oBallSpriteSheet,"ball_0");
        _oLaunchingBall.stop();
        _oLaunchingBall.x = _vStartPosLaunchingBall.getX();
        _oLaunchingBall.y = _vStartPosLaunchingBall.getY();
        _oLaunchingBall.regX = Math.floor((oSprite.width/NUM_BALL_COLORS)/2);
        _oLaunchingBall.regY = oSprite.height/2;
        s_oStage.addChild(_oLaunchingBall);

        this._createMatBalls(_oBallSpriteSheet);
        this.resetLevel();
    };
    
    this.resetLevel = function(){
        _bVictory  = false;
        _bGameOver = false;

        _iAngRotDegree = 89;
        _iAngRotRadian = toRadian( 89 );
        _iCombo=1; 
        _iBankBonus=0;
        _iPosWall = 0;
        _iCntWaitTime = 0;
        
        _vNormalForBounce.set( 1,0 );
        _vCurDirLaunchingBall.set( 0,-1);
        
        _bLaunch = false;
        _bWaitTime = false;
        _iCntLaunch  = 0;
		var oSpriteWall = s_oSpriteLibrary.getSprite('wall_tile');
        _iStepWall = oSpriteWall.height;
        
        _aListCheckXAdjacences = new Array(MAX_BALL_ADJACENCY);
        _aListCheckYAdjacences = new Array(MAX_BALL_ADJACENCY);		
        
        for ( var a = 0; a < MAX_BALL_ADJACENCY; a++ ){
            _aListCheckXAdjacences[a] = _aListCheckYAdjacences[a] = -1;	
        }
        
        this._cleanWall();

        this._loadLevel();		
        this._chooseBall();	
        _oLaunchingBall.gotoAndStop("ball_"+(_iCodePreviewBall-1));		
        this._chooseBall();		
        _aBricks = new Array();
        
        if(_oInterface){
            _oInterface.refreshLevelText(_iCurLevel + 1);
        }
        
        _bUpdate = true;
    };
    
    this._createMatBalls = function(oSpriteSheet){
        _aMatId = new Array(BOARD_ROWS);
        _aMatBalls = new Array(BOARD_ROWS);

        for ( var i = 0; i < BOARD_ROWS; i++ ){
            _aMatId[i] = new Array(BOARD_COLS);
            _aMatBalls[i] = new Array(BOARD_COLS);			
        }
        
        _oWallContainer = new createjs.Container();
        s_oStage.addChild(_oWallContainer);
        
        var oSprite = s_oSpriteLibrary.getSprite('ball_explosion');
        var oData = {   
                        images: [oSprite], 
                        // width, height & registration point of each sprite
                        frames: {width: 150, height: 150, regX: 50, regY: 40}, 
                        animations: {explosion:[0,14,"invisible"],invisible:[15]}
                    };
        
        var oExplosionSpriteSheet = new createjs.SpriteSheet(oData);

        _oBallContainer = new createjs.Container();
        for ( var r = 0; r < BOARD_ROWS; r++ ){
            for ( var c = 0; c < BOARD_COLS; c++ ){
                if ( r & 0x1 && c === BOARD_COLS-1){ continue; }

                var iCodeColor = 1;
                _aMatId[r][c]=iCodeColor;				
                var oMc = new CBall(_aOffsetBall[r][c].x,_aOffsetBall[r][c].y,iCodeColor,oSpriteSheet,oExplosionSpriteSheet,_oBallContainer);
                _aMatBalls[r][c] = oMc;	
            }
        }
        
        s_oStage.addChild(_oBallContainer);
    };
    
    this._cleanWall = function(){

        while ( _aBricks.length > 0 ){
            var oBrick = _aBricks.pop();
            _oWallContainer.removeChild(oBrick);
        }
        _aBricks = new Array();
    };
    
    this._loadLevel = function(){
        var szLevel;
        var iVal;

        _bKickBall = false;
		szLevel = _aLevelsData[_iCurLevel];

        var aLev = szLevel.split("a");

        for ( var r = 0; r < BOARD_ROWS; r++ ){
            for ( var c = 0; c < BOARD_COLS; c++ ){
                if(_aMatBalls[r][c] !== undefined){
                    iVal = Number(szLevel.charAt( r*BOARD_COLS+c));
                    _aMatId[r][c] = Number( aLev[r*BOARD_COLS+c] );
                    _aMatBalls[r][c].setInfo(Number(aLev[r*BOARD_COLS+c]));		
                }
            }
        }		
    };
    
    this._chooseBall = function(){		
        _iCodeCurrentBall  = _iCodePreviewBall;

        //BEFORE CHOOSING BALL COLOR, VERIFY WHAT COLORS ARE CURRENTLY IN GRID
        var aColor = new Array();
        for ( var r = 0; r < BOARD_ROWS; r++ ){
            for ( var c = 0; c < BOARD_COLS; c++ ){
                var bFound = false;
                for ( var a = 0; a < aColor.length; a++ ){
                    if ( _aMatId[r][c] === aColor[a] )
                            bFound = true;					
                }
                if ( bFound === false && _aMatId[r][c] !== 1 ){
                    aColor.push( _aMatId[r][c] );
                }
            }
        }
        var iVal = 0;
        var bFound = false;	

        while ( true ){
            iVal = randRange( 2, NUM_BALL_COLORS + 1 );
            bFound = false;
            for ( var a = 0; a < aColor.length; a++ ){
                if ( iVal === aColor[a] ){
                    bFound = true;					
                    break;
                }
            }
            if ( bFound === true )
                break;
        }

        _iCodePreviewBall = iVal;

        if(_oInterface){
            _oInterface.setNextBall(_iCodePreviewBall-1);
        }
    };

    this._gameOver = function(){   
        _bUpdate = false;
        
		if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
			createjs.Sound.play("game_over");
		}
		
        _oEndPanel = CEndPanel(s_oSpriteLibrary.getSprite('msg_box'));
        _oEndPanel.show(_iScore,false);
    };
    
    this._win = function(){
        _bUpdate = false;

        _oEndPanel = CEndPanel(s_oSpriteLibrary.getSprite('msg_box'));
        _oEndPanel.show(_iScore,true);
    };
    
    this.onExit = function(){
        this.unload();
        s_oMain.gotoMenu();
        $(s_oMain).trigger("restart");
    };
    
    this.onStartGame = function(){
        _bUpdate = true;
    };
    
    this.tapScreen = function(iTouchX,iTouchY){
        var vInitDir  = new CVector2();
        vInitDir.set( -1,0);
        var vMouseDir = new CVector2();
        vMouseDir.set ( iTouchX - _vStartPosLaunchingBall.getX(), iTouchY - _vStartPosLaunchingBall.getY() );
        vMouseDir.normalize();
        _iAngRotRadian = angleBetweenVectors( vInitDir, vMouseDir );
        _iAngRotDegree = toDegree( _iAngRotRadian );

        if ( _iAngRotDegree < 5 ){
                _iAngRotDegree = 5;
        }else if ( _iAngRotDegree > 175 ){
                _iAngRotDegree = 175;
        }

        vInitDir.set( -1,0);
        _iAngRotRadian = toRadian( _iAngRotDegree  );
        rotateVector2D( _iAngRotRadian, vInitDir );
        vInitDir.setY( vInitDir.getY() * -1);		
        
		if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
			createjs.Sound.play("launch");
		}
		
        _bKickBall = true;
    };
    
    this._verifyVictory = function(){
        var bRet = true;
        for ( var r = 0; r < BOARD_ROWS; r++ ){
            for ( var c = 0; c < BOARD_COLS; c++ ){
                if ( _aMatId[r][c] > 1 && _aMatId[r][c] < CODE_EXPLODING_BALL )
                        bRet = false;
            }
        }
        return bRet;
    };
    
    this._verifyGameOver = function(){
        var bRet = false;

        for ( var r = 0; r < BOARD_ROWS; r++ ){
            for ( var c = 0; c < BOARD_COLS; c++ ){				
                if (_aMatId[r][c] > 1 && _aMatId[r][c] < CODE_EXPLODING_BALL){
                    if ( _aMatBalls[r][c].getY() >= (OFFSET_Y_GAME_OVER - _iPosWall) ){
                            bRet = true;
                            break;		
                    }
                }
            }
        }

        return bRet; 
    };
    
    this._removeBalls = function(){
        var a = 0;
	var cnt = 0; 
        var flag = false;
        
        //CHECK IF THERE ARE AT LEAST THREE BALLS OF THE SAME COLOR
        while ( a < MAX_BALL_ADJACENCY ){
            if ( _aListCheckXAdjacences[a] !== -1 )
                cnt++;
            if ( cnt > 2 ){
                flag = true;
		break;
            }
            a++;
        }
        
        //IF THERE AREN'T THE RIGHT ADJACENCY, EXIT FROM THIS FUNCTION
        if ( !flag ){
            _iCombo=1; 
            for ( a = 0; a < MAX_BALL_ADJACENCY; a++ )
            _aListCheckXAdjacences[a] = _aListCheckYAdjacences[a] = -1;
            return;
        }
		
        //SECOND LOOP TO CHECK BALL DELETION
        a = 0;
        while ( a < MAX_BALL_ADJACENCY ){
            if ( _aListCheckXAdjacences[a] !== -1 ){
                _aMatId[_aListCheckXAdjacences[a]][_aListCheckYAdjacences[a]] = CODE_EXPLODING_BALL;   
                _aMatBalls[_aListCheckXAdjacences[a]][_aListCheckYAdjacences[a]].destroy();
                _bWaitTime = true;
            }
            a++;
        }    
        
        // EMPTY THE TWO LISTS
        for ( a = 0; a < MAX_BALL_ADJACENCY; a++ ){
            _aListCheckXAdjacences[a] = _aListCheckYAdjacences[a] = -1;
        }
        
		//DELETE ALL BALL ISLAND THAT ARE HANGING IN THE AIR
        this._checkIsland();
	   _iCombo++;
    };
    
    
    this._checkIsland = function() { 
        var r = 0;
        var c = 0;

        var aIsle = new Array(BOARD_ROWS);
        for( r = 0; r < BOARD_ROWS; r++ ){
            aIsle[r] = new Array( BOARD_COLS );
            for ( c = 0; c < BOARD_COLS; c++ ){
                aIsle[r][c] = 0;
            }
        }
        for ( c = 0; c < BOARD_COLS; c++ ){
            this._recursiveIsland( 0, c, aIsle );
        }
        this._markIsland( aIsle );
    };	
    
    this._markIsland = function(aIsle){
        var r = 0;
        var c = 0;		
        for( r = 0; r < BOARD_ROWS; r++ ){
            for ( c = 0; c < BOARD_COLS; c++ ){
                if ( aIsle[r][c] === 0 && (_aMatId[r][c] > 1 && _aMatId[r][c] < CODE_EXPLODING_BALL) ){
                        _aMatId[r][c] = CODE_EXPLODING_ISLE;				
                }
            }
        }
    };
    
    this._recursiveIsland = function( cRig, cCol, aIsle ){
        //IF BALL HAS ALREADY CHECKED OR CELL IS EMPTY, EXIT FROM FUNCTION
        if ( aIsle[cRig][cCol] > 0 || 
            _aMatId[cRig][cCol] === 1 ||
            _aMatId[cRig][cCol] === CODE_EXPLODING_BALL ){
            return;
        }
        aIsle[cRig][cCol] = 1;
        
        //IF EVEN
        if (( cRig & 0x1 ) === 0 ){        
            //CHECKING THE SIX CASES OF ADJACENT BALLS
            if ( cCol+1 < BOARD_COLS )
                this._recursiveIsland(cRig, cCol+1, aIsle);   
          	if ( cCol-1 > -1 )
                this._recursiveIsland(cRig, cCol-1, aIsle);
         	if ( cRig-1 > -1 && cCol-1 > -1 )
                this._recursiveIsland(cRig-1, cCol-1, aIsle);
         	if ( cRig-1 > -1 )            
                this._recursiveIsland(cRig-1, cCol, aIsle);
         	if ( cRig+1 < BOARD_ROWS && cCol-1 > -1 )
                this._recursiveIsland(cRig+1, cCol-1, aIsle);
          	if ( cRig+1 < BOARD_ROWS )
                this._recursiveIsland(cRig+1, cCol, aIsle);             
        }else{
            
            if ( cCol+1 < BOARD_COLS )                
                this._recursiveIsland(cRig, cCol+1, aIsle);   
            if ( cCol-1 > -1 )
                this._recursiveIsland(cRig, cCol-1, aIsle); 
            
            if ( cRig-1 > -1 && cCol+1 < BOARD_COLS )                
                this._recursiveIsland(cRig-1, cCol+1, aIsle ); 
            if ( cRig-1 > -1 )            
                this._recursiveIsland(cRig-1, cCol, aIsle );
            
            if ( cRig+1 < BOARD_ROWS && cCol+1 < BOARD_COLS )                
                this._recursiveIsland(cRig+1, cCol+1, aIsle );
            if ( cRig+1 < BOARD_ROWS )
                this._recursiveIsland(cRig+1, cCol, aIsle );     
        }  
    };
    
    this._checkBallsWithSameColor = function( cRig, cCol, iCode ) {  
        var flag2 = false;
        var a = 0;

        while ( a < MAX_BALL_ADJACENCY ){    
            if ( _aListCheckXAdjacences[a] === cRig && _aListCheckYAdjacences[a] === cCol ){
               flag2 = true;
               break;
           }
           a++;
        }

        if ( flag2 ){
            return;
        }
     
        if ( _aMatId[cRig][cCol] === iCode  ) {
            a = 0;
            var bF = false;
            while ( a < MAX_BALL_ADJACENCY ){
                if ( _aListCheckXAdjacences[a] === -1 ){
                    _aListCheckXAdjacences[a] = cRig;
                    _aListCheckYAdjacences[a] = cCol; 
                    bF = true;
                    break;
                }
                a++;
            }
			
            if ( bF === false ){
                    return;
            }
        }
        else 
            return;
     
        
        if (( cRig & 0x000001 ) === 0 ){        
            
            if ( cCol+1 < BOARD_COLS ){
                this._checkBallsWithSameColor(cRig, cCol+1, iCode); 
            }
            if ( cCol-1 > -1 ){
                this._checkBallsWithSameColor(cRig, cCol-1, iCode);
            }
            if ( cRig-1 > -1 && cCol-1 > -1 ){
                this._checkBallsWithSameColor(cRig-1, cCol-1, iCode);
            }
            if ( cRig-1 > -1 ){
                this._checkBallsWithSameColor(cRig-1, cCol, iCode);
            }
            if ( cRig+1 < BOARD_ROWS && cCol-1 > -1 ){
                this._checkBallsWithSameColor(cRig+1, cCol-1, iCode);
            }
            if ( cRig+1 < BOARD_ROWS ){
                this._checkBallsWithSameColor(cRig+1, cCol, iCode);             
            }
        }else{
            
            if ( cCol+1 < BOARD_COLS ){             
                this._checkBallsWithSameColor(cRig, cCol+1, iCode);   
            }
            if ( cCol-1 > -1 ){
                this._checkBallsWithSameColor(cRig, cCol-1, iCode); 
            }
            
            if ( cRig-1 > -1 && cCol+1 < BOARD_COLS ){
                this._checkBallsWithSameColor(cRig-1, cCol+1, iCode); 
            }
            if ( cRig-1 > -1 ){
                this._checkBallsWithSameColor(cRig-1, cCol, iCode);
            }
            
            if ( cRig+1 < BOARD_ROWS && cCol+1 < BOARD_COLS ){                
                this._checkBallsWithSameColor(cRig+1, cCol+1, iCode);
            }
            if ( cRig+1 < BOARD_ROWS ){
                this._checkBallsWithSameColor(cRig+1, cCol, iCode);     
            }
        }  
    };	
    
    this._attachBall = function( r, c ){
        
		_aMatId[r][c] = _iCodeCurrentBall;		
		_aMatBalls[r][c].setColor(  _iCodeCurrentBall );

		this._checkBallsWithSameColor(r,c, _iCodeCurrentBall);
		this._removeBalls();			
    };
    
    this._checkIfBallHooked = function(){		
        var r1 = new createjs.Rectangle();

        var dimBall2 = _iBallDim*_iBallDim;
        var vTemp1 = new CVector2();
        var vTemp2 = new CVector2();
        var vTemp3 = new CVector2();
        var vTemp4 = new CVector2();		

        r1.height = r1.width = _iBallDim;

        for ( var r = BOARD_ROWS-1; r > -1; r-- ){
            for ( var c = 0; c < BOARD_COLS; c++ ){
                if ( (r & 0x1) && c === BOARD_COLS-1) {continue; }

                r1.x = _aOffsetBall[r][c].x; 
                r1.y = _aOffsetBall[r][c].y + _iPosWall;
                if ( pointInRect( _vCurPosLaunchingBall, r1 ) === true && (_aMatId[r][c] === 1) ){
                    // IF THIS IS THE FIRST ROW, EXIT FROM FUNCTION
                    if ( r === 0 ){
                            this._attachBall(r,c);						
                            return true;			
                    }

                    var av = new Array();
                    if (c>0) {
                            vTemp1.set( _aOffsetBall[r][c-1].x+_iBallDimHalf, _aOffsetBall[r][c-1].y+_iBallDimHalf + _iPosWall);
                            av.push( { v:vTemp1, r:r, c:(c-1) } );
                    }
                    if (c<BOARD_COLS-1) {		
                            vTemp2.set( _aOffsetBall[r][c+1].x+_iBallDimHalf,_aOffsetBall[r][c+1].y+_iBallDimHalf + _iPosWall);
                            av.push( { v:vTemp2, r:r, c:(c+1) } );
                    }
                    vTemp3.set( _aOffsetBall[r-1][c].x+_iBallDimHalf,_aOffsetBall[r-1][c].y+_iBallDimHalf +_iPosWall);
                    av.push( { v:vTemp3, r:(r-1), c:c } );


                    // EVEN ROW
                    if ( (r % 2)===0 && c>0){
                            vTemp4.set( _aOffsetBall[r-1][c-1].x+_iBallDimHalf,_aOffsetBall[r-1][c-1].y+_iBallDimHalf + _iPosWall);
                            av.push( { v:vTemp4, r:(r-1), c:(c-1) } );
                    }else if ( (r % 2)!==0 && c<BOARD_COLS-1) { // riga dispari
                            vTemp4.set( _aOffsetBall[r-1][c+1].x+_iBallDimHalf,_aOffsetBall[r-1][c+1].y+_iBallDimHalf + _iPosWall);
                            av.push( { v:vTemp4, r:(r-1), c:(c+1) } );
                    }

                    for ( var i = 0; i < av.length; i++ ){
                        
                        //BALL DIAMETER IS REDUCED OF 6 PIXEL TO FACILITATE JOINTS
                        if ( (distance2( _vCurPosLaunchingBall, av[i].v) < (dimBall2-(6*6))) && (_aMatId[ av[i].r ][ av[i].c ] > 1) ){
                                this._attachBall(r,c);
                                return true;			
                        }
                    }

                    break;
                }
            }
        }

        return false;
   };
   
   this._removeExplodedBalls = function(){
        var iTmpScore = 0;
        for ( var r = 0; r < BOARD_ROWS; r++ ){
            for ( var c = 0; c < BOARD_COLS; c++ ){
              if ( _aMatId[r][c] === CODE_EXPLODING_BALL ){
                    _aMatId[r][c] = 1;
                    _aMatBalls[r][c].destroy();

                    iTmpScore +=(_iCombo-1)*SCORE_EXPLOSION_BALL;

              }else if ( _aMatId[r][c] === CODE_EXPLODING_ISLE  ){
                        _aMatId[r][c] = 1;
                        _aMatBalls[r][c].destroy();				  
                        iTmpScore += SCORE_FALLEN_BALL;			  
                    }else if ( _aMatId[r][c] === CODE_EXPLODING_BOMB  ){
                            _aMatId[r][c] = 1;
                            _aMatBalls[r][c].destroy();				  
                    }
                }
        }

		if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
			createjs.Sound.play("explosion");
		}
		
        if (iTmpScore > 0) {
			_iScore += iTmpScore;

			if (iTmpScore>400) {
				_oInterface.showCongrats(TEXT_INCREDIBLE); 
			} else if (iTmpScore>300) {
				_oInterface.showCongrats(TEXT_EXCELLENT); 
			} else if (iTmpScore>200) {
				_oInterface.showCongrats(TEXT_VERYGOOD); 
			} else if (iTmpScore>100) {
				_oInterface.showCongrats(TEXT_GOOD); 
			}
                
        }

        _oInterface.refreshScore(_iScore);
        
        _bVictory = this._verifyVictory();
        if ( _bVictory ){
            _bUpdate = false;
            _iCurLevel++;
            
            if(_iCurLevel < NUM_LEVELS){
				if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
					createjs.Sound.play("win");
				}
                _oInterface.showNextLevel(_iCurLevel,_iScore);
            }else{
                this._win();
            }				
        }
    };
    
    this._setEarthquake = function( iVal){        
        var iTime = EARTHQUAKE_TIME - (50*iVal);
        for ( var r = 0; r < BOARD_ROWS; r++ ){
            for ( var c = 0; c < BOARD_COLS; c++ ){				
                if (_aMatId[r][c] > 1 && _aMatId[r][c] < CODE_EXPLODING_BALL){
                    _aMatBalls[r][c].stopTremble();
                    if(iVal > 0){
                        _aMatBalls[r][c].tremble(5,iTime);
                    }
                }
            }
        }
   };
   
   this._updateWallPosition = function(){
        var oSpriteWall = s_oSpriteLibrary.getSprite('wall_tile');
        
        for ( var i = 0; i < BOARD_COLS; i++ ){
                var oWallBitmap = new createjs.Bitmap(oSpriteWall);	

                oWallBitmap.x = i*_iBallDim + BOARD_OFFSET_X;
                oWallBitmap.y = BOARD_OFFSET_Y + _iPosWall-_iStepWall;
                _oWallContainer.addChild(oWallBitmap);
                       
                _aBricks.push( oWallBitmap );
        }	
        
    };
    
    this._updateMatch = function(){			
        if ( _bVictory === true ) {
            return;
        }				

        if ( _bLaunch === false ){
                _vCurDirLaunchingBall.set( -1,0);
                rotateVector2D( _iAngRotRadian, _vCurDirLaunchingBall );
                _vCurDirLaunchingBall.normalize();

                if (  _bKickBall === true ){
                    _bKickBall = false;
                    _bLaunch = true; 
                    _vCurPosLaunchingBall.setV( _vStartPosLaunchingBall );

                    _vCurDirLaunchingBall.setY(_vCurDirLaunchingBall.getY() * -1);
                    _vCurDirLaunchingBall.scalarProduct( BALL_SPEED );
                }
        }else{
                var iTimeForUpdating = TIME_FOR_UPDATING_PHYSICS;
                var iElapsed = s_iTimeElaps;
                iElapsed += s_iTimeElaps;
                var iPhysicsTimes = Math.floor(iElapsed/iTimeForUpdating);
                var iMaxPhysicsUpdating = 50;
                if ( iPhysicsTimes > iMaxPhysicsUpdating ){
				
                        iPhysicsTimes = iMaxPhysicsUpdating;
                }		
				
                //PHYSIC UPDATE
                for ( var i = 0; i < iPhysicsTimes; i++ ){
                    if ( this._updatePhysics() === true ){
                        break;
                    }
                }
		
        }
    };
    
    this._updatePhysics = function() {
        _vCurPosLaunchingBall.add( _vCurDirLaunchingBall ); 
        _oLaunchingBall.x = _vCurPosLaunchingBall.getX();
        _oLaunchingBall.y = _vCurPosLaunchingBall.getY(); 	

        if ( ( _oLaunchingBall.x <= BOARD_OFFSET_X+_iBallDimHalf ) || ( _oLaunchingBall.x >= _iLimitDx-_iBallDimHalf-2 ) ){
            _iBankBonus++; 
            _vCurDirLaunchingBall = reflectVectorV2( _vCurDirLaunchingBall, _vNormalForBounce);
        }

        //IF BALL HAS BEEN HOOKED, GERT READY FOR THE NEXT LAUNCH
        if ( this._checkIfBallHooked() ){
                _bLaunch = false;

                _oLaunchingBall.x = _vStartPosLaunchingBall.getX();
                _oLaunchingBall.y = _vStartPosLaunchingBall.getY();
                _oLaunchingBall.gotoAndStop("ball_" + (_iCodePreviewBall-1));			

                _iCntLaunch++;		
                
                if ( _iCntLaunch < NUM_LAUNCH_FOR_EARTHQUAKE ){
                    if ( _iCntLaunch === NUM_LAUNCH_FOR_EARTHQUAKE-2 ){
                            this._setEarthquake( 1 );
                    }else if ( _iCntLaunch === NUM_LAUNCH_FOR_EARTHQUAKE-1 ){
                            this._setEarthquake( 2 );
                    }else{
                            this._setEarthquake( 0 );
                    }
                }
                
                if ( _iCntLaunch === NUM_LAUNCH_FOR_EARTHQUAKE ){				
                        _iPosWall += _iStepWall;
                        _iCntLaunch = 0;
                        this._setEarthquake( 0 );
                        this._updateWallPosition();
                        this._updateMatPosition();
                }
            
                if(this._verifyVictory() === false){
                    _bGameOver = this._verifyGameOver();
                    if ( _bGameOver === true){		
                        this._gameOver();
                    }else{
                        this._chooseBall();
                    }
                }
                return true;
        }else{
                return false;
        }
    };
    
    this._updateMatPosition = function(){
        for ( var r = 0; r < BOARD_ROWS; r++ ){
            for ( var c = 0; c < BOARD_COLS; c++ ){
                if ( (r & 0x1) && c === BOARD_COLS-1) {continue; }
                    _aMatBalls[r][c].increaseY(_iStepWall);
            }
        }
    };

    this.update = function(){
        if(_bUpdate === false){
            return;
        }
        
        if ( _bWaitTime === false ){			
            this._updateMatch();
        }else{
            if ( _iCntWaitTime < 50 )
                _iCntWaitTime += s_iTimeElaps;
            else {
                _iCntWaitTime = 0;
                _bWaitTime = false;
                this._removeExplodedBalls();  
            }
        }
		
    };
    
    s_oGame=this;

	BOARD_OFFSET_Y = oData.board_y;
	BALL_SPEED = oData.ball_speed;
	NUM_BALL_COLORS = oData.ball_colors;
	NUM_LAUNCH_FOR_EARTHQUAKE = oData.shot_for_ceiling;
	SCORE_EXPLOSION_BALL = oData.score_explosion; 
	SCORE_FALLEN_BALL = oData.score_fall;
	_aLevelsData = new Array();
	_aLevelsData = oData.levels;
	NUM_LEVELS = _aLevelsData.length;
	
    this._init();
}

var s_oGame;