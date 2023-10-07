/*----- constants -----*/

    //letters: object containing the tiles/letters, point value, and number available
    const letters = { 
        A: {count: 9, points: 1},
        B: {count: 2, points: 3},
        C: {count: 2, points: 3},
        D: {count: 4, points: 2},
        E: {count: 12, points: 1},
        F: {count: 2, points: 4},
        G: {count: 3, points: 2},
        H: {count: 2, points: 4},
        I: {count: 9, points: 1},
        J: {count: 1, points: 8},
        K: {count: 1, points: 5},
        L: {count: 4, points: 1},
        M: {count: 2, points: 3},
        N: {count: 6, points: 1},
        O: {count: 8, points: 1},
        P: {count: 2, points: 3},
        Q: {count: 1, points: 10},
        R: {count: 6, points: 1},
        S: {count: 4, points: 1},
        T: {count: 6, points: 1},
        U: {count: 4, points: 1},
        V: {count: 2, points: 4},
        W: {count: 2, points: 4},
        X: {count: 1, points: 8},
        Y: {count: 2, points: 4},
        Z: {count: 1, points: 10},
        // Blank tile (used as a wildcard)
        //_: {count: 2, points: 0},
    };

    // Example usage:
        //   console.log(scrabbleTiles.E); // Output: { count: 12, points: 1 }
        //   console.log(scrabbleTiles.Q); // Output: { count: 1, points: 10 }
        //   console.log(scrabbleTiles._); // Output: { count: 2, points: 0 }
    

/*----- state variables -----*/

    let board; //15x15 grid of divs with unique ids
    let turn; //1 for player 1, -1 for player 2
    let round; // number of turns taken by both players (for rendering first-round controls)
    let letterBag; //object that will keep track of which letters are still available in the bag
    let winner; // winner: null = no winner, 1/-1 = winner, 'T' = tie

    const players = {
        One: {turn: 1, score: 0, letters: []},
        Two: {turn: -1, score: 0, letters: []}
    }
    
/*----- cached elements  -----*/
    // const messageEl = document.querySelector('h2')
    const selectLettersButton = document.getElementById('select-letters-button')
    submitPlayButton = document.getElementById('submit-play-button')
    const playAgainButton = document.getElementById('play-again-button')
    // const colMarkerEls = [...document.querySelectorAll('#column-markers > div')]
    const boardContainer = document.getElementById('board-container')

/*----- event listeners -----*/
    // document.getElementById('column-markers').addEventListener('click', handleDrop)
    // playAgainBtn.addEventListener('click', init)


/*----- functions -----*/

//Initialize all state, then call render()
function init () {
	//Rotate 90 degrees counter-clockwise and array is visualization of the board
	board = [
        ['','','','','','','','','','','','','','',''],
        ['','','','','','','','','','','','','','',''],
        ['','','','','','','','','','','','','','',''],
        ['','','','','','','','','','','','','','',''],
        ['','','','','','','','','','','','','','',''],
        ['','','','','','','','','','','','','','',''],
        ['','','','','','','','','','','','','','',''],
        ['','','','','','','','','','','','','','',''],
        ['','','','','','','','','','','','','','',''],
        ['','','','','','','','','','','','','','',''],
        ['','','','','','','','','','','','','','',''],
        ['','','','','','','','','','','','','','',''],
        ['','','','','','','','','','','','','','',''],
        ['','','','','','','','','','','','','','',''],
        ['','','','','','','','','','','','','','','']		
	]

	turn = 1
    round = 1
    letterBag = letters
	winner = null
	// render()
}

