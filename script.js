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

    const blankBoard = [
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
    
/*----- state variables -----*/

    let board; //15x15 grid of divs with unique ids
    let turn; //1 for player 1, -1 for player 2
    let round; // number of turns taken by both players (for rendering first-round controls)
    let winner; // winner: null = no winner, 1/-1 = winner, 'T' = tie
    let refillLettersButtonClicked = false //turns true once button is clicked so it can be hidden
    let selectedLetters = []; //letters that have been clicked and will either be going on the board or back into the letterbag
    let placedLetters = []; //letters that were placed during the current turn
    let exchangingLetters = false //toggle variable that tells us whether the player is in the middle of a letter exchange, to help put guardrails on functions
    let boardAsOfEndOfLastTurn = blankBoard
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
    }
    
    
/*----- cached elements  -----*/

    const refillLettersButton = document.getElementById('select-letters-button')
    const submitPlayButton = document.getElementById('submit-play-button')
    const playAgainButton = document.getElementById('play-again-button')
    
    const boardContainer = document.getElementById('board-container')
    const playerScores = document.querySelectorAll('#player-scores > h3')
    const letterTray = document.getElementById('letter-tray')

/*----- event listeners -----*/

    refillLettersButton.addEventListener('click', 
        function(){
            refillLettersFromBag()
            refillLettersButtonClicked = true
            renderControls()
        }
    )
    document.getElementById('letter-tray').addEventListener('click',selectLetter)
    document.getElementById('board-container').addEventListener('click',placeLetter)
    submitPlayButton.addEventListener('click', submitPlay)
        
    //playAgainBtn.addEventListener('click', init)


/*----- functions -----*/

//Initialize all state, then call render()

    function init () {
        //Rotate 90 degrees counter-clockwise and array is visualization of the board
        board = blankBoard

        turn = 1
        round = 1
        winner = null

        players[0]['score'] = 0
        players[1]['score'] = 0
        players[0]['letters'] = []
        players[1]['letters'] = []
        selectedLetters = []
        placedLetters = []
        refillLettersButtonClicked = false
        exchangingLetters = false
    }

//Visualize all state in the DOM

    function render(){
        renderScores()
        renderTurnIndicator()
        renderBoard()
        renderLettersInTray()
        renderControls()
        renderNumberOfLettersLeftInBag()
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
            
        submitPlayButton.style.visibility = !winner && !exchangingLetters ? 'visible':'hidden'
        refillLettersButton.style.visibility = refillLettersButtonClicked ? 'hidden':'visible'
        playAgainButton.style.visibility = winner ? 'visible':'hidden'

    }

    function renderTurnIndicator(){
        let turnIndicatorEl;
        if(turn === 1){
            document.querySelector('#player-1-turn-indicator').classList.add('active-turn-indicator')
            document.querySelector('#player-2-turn-indicator').classList.remove('active-turn-indicator')
        }else{
            document.querySelector('#player-2-turn-indicator').classList.add('active-turn-indicator')
            document.querySelector('#player-1-turn-indicator').classList.remove('active-turn-indicator')
        }
    }

    function renderLettersInTray(){
        letterTray.innerHTML = ''
        let player
        if(turn === 1){player = players[0]}else{player = players[1]} 
        // Debugging
        // console.log(player); // Check the content of the player object
        // console.log(Array.isArray(player.letters)); // Check if player.letters is an array

        player.letters.forEach(
            function(letter){
                const letterTile = document.createElement('div')
                letterTile.innerText = letter
                letterTile.classList.add('current-player-letter')
                letterTray.appendChild(letterTile)
            }    
        )
    }

    function renderNumberOfLettersLeftInBag(){
        const numLettersInLetterBag = letterBag.length
        document.getElementById('number-of-letters-left-in-bag').innerText = numLettersInLetterBag
    }

    function renderMessages(){
        
    }

