

/*
 * 
 * {
 *   oNode
 *   iFinalX
 *   iFinalY
 *   cbEaseX
 *   cbEaseY
 *   iDuration
 *   
 * }
 * 
 */

function CTweenController( oConfig ){
    
    var _iCntTime = 0;
    var _oConfig  = oConfig;
    
    var _iStartX = oConfig.oNode.getX();
    var _iStartY = oConfig.oNode.getY();
    
    var _bStart = false;
    
   this.tweenValue = function( fStart, fEnd, fLerp ){
    return fStart + fLerp *( fEnd-fStart);     
  };
    
    this.start = function(){
        _bStart = true;
    };
    
    this.easeLinear = function(t, b, c, d) {
            return c*t/d + b;
    };
    
    this.easeInCubic = function(t, b, c, d) {
	var tc=(t/=d)*t*t;
	return b+c*(tc);
    };


    this.easeBackInQuart =  function(t, b, c, d) {
	var ts=(t/=d)*t;
	var tc=ts*t;
	return b+c*(2*ts*ts + 2*tc + -3*ts);
    };

    
    this.updateDown = function(){
        
        if (_bStart === false){
            return false;
        }
        
        var  fLerpY;
        
        _iCntTime += s_iTimeElaps;
        
        if ( _iCntTime >= _oConfig.iDuration ){
            _iCntTime = _oConfig.iDuration;
            _bStart = false;
        }

        fLerpY = this.easeInCubic( _iCntTime, 0 ,1, _oConfig.iDuration);

        oConfig.oNode.setY(this.tweenValue( _iStartY, oConfig.iFinalY, fLerpY));
        
        return true;
    };
    
    this.updateRight = function(){
        
        if (_bStart === false){
            return false;
        }
        
        var  fLerpX;
        
        _iCntTime += s_iTimeElaps;
        
        if ( _iCntTime >= _oConfig.iDuration ){
            _iCntTime = _oConfig.iDuration;
            _bStart = false;
        }

        fLerpX = this.easeInCubic( _iCntTime, 0 ,1, _oConfig.iDuration);

        oConfig.oNode.setX(this.tweenValue( _iStartX, oConfig.iFinalX, fLerpX));
        
        return true;
    };
    
}