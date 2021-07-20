let computerTurn;
let computerChar='';
let humanChar='';
var xscore,oscore;
const winningMessage = document.getElementById('winning-message');
const winningMessageTextElement = document.querySelector('[data-winning-message-text]');
var scores;

const choosexo = document.getElementById('choosexo');
const cellElements = document.querySelectorAll('[data-cell]');
const parentElement = document.getElementById('parent');
const humanScoreBoard=document.getElementById('humanscore');
const compScoreBoard=document.getElementById('compscore');



const indexList=[[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2]]

var compscore=0;
var humanscore=0;

function choosesx(){
    computerTurn=false;
    computerChar='O';
    humanChar='X';
    // computerChar='X';
    // humanChar='O';


    scores = {
      X: -10,
      O: 10,
      tie: 0
    };
    // oscore=10;
    // xscore=-10;
    choosexo.classList.remove('show');
    console.log('hc', humanChar);
    console.log('cc',computerChar);
    start()

}

function chooseso(){
    computerTurn=true;
    computerChar='X';
    humanChar='O';
    // oscore=-10;
    // xscore=10;

    scores = {
      X: 10,
      O: -10,
      tie: 0
    };

    choosexo.classList.remove('show');
    console.log('hc', humanChar);
    console.log('cc',computerChar);
    start()
}



let board = [
    [' ', ' ', ' '],
    [' ', ' ', ' '],
    [' ', ' ', ' ']
  ];



function selection(){
    winningMessage.classList.remove('show');
    choosexo.classList.add('show');
}
  
selection()

function start(){

  humanScoreBoard.innerHTML=humanscore;
  compScoreBoard.innerHTML=compscore;

    for (let i=0;i<3;i++){
      for (let j=0;j<3;j++){
        board[i][j]=" ";
      }
    }

    cellElements.forEach(cell => {
        //cell.classList.remove(x)
        //cell.classList.remove(circle)
        cell.innerHTML=null
        cell.classList.remove('empty')
        cell.classList.add('empty')
        cell.removeEventListener('click',handleClick)
        cell.addEventListener('click',handleClick,{once:true})
    })

    if(computerTurn==true){

        compTurn()
    }
}

function handleClick(e){
    const cell = e.target
    const markString = computerTurn? computerChar : humanChar;
    var n = Array.from(cell.parentNode.children).indexOf(cell);

    placeMark(cell,markString,n)
    swapTurns()
}

function swapTurns(){
    computerTurn=!computerTurn;
    if(computerTurn){
        compTurn();
    }
}

function placeMark(cell, markString,n){
    //get index number of cell then the indices of matrix from the array 
    console.log(markString)
    console.log(n)
    cell.innerHTML = markString;
    console.log('130')
    cell.removeEventListener('click',handleClick)
    cell.style.cursor='default'
    var row=indexList[n][0];
    var col=indexList[n][1];
    // console.log(row,col)
    board[row][col]=markString;
    checkEnd()
    console.log('humanturnboard',board)
}

function compTurn(){
  console.log(scores)
    bestMove()
    console.log('computerturn',board)
    swapTurns()
    
}

function equals3(a, b, c) {
    return a == b && b == c && a != ' ';
  }

function checkWinner() {
    let winner = null;
    // horizontal
    for (let i = 0; i < 3; i++) {
      if (equals3(board[i][0], board[i][1], board[i][2])) {
        winner = board[i][0];
        
      }
    }
    // Vertical
    for (let i = 0; i < 3; i++) {
      if (equals3(board[0][i], board[1][i], board[2][i])) {
        winner = board[0][i];
      }
    }
    // Diagonal
    if (equals3(board[0][0], board[1][1], board[2][2])) {
      winner = board[0][0];
    }
    if (equals3(board[2][0], board[1][1], board[0][2])) {
      winner = board[2][0];
    }
  
    let openSpots = 0;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] == ' ') {
          openSpots++;
        }
      }
    }
  
    if (winner == null && openSpots == 0) {
      return 'tie';  
    } else {
      return winner;
    }
  }


function checkEnd(){

  var winner=checkWinner()
    if(winner===computerChar){
      compscore+=1;
      winningMessage.classList.add('show');
      winningMessageTextElement.innerHTML='Computer wins!';
    }
    else if(winner===humanChar){
      humanscore+=1;
      winningMessage.classList.add('show');
      winningMessageTextElement.innerHTML='You win!'
    }

    else if(winner=='tie'){
      winningMessage.classList.add('show');
      winningMessageTextElement.innerHTML='Draw!';
    }
}

// let currentPlayer = humanChar;

function bestMove() {
  // AI to make its turn
  let bestScore = -Infinity;
  let move;
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      // Is the spot available?
      if (board[i][j] == ' ') {
        console.log('315',i,j);
        board[i][j] = computerChar;
        let score = minimax(board, 0, false);
        console.log('bestscore',bestScore)
        board[i][j] = ' ';
        if (score > bestScore) {
          bestScore = score;
          move = { i, j };
        }
      }
    }
  }

  board[move.i][move.j] = computerChar;
  let index=(3*(move.i))+(move.j);
  //select child
  var child=cellElements[index]
  setTimeout(function() {
    placeMark(child,computerChar,index)
  }, 30);
  ///placeMark(child,computerChar,index)
  
}

function minimax(board, depth, isMaximizing) {


  let result = checkWinner();
  if (result !== null) {  //open spots=0
    return scores[result];
  }

  //computer
  if (isMaximizing) {         
    let bestScore = -Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // Is the spot available?
        if (board[i][j] == ' ') {
          board[i][j] = computerChar;
          let score = minimax(board, depth + 1, false);
          board[i][j] = ' ';
          bestScore = max(score, bestScore);
        }
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // Is the spot available?
        if (board[i][j] == ' ') {
          board[i][j] = humanChar;
          let score = minimax(board, depth + 1, true);
          board[i][j] = ' ';
          bestScore = min(score, bestScore);
        }
      }
    }
    return bestScore;
  }
}


function min(a,b){
  return a<b?a:b;
}

function max(a,b){
  return a>b?a:b;
}