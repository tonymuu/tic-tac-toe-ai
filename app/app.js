var tictactoeApp = angular.module('tictactoeApp', []);

tictactoeApp.controller('TictactoeController', function TictactoeController($scope) {
  $scope.error = "";
  // $scope.game = new Game();
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
  };

  // X goes first
  $scope.turn = CellState.X;
  $scope.inProgress = true;
  $scope.level = {
      selected: null,
      available: {
        level0: 'Level 0 - Random Move',
        level1: 'Level 1 - Winning Move',
        level2: 'Level 2 - Winning Move + Loss Prevention'
      }
    };

  var hasWinner = function() {
    for (var i = 0; i < 3; i += 1) {
      // check horizontal
      if ($scope.cells[i][0].state === $scope.cells[i][1].state &&
         $scope.cells[i][1].state === $scope.cells[i][2].state &&
         $scope.cells[i][1].state !== CellState.Empty)
        return $scope.cells[i][0];
      // check vertical
      if ($scope.cells[0][i].state === $scope.cells[1][i].state &&
         $scope.cells[1][i].state === $scope.cells[2][i].state &&
         $scope.cells[1][i].state !== CellState.Empty)
        return $scope.cells[0][i];
    }
    // check two diaganos
    if ($scope.cells[1][1].state === $scope.cells[0][0].state &&
       $scope.cells[1][1].state === $scope.cells[2][2].state &&
       $scope.cells[0][0].state !== CellState.Empty)
      return $scope.cells[1][1];
    if ($scope.cells[1][1].state === $scope.cells[0][2].state &&
       $scope.cells[1][1].state === $scope.cells[2][0].state &&
       $scope.cells[2][0].state !== CellState.Empty) {
      return $scope.cells[1][1];
    }

    for (row of $scope.cells) {
      for (cell of row)
        if (cell.state == CellState.Empty) { return null; console.log("HasEmpty");}
    }

    return "draw";
  };

  $scope.move = function(cell) {
    cell.state = $scope.turn;
    switchTurn();
    var winner = hasWinner();
    if (winner !== null) $scope.inProgress = false;
    else {
      switch($scope.level.selected) {
        case $scope.level.available.level0: takeLevel0Move(); break;
        case $scope.level.available.level1: if (!takeLevel1Move()) takeLevel0Move(); break;
        case $scope.level.available.level2: takeLevel2Move(); break;
        default: $scope.error = "must select something!"
      }
      if (hasWinner() !== null) $scope.inProgress = false;
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
    switchTurn();
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
          switchTurn();
          return true;
        }
      // last two
      if ($scope.cells[i][2].state === $scope.turn &&
        $scope.cells[i][1].state === $scope.cells[i][2].state &&
        $scope.cells[i][0].state === CellState.Empty) {
          takeMove(i, 0);
          switchTurn();
          return true;
        }
      // middle one
      if ($scope.cells[i][0].state === $scope.turn &&
        $scope.cells[i][0].state === $scope.cells[i][2].state &&
        $scope.cells[i][1].state === CellState.Empty) {
          takeMove(i, 1);
          switchTurn();
          return true;
        }

      // check vertical
      // first two
      if ($scope.cells[0][i].state === $scope.turn &&
        $scope.cells[0][i].state === $scope.cells[1][i].state &&
        $scope.cells[2][i].state === CellState.Empty) {
          takeMove(2, i);
          switchTurn();
          return true;
        }
      // last two
      if ($scope.cells[2][i].state === $scope.turn &&
        $scope.cells[1][i].state === $scope.cells[2][i].state &&
        $scope.cells[0][i].state === CellState.Empty) {
          takeMove(0, i);
          switchTurn();
          return true;
        }
      // middle one
      if ($scope.cells[0][i].state === $scope.turn &&
        $scope.cells[0][i].state === $scope.cells[2][i].state &&
        $scope.cells[1][i].state === CellState.Empty) {
          takeMove(1, i);
          switchTurn();
          return true;
        }
    }

    // check two diaganos
    if ($scope.cells[0][0].state === $scope.turn &&
       $scope.cells[1][1].state === $scope.cells[0][0].state &&
       $scope.cells[2][2].state === CellState.Empty) {
         takeMove(2, 2);
         switchTurn();
         return true;
       }

    if ($scope.cells[1][1].state === $scope.turn &&
      $scope.cells[1][1].state === $scope.cells[2][2].state &&
      $scope.cells[0][0].state === CellState.Empty) {
        takeMove(0, 0);
        switchTurn();
        return true;
      }

    if ($scope.cells[0][0].state === $scope.turn &&
       $scope.cells[2][2].state === $scope.cells[0][0].state &&
       $scope.cells[1][1].state === CellState.Empty) {
         takeMove(1, 1);
         switchTurn();
         return true;
       }


    if ($scope.cells[0][2].state === $scope.turn &&
      $scope.cells[1][1].state === $scope.cells[0][2].state &&
      $scope.cells[2][0].state === CellState.Empty) {
        takeMove(2, 0);
        switchTurn();
        return true;
      }

    if ($scope.cells[1][1].state === $scope.turn &&
      $scope.cells[1][1].state === $scope.cells[2][0].state &&
      $scope.cells[0][2].state === CellState.Empty) {
        takeMove(0, 2);
        switchTurn();
        return true;
      }

    if ($scope.cells[0][2].state === $scope.turn &&
      $scope.cells[2][0].state === $scope.cells[0][2].state &&
      $scope.cells[1][1].state === CellState.Empty) {
        takeMove(1, 1);
        switchTurn();
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
          switchTurn();
          return true;
        }
      // last two
      if ($scope.cells[i][2].state !== CellState.Empty &&
        $scope.cells[i][2].state !== $scope.turn &&
        $scope.cells[i][1].state === $scope.cells[i][2].state &&
        $scope.cells[i][0].state === CellState.Empty) {
          takeMove(i, 0);
          switchTurn();
          return true;
        }
      // middle one
      if ($scope.cells[i][0].state !== CellState.Empty &&
        $scope.cells[i][0].state !== $scope.turn &&
        $scope.cells[i][0].state === $scope.cells[i][2].state &&
        $scope.cells[i][1].state === CellState.Empty) {
          takeMove(i, 1);
          switchTurn();
          return true;
        }

      // check vertical
      // first two
      if ($scope.cells[0][i].state !== CellState.Empty &&
        $scope.cells[0][i].state !== $scope.turn &&
        $scope.cells[0][i].state === $scope.cells[1][i].state &&
        $scope.cells[2][i].state === CellState.Empty) {
          takeMove(2, i);
          switchTurn();
          return true;
        }
      // last two
      if ($scope.cells[2][i].state !== CellState.Empty &&
        $scope.cells[2][i].state !== $scope.turn &&
        $scope.cells[1][i].state === $scope.cells[2][i].state &&
        $scope.cells[0][i].state === CellState.Empty) {
          takeMove(0, i);
          switchTurn();
          return true;
        }
      // middle one
      if ($scope.cells[0][i].state !== CellState.Empty &&
        $scope.cells[0][i].state !== $scope.turn &&
        $scope.cells[0][i].state === $scope.cells[2][i].state &&
        $scope.cells[1][i].state === CellState.Empty) {
          takeMove(1, i);
          switchTurn();
          return true;
        }
    }

    // check two diaganos
    if ($scope.cells[0][0].state !== CellState.Empty &&
      $scope.cells[0][0].state !== $scope.turn &&
       $scope.cells[1][1].state === $scope.cells[0][0].state &&
       $scope.cells[2][2].state === CellState.Empty) {
         takeMove(2, 2);
         switchTurn();
         return true;
       }

    if ($scope.cells[1][1].state !== CellState.Empty &&
      $scope.cells[1][1].state !== $scope.turn &&
      $scope.cells[1][1].state === $scope.cells[2][2].state &&
      $scope.cells[0][0].state === CellState.Empty) {
        takeMove(0, 0);
        switchTurn();
        return true;
      }

    if ($scope.cells[0][0].state !== CellState.Empty &&
      $scope.cells[0][0].state !== $scope.turn &&
       $scope.cells[2][2].state === $scope.cells[0][0].state &&
       $scope.cells[1][1].state === CellState.Empty) {
         takeMove(1, 1);
         switchTurn();
         return true;
       }


    if ($scope.cells[0][2].state !== CellState.Empty &&
      $scope.cells[0][2].state !== $scope.turn &&
      $scope.cells[1][1].state === $scope.cells[0][2].state &&
      $scope.cells[2][0].state === CellState.Empty) {
        takeMove(2, 0);
        switchTurn();
        return true;
      }

    if ($scope.cells[1][1].state !== CellState.Empty &&
      $scope.cells[1][1].state !== $scope.turn &&
      $scope.cells[1][1].state === $scope.cells[2][0].state &&
      $scope.cells[0][2].state === CellState.Empty) {
        takeMove(0, 2);
        switchTurn();
        return true;
      }

    if ($scope.cells[0][2].state !== CellState.Empty &&
      $scope.cells[0][2].state !== $scope.turn &&
      $scope.cells[2][0].state === $scope.cells[0][2].state &&
      $scope.cells[1][1].state === CellState.Empty) {
        takeMove(1, 1);
        switchTurn();
        return true;
      }
    return takeLevel0Move();
  };

  var switchTurn = function() {
    $scope.turn = $scope.turn === CellState.X ? CellState.O : CellState.X;
  }

  var takeMove = function(y, x) {
    $scope.cells[y][x].state = $scope.turn;
  }

});

var CellState = {
  X: 'x',
  O: 'o',
  Empty: '.'
}
