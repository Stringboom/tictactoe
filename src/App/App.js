import styles from './App.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from "react";

const players = {
  CPU: {
    SYM: "o",
    NAME: "Computer"
  },
  HUMAN: {
    SYM: "x",
    NAME: "You"
  }
}

export default function App() {

  const [board, setBoard] = useState([
    0, 1, 2,
    3, 4, 5,
    6, 7, 8,
  ]);

  const [isCPUNext, setIsCPUNext] = useState(false);
  const [winner, setWinner] = useState(null);

  function place(cell){
    if (isCPUNext) return;
    if (winner) return;
    if(!isNumber(board[cell])) return;
    board[cell] = players?.HUMAN?.SYM;
    setBoard((board) => [...board]);
    checkWinner();
    setIsCPUNext(true);      
  }

  function checkWinner() {

    const combos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [6, 4, 2]
    ]

    for (let combo = 0; combo < combos.length; combo++) {
      
      const row = combos[combo];

      if (row.every((cell) => board[cell] === players?.CPU?.SYM)) {
        setWinner(players?.CPU?.NAME);
        return;
      } else if (row.every((cell) =>  board[cell] === players?.HUMAN?.SYM)) {
        setWinner(players?.HUMAN?.NAME);
        return;
      }
    }

    let boardHasSpace = false;

    board.forEach((cell) => { if(isNumber(cell)) boardHasSpace = true })

    if (!boardHasSpace) {
      setWinner("draw");
      return;
    } 

  }

  useEffect(() => {
    if (winner) return;
    if (isCPUNext) {
      setTimeout(() => {
        cPUPlay();
      }, 200);
    }
  }, [isCPUNext]);

  function cPUPlay() {
    if (winner) return;

    const cPUMove = getCPUTurn();

    board[cPUMove] = players?.CPU?.SYM;

    setBoard((board) => [...board]);

    checkWinner();
    
    setIsCPUNext(false);
  }
  function getCPUTurn() {
    const spot = minimax(board, players?.CPU?.SYM);
    return spot.index;
  }

  function isNumber(pNumber) {
    return pNumber.constructor === Number;
  }

  function emptyIndexies(board){
    const emptyIndexes = [];
    board.forEach((cell, index) => {
        if (isNumber(cell)) {
          emptyIndexes.push(index);
        }
    });
    return emptyIndexes;
  }

  function winning(board, player){
    if (
    (board[0] == player && board[1] == player && board[2] == player) ||
    (board[3] == player && board[4] == player && board[5] == player) ||
    (board[6] == player && board[7] == player && board[8] == player) ||
    (board[0] == player && board[3] == player && board[6] == player) ||
    (board[1] == player && board[4] == player && board[7] == player) ||
    (board[2] == player && board[5] == player && board[8] == player) ||
    (board[0] == player && board[4] == player && board[8] == player) ||
    (board[2] == player && board[4] == player && board[6] == player)
    ) {
    return true;
    } else {
    return false;
    }
   
  }

  function minimax(newBoard, player){
    
    var availSpots = emptyIndexies(newBoard);

    if (winning(newBoard, players?.HUMAN?.SYM)){
       return {score:-10};
    }
    else if (winning(newBoard, players?.CPU?.SYM)){
      return {score:10};
    }
    else if (availSpots.length === 0){
      return {score:0};
    }
  
    var moves = [];

    for (var i = 0; i < availSpots.length; i++){
      var move = {};
      move.index = newBoard[availSpots[i]];
      newBoard[availSpots[i]] = player;

      if (player == players?.CPU?.SYM){
        var result = minimax(newBoard, players?.HUMAN?.SYM);
        move.score = result.score;
      }
      else{
        var result = minimax(newBoard, players?.CPU?.SYM);
        move.score = result.score;
      }
      newBoard[availSpots[i]] = move.index;
      moves.push(move);
    }

    var bestMove;
    if(player === players?.CPU?.SYM){
      var bestScore = -10000;
      for(var i = 0; i < moves.length; i++){
        if(moves[i].score > bestScore){
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }else{

    var bestScore = 10000;
      for(var i = 0; i < moves.length; i++){
        if(moves[i].score < bestScore){
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }

    return moves[bestMove];
  }

  function displayWinner() {
    if (winner === "draw") {
      return "It's a draw!";
    } else if (winner) {
      return `${winner} won!`;
    }
  }

  function displayTurn() {
    if (isCPUNext) {
      return "Computer's turn";
    } else {
      return "Your turn";
    }
  }

  function playAgain() {
    setBoard([
      0, 1, 2,
      3, 4, 5,
      6, 7, 8,
    ]);
    setWinner(null);
    setIsCPUNext(false);
  }

  return (
    <div className={styles.app}>
      <div className={styles.frame}>
        <h1 className={styles.turn}>{!winner && displayTurn()}</h1>
        <div className={styles.container}>
          <div className={styles.col}>
            <span onClick={() => place(0)} className={styles.cell}>
              {(!isNumber(board[0]))? board[0] : ""}
            </span>
            <span onClick={() => place(1)} className={styles.cell}>
              {(!isNumber(board[1]))? board[1] : ""}
            </span>
            <span onClick={() => place(2)} className={styles.cell}>
              {(!isNumber(board[2]))? board[2] : ""}
            </span>
          </div>
          <div className={styles.col}>
            <span onClick={() => place(3)} className={styles.cell}>
              {(!isNumber(board[3]))? board[3] : ""}
            </span>
            <span onClick={() => place(4)} className={styles.cell}>
              {(!isNumber(board[4]))? board[4] : ""}
            </span>
            <span onClick={() => place(5)} className={styles.cell}>
              {(!isNumber(board[5]))? board[5] : ""}
            </span>
          </div>
          <div className={styles.col}>
            <span onClick={() => place(6)} className={styles.cell}>
              {(!isNumber(board[6]))? board[6] : ""}
            </span>
            <span onClick={() => place(7)} className={styles.cell}>
              {(!isNumber(board[7]))? board[7] : ""}
            </span>
            <span onClick={() => place(8)} className={styles.cell}>
              {(!isNumber(board[8]))? board[8] : ""}
            </span>
          </div>
        </div>
        <div className={styles.gameover}>
          {winner && <h1>{displayWinner()}</h1> }
          {winner && (
            <button className={styles.replay} onClick={playAgain}>
            <FontAwesomeIcon icon={faRotateLeft} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