//Visualize all state in the DOM
    
    function renderBoard(){
        board.forEach(
            function(colArr, colIdx){
                colArr.forEach(
                    function(cellVal, rowIdx){
                        const cell = document.createElement('div')
                        cell.classList.add('board-cell')
                        cell.id = `cell-${colIdx}${rowIdx}`
                        if(cell.id === 'cell-77'){cell.style.backgroundColor = '#dba4aa'}
                        
                        boardContainer.appendChild(cell)
                    }
                )	
            }
        )
    }

    function render(){
        renderBoard()
        renderScores()
        // renderMessage()
        renderControls()
    }

    function renderScores(){
        // document.querySelector('#player-scores > h3').innerText = players[1].score
        const playerScores = document.querySelectorAll('#player-scores > h3')
        playerScores[0].innerText = players.One.score
        playerScores[1].innerText = players.Two.score
        // playerScores.forEach(
        //     function(playerScore, idx){
        //         playerScore.innerText = players[idx].score
        //     }
        // )
    }

    function renderControls(){

        // if(!winner && round > 1){submitPlayButton.style.visibility = 'visible'}
            
        submitPlayButton.style.visibility = !winner  && round > 1 ? 'visible':'hidden'
        selectLettersButton.style.visibility = round === 1 ? 'visible':'hidden'
        playAgainButton.style.visibility = winner ? 'visible':'hidden'

        // colMarkerEls.forEach(
        //     function(colMarkerEl, colIdx){
        //         const hideMarker = !board[colIdx].includes(0) || winner
        //         colMarkerEl.style.visibility = hideMarker ? 'hidden':'visible'
        //     }
        // )
    }

    // function renderMessage(){
    //     if(winner === 'T'){
    //         messageEl.innerText = 'Tie Game!!!'
    //     }else if(winner){
    //         messageEl.innerHTML = 
    //         `<span style = 'color: ${COLORS[winner]}'>${COLORS[winner].toUpperCase()}</span> Wins!`
    //     }else{ //game still in play
    //         messageEl.innerHTML = 
    //         `<span style = 'color: ${COLORS[turn]}'>${COLORS[turn].toUpperCase()}</span>'s Turn`
    //         //messageEl.style.color = `${COLORS[winner]}`
    //     }
    // }

    

    // //Update board in response to user action
    // function handleDrop(event){
    //     const colIdx = colMarkerEls.indexOf(event.target)
    //     // console.log(colIdx)

    //     if(colIdx === -1){return} //Guards
    //     const colArr = board[colIdx] //shortcut to the column
    //     const rowIdx = colArr.indexOf(0)
    //     // console.log(rowIdx)
        
    //     colArr[rowIdx] = turn

    //     turn *= -1 
    //     winner = getWinner(colIdx, rowIdx)
    //     render()
    // }

    // function getWinner(colIdx, rowIdx){
    //     return checkVerticalWin(colIdx, rowIdx) ||
    //     checkHorizontalWin(colIdx, rowIdx) ||
    //     checkDiagonalNWSEWin(colIdx, rowIdx) ||
    //     checkDiagonalNESWWin(colIdx, rowIdx)
    // }

    // function checkVerticalWin(colIdx, rowIdx){
    //     return countAdjacent(colIdx, rowIdx, 0, -1) === 3 ? board[colIdx][rowIdx] : null
    // }

    // function checkHorizontalWin(colIdx, rowIdx){
    //     const adjacentCountLeft = countAdjacent(colIdx, rowIdx, -1, 0)
    //     const adjacentCountRight = countAdjacent(colIdx, rowIdx, 1, 0)
    //     return (adjacentCountLeft + adjacentCountRight) === 3 ? board[colIdx][rowIdx] : null
    // }

    // function checkDiagonalNWSEWin(colIdx, rowIdx){
    //     const adjacentCountNW = countAdjacent(colIdx, rowIdx, -1, 1)
    //     const adjacentCountSE = countAdjacent(colIdx, rowIdx, 1, -1)
    //     return (adjacentCountNW + adjacentCountSE) === 3 ? board[colIdx][rowIdx] : null
    // }

    // function checkDiagonalNESWWin(colIdx, rowIdx){
    //     const adjacentCountNE = countAdjacent(colIdx, rowIdx, 1, 1)
    //     const adjacentCountSW = countAdjacent(colIdx, rowIdx, -1, -1)
    //     return (adjacentCountNE + adjacentCountSW) === 3 ? board[colIdx][rowIdx] : null
    // }

    // function countAdjacent(colIdx, rowIdx, colOffset, rowOffset){
    //     const player = board[colIdx][rowIdx]
    //     let count = 0;
    //     colIdx += colOffset;
    //     rowIdx += rowOffset;

    //     while(
    //         board[colIdx] !== undefined && //colIdx >= 0 && colIdx <= 6 //Ensure that we stay on the board (within bounds)
    //         board[colIdx][rowIdx] !== undefined &&
    //         board[colIdx][rowIdx] === player
    //     ){
    //         count++
    //         colIdx += colOffset
    //         rowIdx += rowOffset
    //     }

    //     return(count)
    //     // console.log(player)
    // }

init()
render()