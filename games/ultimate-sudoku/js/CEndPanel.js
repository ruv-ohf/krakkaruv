function CEndPanel(oSpriteBg, bNote, bSolve, bTime, iNumHint){
    
    var _aHelpUsed;
    var _aHelp;
    
    var _oBg;
    var _oGroup;    
    var _oMsgText;
    var _oHelpText;
    

    
    this._init = function(oSpriteBg, bNote, bSolve, bTime, iNumHint){
        
        _aHelpUsed = new Array();
        if(bNote){
            _aHelpUsed.push(TEXT_HELP_NOTE);
        }
        if(bSolve){
            _aHelpUsed.push(TEXT_HELP_SOLVE);
        }
        if(bTime){
            _aHelpUsed.push(TEXT_HELP_TIME);
        }
        if(iNumHint > 0){
            
            if(iNumHint > 1){
                _aHelpUsed.push(iNumHint+ TEXT_HELP_HINTS);
            } else {
                _aHelpUsed.push(iNumHint+ TEXT_HELP_HINT);
            }
        }
        
        _oBg = createBitmap(oSpriteBg);
        _oBg.x = 0;
        _oBg.y = 0;

        _oMsgText = new createjs.Text(""," 80px blackplotan", "#008df0");
        _oMsgText.x = CANVAS_WIDTH/2;
        _oMsgText.y = (CANVAS_HEIGHT/2)-462;
        _oMsgText.textAlign = "center";
        _oMsgText.textBaseline = "alphabetic";
        _oMsgText.lineWidth = 700;
        
        _oHelpText = new createjs.Text("","bold 40px Arial", "#008df0");
        _oHelpText.x = CANVAS_WIDTH/2;
        _oHelpText.y = (CANVAS_HEIGHT/2) - 132;
        _oHelpText.textAlign = "center";
        _oHelpText.textBaseline = "alphabetic";
        _oHelpText.lineWidth = 700;
        
        _aHelp = new Array();

        var oPos = {x: 300};
        
        _aHelp[0] = new createjs.Text("","bold 40px Arial", "#008df0");
        _aHelp[0].x = oPos.x;
        _aHelp[0].y = (CANVAS_HEIGHT/2) - 52;
        _aHelp[0].textAlign = "left";
        _aHelp[0].textBaseline = "alphabetic";
        _aHelp[0].lineWidth = 700;
        
        _aHelp[1] = new createjs.Text("","bold 40px Arial", "#008df0");
        _aHelp[1].x = oPos.x;
        _aHelp[1].y = (CANVAS_HEIGHT/2) + 28;
        _aHelp[1].textAlign = "left";
        _aHelp[1].textBaseline = "alphabetic";
        _aHelp[1].lineWidth = 700;
        
        _aHelp[2] = new createjs.Text("","bold 40px Arial", "#008df0");
        _aHelp[2].x = oPos.x;
        _aHelp[2].y = (CANVAS_HEIGHT/2) + 108;
        _aHelp[2].textAlign = "left";
        _aHelp[2].textBaseline = "alphabetic";
        _aHelp[2].lineWidth = 700;
        
        _aHelp[3] = new createjs.Text("","bold 40px Arial", "#008df0");
        _aHelp[3].x = oPos.x;
        _aHelp[3].y = (CANVAS_HEIGHT/2) + 188;
        _aHelp[3].textAlign = "left";
        _aHelp[3].textBaseline = "alphabetic";
        _aHelp[3].lineWidth = 700;

        _oGroup = new createjs.Container();
        _oGroup.alpha = 0;
        _oGroup.visible=false;
        
        _oGroup.addChild(_oBg, _oHelpText, _oMsgText, _aHelp[0], _aHelp[1], _aHelp[2], _aHelp[3]);

        s_oStage.addChild(_oGroup);
    };
    
    this.unload = function(){
        _oGroup.off("mousedown",this._onExit);
    };
    
    this._initListener = function(){
        _oGroup.on("mousedown",this._onExit);
    };
    
    this.show = function(iTime){
	if(DISABLE_SOUND_MOBILE === false || s_bMobile === false ){
	        createjs.Sound.play("game_over");
	}
        
        iTime = formatTime(iTime);
        
        var aModality = new Array();
        aModality[0] = TEXT_EASY;
        aModality[1] = TEXT_MEDIUM;
        aModality[2] = TEXT_EASY;
        
        if(!bTime){
            _oMsgText.text = TEXT_GAMEOVER + aModality[s_iDifficultyMode] + TEXT_SUDOKU + TEXT_IN + iTime;
        } else {
            _oMsgText.text = TEXT_GAMEOVER + aModality[s_iDifficultyMode] + TEXT_SUDOKU;
        }

            if(_aHelpUsed.length === 1){
                _oHelpText.text = TEXT_HELP_USED; 
            } else if(_aHelpUsed.length > 1){
                _oHelpText.text = TEXT_HELPS_USED; 
            }
                
            
            if (_aHelpUsed.length > 0){
                for(var i=0; i<_aHelpUsed.length; i++){
                    _aHelp[i].text = "-"+_aHelpUsed[i];
                }
            }
 
        _oGroup.visible = true;
        
        var oParent = this;
        createjs.Tween.get(_oGroup).to({alpha:1 }, 500).call(function() {oParent._initListener();});
        
        $(s_oMain).trigger("save_score",[s_iDifficultyMode, iTime, bNote, bSolve, bTime, iNumHint]);
    };
    
    this._onExit = function(){
        _oGroup.off("mousedown",this._onExit);
        s_oStage.removeChild(_oGroup);
        
        s_oGame.onExit();
    };
    
    this._init(oSpriteBg, bNote, bSolve, bTime, iNumHint);
    
    return this;
}
