var tictactoeApp = angular.module('tictactoeApp', []);

tictactoeApp.controller('TictactoeController', function TictactoeController($scope) {
  $scope.error = "";
  $scope.human = null;
  $scope.win = 0;
  $scope.draw = 0;
  $scope.total = 0;
  // $scope.game = new Game();
  var numberOfSteps = 0;
  var generateEmptyCells = function() {
    var _cells = [];
    for (var i = 0; i < 3; i += 1) {
      var row = [];
      for (var j = 0; j < 3; j += 1) {
        row.push({ state: CellState.Empty });
      }
      _cells.push(row);
    }

    return _cells;
  };
  $scope.cells = generateEmptyCells();

  $scope.restart = function() {
    $scope.inProgress = true;
    $scope.cells = generateEmptyCells();
    $scope.turn = CellState.X;
    numberOfSteps = 0;
    if ($scope.human === CellState.O) aiMove();
  };

  // X goes first
  $scope.turn = CellState.X;
  $scope.inProgress = true;
  $scope.level = {
      available: {
        level0: 'Level 0 - Random Move',
        level1: 'Level 1 - Winning Move',
        level2: 'Level 2 - Winning Move + Loss Prevention',
        level3: 'Level 3 - Perfect Move'
      },
      selected: null
    };

  var hasWinner = function() {
    for (var i = 0; i < 3; i += 1) {
      // check horizontal
      if ($scope.cells[i][0].state === $scope.cells[i][1].state &&
         $scope.cells[i][1].state === $scope.cells[i][2].state &&
         $scope.cells[i][1].state !== CellState.Empty) {
           $scope.inProgress = false;
           return $scope.cells[i][0];
         }
      // check vertical
      if ($scope.cells[0][i].state === $scope.cells[1][i].state &&
         $scope.cells[1][i].state === $scope.cells[2][i].state &&
         $scope.cells[1][i].state !== CellState.Empty) {
           $scope.inProgress = false;
           return $scope.cells[0][i];
         }
    }
    // check two diaganos
    if ($scope.cells[1][1].state === $scope.cells[0][0].state &&
       $scope.cells[1][1].state === $scope.cells[2][2].state &&
       $scope.cells[0][0].state !== CellState.Empty) {
         $scope.inProgress = false;
         return $scope.cells[1][1];
       }
    if ($scope.cells[1][1].state === $scope.cells[0][2].state &&
       $scope.cells[1][1].state === $scope.cells[2][0].state &&
       $scope.cells[2][0].state !== CellState.Empty) {
         $scope.inProgress = false;
         return $scope.cells[1][1];
       }


    for (row of $scope.cells) {
      for (cell of row)
        if (cell.state === CellState.Empty) {
          $scope.inProgress = true;
          return null;
        }
    }

    $scope.inProgress = false;
    return "draw";
  };

  $scope.move = function(cell) {
    cell.state = $scope.turn;
    switchTurn();
    numberOfSteps += 1;
    var winner = hasWinner();
    if (winner !== null) {
      $scope.win += winner.state === $scope.human ? 1 : 0;
      $scope.draw += winner.state === "draw" ? 1 : 0;
      $scope.total += 1;
    }
    else {
      aiMove();
      winner = hasWinner();
      if (winner !== null) {
        $scope.win += winner.state == $scope.human ? 1 : 0;
        $scope.draw += winner.state === "draw" ? 1 : 0;
        $scope.total += 1;
      }
    }
  };

  var aiMove = function() {
    switch($scope.level.selected) {
      case $scope.level.available.level0: takeLevel0Move(); break;
      case $scope.level.available.level1: if (!takeLevel1Move()) takeLevel0Move(); break;
      case $scope.level.available.level2: takeLevel2Move(); break;
      case $scope.level.available.level3: takeLevel3Move(); break;
      default: $scope.error = "must select something!"
    }
  };

  $scope.isEmpty = function(cell) {
    return cell.state === CellState.Empty;
  };

  var takeLevel0Move = function() {
    var x = -1, y = -1;
    do {
      x = Math.floor(Math.random() * 3);
      y = Math.floor(Math.random() * 3);
    } while ($scope.cells[y][x].state !== CellState.Empty);
    takeMove(y, x);
  };

  var takeLevel1Move = function() {
    for (var i = 0; i < 3; i += 1) {
      // check horizontal
      // first two
      if ($scope.cells[i][0].state === $scope.turn &&
        $scope.cells[i][0].state === $scope.cells[i][1].state &&
        $scope.cells[i][2].state === CellState.Empty)
        {
          takeMove(i, 2);
          return true;
        }
      // last two
      if ($scope.cells[i][2].state === $scope.turn &&
        $scope.cells[i][1].state === $scope.cells[i][2].state &&
        $scope.cells[i][0].state === CellState.Empty) {
          takeMove(i, 0);
          return true;
        }
      // middle one
      if ($scope.cells[i][0].state === $scope.turn &&
        $scope.cells[i][0].state === $scope.cells[i][2].state &&
        $scope.cells[i][1].state === CellState.Empty) {
          takeMove(i, 1);
          return true;
        }

      // check vertical
      // first two
      if ($scope.cells[0][i].state === $scope.turn &&
        $scope.cells[0][i].state === $scope.cells[1][i].state &&
        $scope.cells[2][i].state === CellState.Empty) {
          takeMove(2, i);
          return true;
        }
      // last two
      if ($scope.cells[2][i].state === $scope.turn &&
        $scope.cells[1][i].state === $scope.cells[2][i].state &&
        $scope.cells[0][i].state === CellState.Empty) {
          takeMove(0, i);
          return true;
        }
      // middle one
      if ($scope.cells[0][i].state === $scope.turn &&
        $scope.cells[0][i].state === $scope.cells[2][i].state &&
        $scope.cells[1][i].state === CellState.Empty) {
          takeMove(1, i);
          return true;
        }
    }

    // check two diaganos
    if ($scope.cells[0][0].state === $scope.turn &&
       $scope.cells[1][1].state === $scope.cells[0][0].state &&
       $scope.cells[2][2].state === CellState.Empty) {
         takeMove(2, 2);
         return true;
       }

    if ($scope.cells[1][1].state === $scope.turn &&
      $scope.cells[1][1].state === $scope.cells[2][2].state &&
      $scope.cells[0][0].state === CellState.Empty) {
        takeMove(0, 0);
        return true;
      }

    if ($scope.cells[0][0].state === $scope.turn &&
       $scope.cells[2][2].state === $scope.cells[0][0].state &&
       $scope.cells[1][1].state === CellState.Empty) {
         takeMove(1, 1);
         return true;
       }


    if ($scope.cells[0][2].state === $scope.turn &&
      $scope.cells[1][1].state === $scope.cells[0][2].state &&
      $scope.cells[2][0].state === CellState.Empty) {
        takeMove(2, 0);
        return true;
      }

    if ($scope.cells[1][1].state === $scope.turn &&
      $scope.cells[1][1].state === $scope.cells[2][0].state &&
      $scope.cells[0][2].state === CellState.Empty) {
        takeMove(0, 2);
        return true;
      }

    if ($scope.cells[0][2].state === $scope.turn &&
      $scope.cells[2][0].state === $scope.cells[0][2].state &&
      $scope.cells[1][1].state === CellState.Empty) {
        takeMove(1, 1);
        return true;
      }
    return false;
  };

  var takeLevel2Move = function() {
    if (takeLevel1Move()) return true;
    for (var i = 0; i < 3; i += 1) {
      // check horizontal
      // first two
      if ($scope.cells[i][0].state !== CellState.Empty &&
        $scope.cells[i][0].state !== $scope.turn &&
        $scope.cells[i][0].state === $scope.cells[i][1].state &&
        $scope.cells[i][2].state === CellState.Empty)
        {
          takeMove(i, 2);
          return true;
        }
      // last two
      if ($scope.cells[i][2].state !== CellState.Empty &&
        $scope.cells[i][2].state !== $scope.turn &&
        $scope.cells[i][1].state === $scope.cells[i][2].state &&
        $scope.cells[i][0].state === CellState.Empty) {
          takeMove(i, 0);
          return true;
        }
      // middle one
      if ($scope.cells[i][0].state !== CellState.Empty &&
        $scope.cells[i][0].state !== $scope.turn &&
        $scope.cells[i][0].state === $scope.cells[i][2].state &&
        $scope.cells[i][1].state === CellState.Empty) {
          takeMove(i, 1);
          return true;
        }

      // check vertical
      // first two
      if ($scope.cells[0][i].state !== CellState.Empty &&
        $scope.cells[0][i].state !== $scope.turn &&
        $scope.cells[0][i].state === $scope.cells[1][i].state &&
        $scope.cells[2][i].state === CellState.Empty) {
          takeMove(2, i);
          return true;
        }
      // last two
      if ($scope.cells[2][i].state !== CellState.Empty &&
        $scope.cells[2][i].state !== $scope.turn &&
        $scope.cells[1][i].state === $scope.cells[2][i].state &&
        $scope.cells[0][i].state === CellState.Empty) {
          takeMove(0, i);
          return true;
        }
      // middle one
      if ($scope.cells[0][i].state !== CellState.Empty &&
        $scope.cells[0][i].state !== $scope.turn &&
        $scope.cells[0][i].state === $scope.cells[2][i].state &&
        $scope.cells[1][i].state === CellState.Empty) {
          takeMove(1, i);
          return true;
        }
    }

    // check two diaganos
    if ($scope.cells[0][0].state !== CellState.Empty &&
      $scope.cells[0][0].state !== $scope.turn &&
       $scope.cells[1][1].state === $scope.cells[0][0].state &&
       $scope.cells[2][2].state === CellState.Empty) {
         takeMove(2, 2);
         return true;
       }

    if ($scope.cells[1][1].state !== CellState.Empty &&
      $scope.cells[1][1].state !== $scope.turn &&
      $scope.cells[1][1].state === $scope.cells[2][2].state &&
      $scope.cells[0][0].state === CellState.Empty) {
        takeMove(0, 0);
        return true;
      }

    if ($scope.cells[0][0].state !== CellState.Empty &&
      $scope.cells[0][0].state !== $scope.turn &&
       $scope.cells[2][2].state === $scope.cells[0][0].state &&
       $scope.cells[1][1].state === CellState.Empty) {
         takeMove(1, 1);
         return true;
       }


    if ($scope.cells[0][2].state !== CellState.Empty &&
      $scope.cells[0][2].state !== $scope.turn &&
      $scope.cells[1][1].state === $scope.cells[0][2].state &&
      $scope.cells[2][0].state === CellState.Empty) {
        takeMove(2, 0);
        return true;
      }

    if ($scope.cells[1][1].state !== CellState.Empty &&
      $scope.cells[1][1].state !== $scope.turn &&
      $scope.cells[1][1].state === $scope.cells[2][0].state &&
      $scope.cells[0][2].state === CellState.Empty) {
        takeMove(0, 2);
        return true;
      }

    if ($scope.cells[0][2].state !== CellState.Empty &&
      $scope.cells[0][2].state !== $scope.turn &&
      $scope.cells[2][0].state === $scope.cells[0][2].state &&
      $scope.cells[1][1].state === CellState.Empty) {
        takeMove(1, 1);
        return true;
      }
    return takeLevel0Move();
  };

  var takeLevel3Move = function() {
    var moves = [];
    for (var i = 0; i < 3; i += 1) {
      for (var j = 0; j < 3; j += 1) {
        if ($scope.cells[i][j].state === CellState.Empty) {
          takeMove(i, j);
          var score = minimax();
          moves.push(new Move(i, j, score));
          takeMoveBack(i, j);
        }
      }
    }
    var move = moves[0];
    if($scope.turn === CellState.X)
      moves.forEach(function(curr) {
        if (move.minimaxValue < curr.minimaxValue) move = curr;
      });
    else
      moves.forEach(function(curr) {
        if (move.minimaxValue > curr.minimaxValue) move = curr;
      });

    console.log(move);
    takeMove(move.y, move.x);
  }

  var minimax = function() {
    /*
      if game ends, return score
      scan each cell and play if cell is empty, then call this function with the new state
    */
    // if (numberOfSteps > 0) switchTurn();
    if (hasWinner() !== null) return getScore();
    var score;
    if ($scope.turn === CellState.X) score = -1000;
    else score = 1000;
    for (var i = 0; i < 3; i += 1) {
      for (var j = 0; j < 3; j += 1) {
        if ($scope.cells[i][j].state === CellState.Empty) {
          takeMove(i, j);
          var newScore = minimax();
          if ($scope.turn === CellState.X) score = Math.min(score, newScore)
          else score = Math.max(score, newScore)
          takeMoveBack(i, j);
        }
      }
    }
    return score;
  };

  var getScore = function() {
    var winner = hasWinner();
    if (winner !== null) {
      if (winner.state === CellState.X) return (-10 + numberOfSteps);
      else if (winner.state === CellState.O) return (10 - numberOfSteps);
      else return 0;
    }
  }

  var switchTurn = function() {
    $scope.turn = $scope.turn === CellState.X ? CellState.O : CellState.X;
  };

  var takeMove = function(y, x) {
    $scope.cells[y][x].state = $scope.turn;
    hasWinner();
    switchTurn();
    numberOfSteps += 1;
  };

  var takeMoveBack = function(y, x) {
    $scope.cells[y][x].state = CellState.Empty;
    hasWinner();
    switchTurn();
    numberOfSteps -= 1;
  };

});

var CellState = {
  X: 'x',
  O: 'o',
  Empty: '.'
}

var Move = function(x, y, minimaxValue) {
  this.x = x;
  this.y = y;
  this.minimaxValue = minimaxValue;
}