//User Interactions

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
        const randomIndex = Math.floor(Math.random() * numLettersInLetterBag)
        const randomLetter = letterBag[randomIndex]
        
        letterBag.splice(randomIndex,1) //Take letter OUT of letterBag so it cannot be selected anymore & doesn't count towards numLettersInLetterBag
        renderNumberOfLettersLeftInBag()
        
        return(randomLetter)
    }

    function selectLetter(event){
        if(!exchangingLetters && selectedLetters.length > 0){return} //guard: when not exchanging letters, should not be able to select more than one letter
        if(placedLetters.length === 0){boardAsOfEndOfLastTurn = JSON.parse(JSON.stringify(board))} //store initial state of board as of end of last turn so can revert to it if player makes an invalid play

        if(turn === 1){player = players[0]}else{player = players[1]} 
        const currentLetterEls = document.getElementsByClassName('current-player-letter')
        
        const currentLetterElsArray = [...currentLetterEls]
        const letterIdx = currentLetterElsArray.indexOf(event.target)
        
        const selectedLetterEl = currentLetterEls[letterIdx] //update letter tray formatting to show that letter has been selected
        selectedLetterEl.style.backgroundColor = '#636363'

        const selectedLetter = player.letters[letterIdx] //return actual letter as js object
        selectedLetters.push(selectedLetter)
    }

    function placeLetter(event){
        if(selectedLetters.length !== 1){return} //guard: cancel operation if have no or multiple selected letters

        const boardCellEl = event.target
        if(!boardCellEl.classList.contains('board-cell')) {return} // guard: if the clicked element is not a valid board cell
        if(boardCellEl.classList.contains('board-cell-with-letter')){return} //guard: can't place a letter on top of a letter
        
        const boardCellColIdx = parseInt(boardCellEl.id.split("_")[0])
        const boardCellRowIdx = parseInt(boardCellEl.id.split("_")[1])

        board[boardCellColIdx][boardCellRowIdx] = selectedLetters[0] //modify 'board' object in the background
        renderBoard() //render updated board

        if(turn === 1){player = players[0]}else{player = players[1]} 

        //STORAGE FOR USE IN OTHER FUNCTIONS
        const placedLetter = {letter: selectedLetters[0], xCoord: boardCellColIdx, yCoord: boardCellRowIdx}
        placedLetters.push(placedLetter) //add placed letter to placedLetters
        
        //CLEANUP
        const indexToRemove = player.letters.indexOf(selectedLetters[0])
        player.letters.splice(indexToRemove, 1) //remove the letter from the player's current letters
        renderLettersInTray() //re-render the tray with the letter that was placed now gone
        selectedLetters = [] //reset selectedLetters so placeLetter can be called again
    }

    function submitPlay(){
        if(placedLetters.length === 0 && !exchangingLetters){return} //guard: if the player has not placed any letters and is not doing a letter exchange, don't do anything
        
         

        if(!checkPlay()){
            
            //Remove placed letters from board
            // if(turn === 1 && round === 1){boardAsOfEndOfLastTurn = blankBoard}
            board = boardAsOfEndOfLastTurn

            let player
            if(turn === 1){player = players[0]}else{player = players[1]}
            player.letters = [...player.letters, ...placedLetters.map((element) => element.letter)] //return placed letter to player's tray
            
            console.log(player); // Check the content of the player object
            console.log(player.letters); // Check if player.letters is an array

            endTurnUpdates()
            render()
            return    
        }
        // scorePlay()
        
        
        endTurnUpdates()
        render()
        
    }

//Checking the Validity of the Play
    
    function checkPlay(){
        
        let checkFirstPlayResult // check whether play is horizontal and covers first square
        if(turn === 1 && round === 1){
            checkFirstPlayResult = checkFirstPlay()
        }else{
            checkFirstPlayResult = true
        } 

        const checkStraightPlayResult = checkStraightPlay()
        const result = checkFirstPlayResult && checkStraightPlayResult
        // console.log(checkFirstPlayResult, checkStraightPlayResult, result)
        return(result)

    }

    function checkFirstPlay(){
        const xCoords = placedLetters.map((item) => item.xCoord)
        const yCoords = placedLetters.map((item) => item.yCoord)

        const uniqueXCoords = [... new Set(xCoords)]
        const uniqueYCoords = [... new Set(yCoords)]

        let isHorizontalPlay = false
        if(uniqueXCoords.length === 1){isHorizontalPlay = true} //check if play is horizontal

        let coversCentralSquare = false
        if(uniqueXCoords.includes(7) && uniqueYCoords.includes(7)){coversCentralSquare = true}

        const result = isHorizontalPlay && coversCentralSquare


        return(result)
    }

    function checkStraightPlay(){
        const xCoords = placedLetters.map((item) => item.xCoord)
        const yCoords = placedLetters.map((item) => item.yCoord)

        const uniqueXCoords = [... new Set(xCoords)]
        const uniqueYCoords = [... new Set(yCoords)]

        const result = uniqueXCoords.length === 1 || uniqueYCoords.length === 1 //check if play is in either one column or one row
        return(result)
    }

    function checkWordConnected(){
        selectedLetters.forEach(checkLetterConnected())
    }

    function checkLetterConnected(){

    }

    function getAdjacentCells(grid, col, row) {
        if(col > 14 || row > 14){return}
    
        const adjacentCells = [];
    
        const offsets = [ // Define offsets for adjacent cells (up, down, left, right)
            { row: -1, col: 0 }, // Up
            { row: 1, col: 0 },  // Down
            { row: 0, col: -1 }, // Left
            { row: 0, col: 1 }   // Right
        ];
    
        for (const offset of offsets) {
            const newRow = row + offset.row
            const newCol = col + offset.col
            
            //guard: check if the new coordinates on the
            if (newRow >= 0 && newRow <= 14 && newCol >= 0 && newCol <= 14) {
                const adjacentCellContents = grid[newCol][newRow]
                adjacentCells.push({contents: adjacentCellContents, col: newCol, row: newRow});
            }
            
        }
        

        return adjacentCells;
    }

//Scoring the Play
    //!NEEDS TO CALCULATE GIVEN LETTERS OTHER PLAYERS PLACED PREVIOUSLY (ALL WORDS & LETTERS FORMED)
    function scorePlay(){
        
        let totalPoints = 0;

        placedLetters.forEach((letter) => {
            
            if(letters[letter]){
                totalPoints += letters[letter].points;
            }
        })

        if(turn === 1){player = players[0]}else{player = players[1]} 

        player.score += totalPoints //!NEEDS TO CALCULATE GIVEN LETTERS OTHER PLAYERS PLACED PREVIOUSLY (ALL WORDS & LETTERS FORMED)
        
    }

//Ending the Turn
    function endTurnUpdates(){
        // boardAsOfEndOfLastTurn = board
        refillLettersButtonClicked = false //reset refillLettersButoonClicked
        selectedLetters = [] // reset selectedLetters
        placedLetters = [] // reset placedLetters
        if(turn === 1){ // update turn and round
            turn = 2
        }else{
            turn = 1
            round += 1
        }

        // console.log(turn, round, players, board)
    } 

init()
render()