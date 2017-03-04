var Game = function(player1, player2) {
  // player with the X goes first
  this.turn = player1.side === CellState.X ? player1 : player2;
  this.inProgress = true;
  this.cells = generateEmptyCells();
  this.restart = function() {
    this.inProgress = true;
    this.cells = generateEmptyCells();
  }


}

var player = function(side, isHuman) {
  this.side = side;
  this.isHuman = isHuman;
  this.move = function() {

  }
}

var CellState = {
  X: 'x',
  O: 'o',
  Empty: '.'
}
