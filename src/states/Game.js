function GameState(){
  
  // public methods declaration
  this.redraw = function(){};
  this.init = function(resources){};
  
  // private variables
  var _canvas = document.getElementById('canvas');
  var _ctx = canvas.getContext('2d');
  var _res = {};
  var _objects = [];
  var _slot, _spin_btn, _balance_indicator, _bet_indicator, _sym_indicator;
  
  var _balance = 100;
  var _bet = 1;
  var _selected_sym = 1;
  var _is_spin_active = false;
  
  // private methods
  function _dispatchEvents(event){
    for( var i = 0; i < _objects.length; i++ )
      if(_objects[i].type == "button")
        _objects[i].handleEvent(event);
  }
  
  function _onSpinningFinished(sym_index){
    if(_selected_sym == sym_index){
      // win: increase balance, play winning sound
      _balance += sym_index == 1 ? _bet * 7 : _bet * 3;
      _balance_indicator.setColor("#2fd83b");
      _res.win_sound.play();
    }
    else{
      // lose: decrease balance, play losing sound
      _balance = Math.max(_balance - _bet, 0);
      _balance_indicator.setColor("#d8472f");
      
      var lose_sound = _res.lose_sound;
      lose_sound.mozPreservesPitch = false; // allow pitch regulation in firefox
      lose_sound.playbackRate = 0.95 + Math.floor(Math.random() * 20) / 20;
      lose_sound.play();
    }
    
    _bet = Math.min(_bet, _balance);
    _bet_indicator.setText(_bet + "$");
    
    _balance_indicator.setText(_balance + "$");
    setTimeout(function(){ _balance_indicator.setColor("#ffffff") }, 500);
    
    if(_balance > 0){
      
      _spin_btn.setImage(_res.spin);
      _is_spin_active = false;
    }
  }
  
  function _onSpinPressed(){
    if(_is_spin_active) return;
    
    _spin_btn.setImage(_res.spin_inactive);
    _slot.spin(_onSpinningFinished);
    
    _is_spin_active = true;
  }
  
  function _onBetIcrPressed(){
    if(_is_spin_active) return;
    _bet = Math.min(_bet + 1, _balance);
    _bet_indicator.setText(_bet + "$");
    
    var icr_sound = _res.icr_sound.cloneNode();
    icr_sound.volume = 0.6;
    icr_sound.play();
  }
  
  function _onBetDcrPressed(){
    if(_is_spin_active) return;
    _bet = Math.max(_bet - 1, 1);
    _bet_indicator.setText(_bet + "$");
    
    var dcr_sound = _res.dcr_sound.cloneNode();
    dcr_sound.volume = 0.6;
    dcr_sound.play();
  }
  
  function _onSymUpPressed(){
    if(_is_spin_active) return;
    _selected_sym = _selected_sym + 1 <= 6 ? _selected_sym + 1 : 1;
    _sym_indicator.setImage(_res["sym_" + _selected_sym]);
    _res.pluck_sound.cloneNode().play();
  }
  
  function _onSymDownPressed(){
    if(_is_spin_active) return;
    _selected_sym = _selected_sym - 1 >= 1 ? _selected_sym - 1 : 6;
    _sym_indicator.setImage(_res["sym_" + _selected_sym]);
    _res.pluck_sound.cloneNode().play();
  }
  
  // public methods initialization
  this.redraw = function(){
    _ctx.clearRect(0, 0, _canvas.width, _canvas.height);
    for( var i = 0; i < _objects.length; i++ )
      _objects[i].draw();
  }
  
  this.init = function(resources){
    _res = resources;
    
    // create display objects
    var background = new CanvasImage(this, _ctx, _res.background, 0, 0);
    _spin_btn = new CanvasButton(this, _ctx, _res.spin, 824, 218, _onSpinPressed);
    
    var balance_lbl = new CanvasText(this, _ctx, 'Your balance', 670, 135, 28, 'Lobster');
    balance_lbl.setAlignment('center');
    
    _balance_indicator = new CanvasText(this, _ctx, _balance + '$', 670, 185, 28, 'Lobster');
    _balance_indicator.setAlignment('center');
    
    var bet_lbl = new CanvasText(this, _ctx, 'Bet', 670, 285, 28, 'Lobster');
    bet_lbl.setAlignment('center');
    
    _bet_indicator = new CanvasText(this, _ctx, _bet + '$', 670, 335, 28, 'Lobster');
    _bet_indicator.setAlignment('center');
    
    var bet_dcr_btn = new CanvasButton(this, _ctx, _res.minus, 580, 306, _onBetDcrPressed);
    var bet_icr_btn = new CanvasButton(this, _ctx, _res.plus, 722, 306, _onBetIcrPressed);
    
    _sym_indicator = new CanvasImage(this, _ctx, _res.sym_1, 
                                     429 - _res.sym_1.width * 0.5, 
                                     (canvas.height - _res.sym_1.height) * 0.5);
    
    var sym_up = new CanvasButton(this, _ctx, _res.arrow_up, 
                                  429 - _res.arrow_up.width * 0.5, 90, _onSymUpPressed);
    var sym_down = new CanvasButton(this, _ctx, _res.arrow_down, 
                                    429 - _res.arrow_down.width * 0.5, 370, _onSymDownPressed);
    
    _slot = new Slot(this, _ctx, _res, 83, 140);
    
    // add objects to drawing queue
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
    _objects.push(_slot);
    
    // dispatch click event to display objects
    _canvas.addEventListener('click', _dispatchEvents, false);
    
    // start playing audio
    _res.main_song.loop = true;
    _res.main_song.play();
    
    this.redraw();
  }
}