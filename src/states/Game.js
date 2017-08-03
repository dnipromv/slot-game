function GameState(){
  
  // public methods declaration
  this.redraw = function(){};
  this.init = function(resources){};
  
  // private variables
  var _canvas = document.getElementById('canvas');
  var _ctx = canvas.getContext('2d');
  var _res = {};
  var _objects = [];
  var _spin_btn, _balance_indicator, _bet_indicator, _sym_indicator;
  
  // private methods
  function _dispatchEvents(event){
    for( var i = 0; i < _objects.length; i++ )
      if(_objects[i].type == "button")
        _objects[i].handleEvent(event);
  }
  
  function _onSpinPressed(){
    _spin_btn.setImage(_res.spin_inactive);
  }
  
  
  // public methods initialization
  this.redraw = function(){
    _ctx.clearRect(0, 0, _canvas.width, _canvas.height);
    for( var i = 0; i < _objects.length; i++ )
      _objects[i].draw();
  }
  
  this.init = function(resources){
    _res = resources;
    
    var background = new CanvasImage(this, _ctx, _res.background, 0, 0);
    _spin_btn = new CanvasButton(this, _ctx, _res.spin, 824, 218, _onSpinPressed);
    
    var balance_lbl = new CanvasText(this, _ctx, 'Your balance', 670, 135, 28, 'Lobster');
    balance_lbl.setAlignment('center');
    
    _balance_indicator = new CanvasText(this, _ctx, '100$', 670, 185, 28, 'Lobster');
    _balance_indicator.setAlignment('center');
    
    var bet_lbl = new CanvasText(this, _ctx, 'Bet', 670, 285, 28, 'Lobster');
    bet_lbl.setAlignment('center');
    
    _bet_indicator = new CanvasText(this, _ctx, '1$', 670, 335, 28, 'Lobster');
    _bet_indicator.setAlignment('center');
    
    var bet_dcr_btn = new CanvasButton(this, _ctx, _res.minus, 580, 320);
    var bet_icr_btn = new CanvasButton(this, _ctx, _res.plus, 722, 306);
    
    _sym_indicator = new CanvasImage(this, _ctx, _res.sym_1, 
                                     429 - _res.sym_1.width * 0.5, 
                                     (canvas.height - _res.sym_1.height) * 0.5);
    
    var sym_up = new CanvasButton(this, _ctx, _res.arrow_up, 429 - _res.arrow_up.width * 0.5, 90);
    var sym_down = new CanvasButton(this, _ctx, _res.arrow_down, 429 - _res.arrow_down.width * 0.5, 370);
    
    _objects.push(background);
    _objects.push(_spin_btn);
    _objects.push(balance_lbl);
    _objects.push(_balance_indicator);
    _objects.push(bet_lbl);
    _objects.push(_bet_indicator);
    _objects.push(bet_dcr_btn);
    _objects.push(bet_icr_btn);
    _objects.push(_sym_indicator);
    _objects.push(sym_up);
    _objects.push(sym_down);
    
    // 
    _canvas.addEventListener('click', _dispatchEvents, false);
    
    this.redraw();
  }
}