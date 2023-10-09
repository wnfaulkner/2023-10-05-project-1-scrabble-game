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

    
/*----- state variables -----*/

    let board; //15x15 grid of divs with unique ids
    let turn; //1 for player 1, -1 for player 2
    let round; // number of turns taken by both players (for rendering first-round controls)
    let winner; // winner: null = no winner, 1/-1 = winner, 'T' = tie
    let selectedLetters; //letters that have been clicked and will either be going on the board or back into the letterbag
    let exchangingLetters = false; //toggle variable that tells us whether the player is in the middle of a letter exchange, to help put guardrails on functions

    const players = [
        {name: 'One', turn: 0, score: 0, letters: []},
        {name: 'Two', turn: 1, score: 0, letters: []}
    ]

    // Expand letters object into an array containing the actual letter tiles
    let letterBag = [];

    for (const letter in letters) {
        const letterData = letters[letter];
        const { count } = letterData; // Extract the 'count' property
        
        for (let i = 0; i < count; i++) { // Push the letter into the array 'count' number of times
            letterBag.push(letter);
        }
        //console.log(letterBag)
    }
    
    
/*----- cached elements  -----*/

    const refillLettersButton = document.getElementById('select-letters-button')
    const submitPlayButton = document.getElementById('submit-play-button')
    const playAgainButton = document.getElementById('play-again-button')
    
    const boardContainer = document.getElementById('board-container')
    const playerScores = document.querySelectorAll('#player-scores > h3')
    const letterTray = document.getElementById('letter-tray')

/*----- event listeners -----*/
    // document.getElementById('column-markers').addEventListener('click', handleDrop)
    refillLettersButton.addEventListener('click', function(){refillLettersFromBag()})
    document.getElementById('letter-tray').addEventListener('click',selectLetter)
    document.getElementById('board-container').addEventListener('click',function(){
        if(selectedLetters.length !== 1){return}
        placeLetter(event)
        //renderBoard()
        //selectedLetters = []
    })
    
    //playAgainBtn.addEventListener('click', init)


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
        winner = null

        players[0]['score'] = 0
        players[1]['score'] = 0
        players[0]['letters'] = []
        players[1]['letters'] = []
        selectedLetters = []
    }

//Visualize all state in the DOM

    function render(){
        renderBoard()
        renderScores()
        // renderMessage()
        renderControls()
    }
    
    function renderBoard(){
        boardContainer.innerHTML = ''

        board.forEach(
            function(colArr, colIdx){
                colArr.forEach(
                    function(cellValue, rowIdx){
                        const cell = document.createElement('div')
                        cell.classList.add('board-cell')
                        cell.id = `${colIdx}_${rowIdx}`
                        if(cell.id === 'cell-77'){cell.style.backgroundColor = '#dba4aa'}
                        
                        if(board[colIdx][rowIdx] !== ''){//render a letter in the square when present in the board array
                            cell.innerText = board[colIdx][rowIdx]
                            cell.classList.add('board-cell-with-letter')
                        }

                        boardContainer.appendChild(cell)
                    }
                )	
            }
        )
    }


    function renderScores(){     
        playerScores[0].innerText = players[0]['score']
        playerScores[1].innerText = players[1]['score']
        // ! REFACTOR TO AN ARRAY ITERATOR, PROBABLY FOREACH?
    }

    function renderControls(){
            
        submitPlayButton.style.visibility = !winner ? 'visible':'hidden'
        refillLettersButton.style.visibility = round === 1 ? 'visible':'hidden'
        playAgainButton.style.visibility = winner ? 'visible':'hidden'
        
        // renderLettersInTray()

    }

    function renderLettersInTray(){
        letterTray.innerHTML = ''
        if(turn === 1){player = players[0]}else{player = players[1]} 
        player.letters.forEach(
            function(letter){
                const letterTile = document.createElement('div')
                letterTile.innerText = letter
                letterTile.classList.add('current-player-letter')
                letterTray.appendChild(letterTile)
            }    
        )
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

    

//Update board in response to user action
    
    function refillLettersFromBag(){
        if(turn === 1){player = players[0]}else{player = players[1]} 
       
        const numLettersToRefill = 7 - player.letters.length //number of letters to be added to the player's tray
        
        if(numLettersToRefill === 0){return} //guard: in case refillLettersButton gets clicked more than once
        if(numLettersToRefill > letterBag.length){numLettersToRefill = letterBag.length} //guard: for when players get down to only having less than seven letters left in the bag
        
        const refillLetters = []
        for(let i = 0; i < numLettersToRefill; i++){
            refillLetters[i] = refillLetterFromBag()
        }

        player.letters = [...player.letters, ...refillLetters] //refill the player's letter tray
        renderLettersInTray()
    }
    
    function refillLetterFromBag(){
        const numLettersInLetterBag = letterBag.length
        const randomIndex = Math.floor(Math.random() * numLettersInLetterBag) + 1;
        randomLetter = letterBag[randomIndex]
        letterBag.splice(randomIndex,1) //Take letter OUT of letterBag so it cannot be selected anymore and doesn't count towards numLettersInLetterBag
        return(randomLetter)
    }

    function placeLetter(event){
        if(selectedLetters.length !== 1){return} //guard: if have no selected letters

        const boardCellEl = event.target
        if (!boardCellEl.classList.contains('board-cell')) {return} // guard: if the clicked element is not a valid board cell

        const boardCellColIdx = parseInt(boardCellEl.id.split("_")[0])
        const boardCellRowIdx = parseInt(boardCellEl.id.split("_")[1])

        board[boardCellColIdx][boardCellRowIdx] = selectedLetters[0] //modify 'board' object in the background
        renderBoard() //render updated board

        if(turn === 1){player = players[0]}else{player = players[1]} 
        player.letters = player.letters.filter((letter) => !selectedLetters.includes(letter))
        renderLettersInTray()


    }

    function selectLetter(event){
        if(turn === 1){player = players[0]}else{player = players[1]} 
        const currentLetterEls = document.getElementsByClassName('current-player-letter')
        
        const currentLetterElsArray = [...currentLetterEls]
        const letterIdx = currentLetterElsArray.indexOf(event.target)
        
        const selectedLetterEl = currentLetterEls[letterIdx] //update letter tray formatting to show that letter has been selected
        selectedLetterEl.style.backgroundColor = '#636363'

        const selectedLetter = player.letters[letterIdx] //return actual letter as js object
        selectedLetters.push(selectedLetter)
        // console.log(letterIdx, player.letters, selectedLetter)
    }

    function submitPlay(){

        selectedLetters = []
    }
    
    function endTurn(){

        selectedLetters = []
    }

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