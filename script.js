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
    let turn; //1 for player 1, 2 for player 2
    let player; //will be used for more easily modifying the 'players' object
    let round; // number of turns taken by both players (for rendering first-round controls)
    let winner; // winner: null = no winner, 1/-1 = winner, 'T' = tie
    let refillLettersButtonClicked = false //turns true once button is clicked so it can be hidden
    let selectedLetters = []; //letters that have been clicked and will either be going on the board or back into the letterbag
    let placedLetters = []; //letters that were placed during the current turn
    let exchangingLetters = false //toggle variable that tells us whether the player is in the middle of a letter exchange, to help put guardrails on functions
    let boardAsOfEndOfLastTurn = blankBoard
    const players = [
        {name: 'One', turn: 1, score: 0, letters: []},
        {name: 'Two', turn: 2, score: 0, letters: []}
    ]
    let letterBag;
    
    
/*----- cached elements  -----*/

    const playerScores = document.querySelectorAll('#player-scores > h3')
    const gridContainer = document.getElementById('grid-container')
    const letterTray = document.getElementById('letter-tray')
    const messageContainer = document.getElementById('message-container')
    const buttonsContainer = document.getElementById('buttons-container')

    const refillLettersButton = document.getElementById('select-letters-button')
    const initiateLetterExchangeButton = document.getElementById('initiate-letter-exchange-button')
    const submitPlayButton = document.getElementById('submit-play-button')
    const passTurnButton = document.getElementById('pass-turn-button')
    const playAgainButton = document.getElementById('play-again-button')

    const lettersLeftIndicator = document.getElementById('letters-left-indicator')
    
/*----- event listeners -----*/

    letterTray.addEventListener('click',selectLetter)
    gridContainer.addEventListener('click',placeLetter)
    
    refillLettersButton.addEventListener('click', 
        function(){
            refillLettersFromBag()
            refillLettersButtonClicked = true
            renderControls()
        }
    )
    initiateLetterExchangeButton.addEventListener('click', initiateLetterExchange)
    submitPlayButton.addEventListener('click', submitPlay)
    passTurnButton.addEventListener('click', endTurnUpdates)
    playAgainButton.addEventListener('click', init)


/*----- functions -----*/

//Initialize all state, then call render()

    function init () {
        
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
        placedLetters = []
        refillLettersButtonClicked = false
        exchangingLetters = false

        createLetterBag()

        render()
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
        gridContainer.innerHTML = ''

        board.forEach(
            function(colArr, rowIdx){
                colArr.forEach(
                    function(cellValue, colIdx){

                        //Create the new board html div & add classes to style it
                        const cell = document.createElement('div')
                        cell.classList.add('board-cell')
                        cell.id = `${colIdx}_${rowIdx}`
                        
                        if(board[colIdx][rowIdx] !== ''){//render a letter in the square when present in the board array
                            cell.innerText = board[colIdx][rowIdx]
                            cell.classList.add('board-cell-with-letter')
                        }

                        if(placedLetters.length > 0){ //check if cell has a letter placed during the turn; if so, add it to special class and add an event listener so that it can be removed from the board 
                            const placedLettersCoords = placedLetters.map((letter) => [letter.colIdx, letter.rowIdx])
                            cellIsPlacedLetter = placedLettersCoords.some((coords) => coords[0] === colIdx && coords[1] === rowIdx);
                            // const placedLettersRowIndices = placeLetters.map((letter) => letters.rowIdx)

                            if(cellIsPlacedLetter){
                                cell.classList.add('board-cell-with-placed-letter')
                                cell.addEventListener('dblclick', removeLetterFromBoard)        
                            }  
                        }

                        gridContainer.appendChild(cell)
                    }
                )	
            }
        )
    }

    function renderScores(){     
        playerScores[0].innerText = players[0]['score']
        playerScores[1].innerText = players[1]['score']
    }

    function renderControls(){
        if(turn === 1){player = players[0]}else{player = players[1]}
        refillLettersButton.style.visibility = !exchangingLetters && !refillLettersButtonClicked && letterBag.length !== 0 ? 'visible':'hidden'
        initiateLetterExchangeButton.style.visibility = !exchangingLetters && !winner && player.letters.length !== 0 ? 'visible':'hidden'
        submitPlayButton.style.visibility = !exchangingLetters && !winner && placedLetters.length > 0 ? 'visible':'hidden'
        passTurnButton.style.visibility = !exchangingLetters && !winner && player.letters.length !== 0 ? 'visible':'hidden'
        playAgainButton.style.visibility = !exchangingLetters && winner ? 'visible':'hidden'
    }

    function renderTurnIndicator(){
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

        if(turn === 1){player = players[0]}else{player = players[1]} 
    
        player.letters.forEach(
            function(letter){
                const letterTile = document.createElement('div')
                letterTile.innerText = letter
                letterTile.classList.add('letter-in-tray')
                letterTray.appendChild(letterTile)
            }    
        )
    }

    function renderNumberOfLettersLeftInBag(){
        const numLettersInLetterBag = letterBag.length
        document.getElementById('number-of-letters-left-in-bag').innerText = numLettersInLetterBag
    }

    function renderCheckPlayMessage(){
        const checkFirstPlayMessage = checkFirstPlay() ? '' : 'Your word must be played horizontally and cover the center square of the board.'
        const checkStraightPlayMessage = checkStraightPlay() ? '' : 'Your word must be played horizontally or vertically (in only one row or one column of the board).'
        const checkPlayConnectedMessage = checkPlayConnected() ? '' : 'Your word must be connected to at least one letter that was played during a previous turn.'

        const checkPlayMessage = checkFirstPlayMessage+' '+checkStraightPlayMessage+' '+checkPlayConnectedMessage

        messageContainer.innerText = checkPlayMessage
    }

    function renderWinMessage(){
        //Hide everything that appears under the board during gameplay
        letterTray.style.visibility = winner ? 'hidden':'visible' 
        buttonsContainer.style.visibility = winner ? 'hidden':'visible'
        lettersLeftIndicator.style.visibility = !winner ? 'visible':'hidden' 

        //Display win message
        messageContainer.style.visibility = 'visible' //show a winning message
        if(winner === 'T'){
            messageContainer.innerHTML = 'Tie Game!'
        }else{
            messageContainer.innerHTML = `Player ${winner.name} Wins!`
        }
    }

//User Interactions

    function refillLettersFromBag(){
        if(turn === 1){player = players[0]}else{player = players[1]} 
       
        let numLettersToRefill = 7 - player.letters.length //number of letters to be added to the player's tray
        
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

        const currentLetterEls = document.getElementsByClassName('letter-in-tray')
        const currentLetterElsArray = [...currentLetterEls]
        const letterIdx = currentLetterElsArray.indexOf(event.target)
        const selectedLetterEl = currentLetterEls[letterIdx] //update letter tray formatting to show that letter has been selected
        selectedLetterEl.style.backgroundColor = '#636363'

        if(turn === 1){player = players[0]}else{player = players[1]} 
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
        const placedLetter = {letter: selectedLetters[0], colIdx: boardCellColIdx, rowIdx: boardCellRowIdx}
        placedLetters.push(placedLetter) //add placed letter to placedLetters
        
        //CLEANUP
        const indexToRemove = player.letters.indexOf(selectedLetters[0])
        player.letters.splice(indexToRemove, 1) //remove the letter from the player's current letters
        render() //re-render the tray with the letter that was placed now gone
        selectedLetters = [] //reset selectedLetters so placeLetter can be called again
    }

    function removeLetterFromBoard(event){
        const boardCellEl = event.target
        const boardCellColIdx = parseInt(boardCellEl.id.split("_")[0])
        const boardCellRowIdx = parseInt(boardCellEl.id.split("_")[1])
        if(turn === 1){player = players[0]}else{player = players[1]}
        
        player.letters = [...player.letters, board[boardCellColIdx][boardCellRowIdx]]  //return placed letter to player's tray
        placedLetters = placedLetters.filter((letterObj) => !(letterObj.colIdx === boardCellColIdx && letterObj.rowIdx === boardCellRowIdx)) //remove letter from placedLetters

        board[boardCellColIdx][boardCellRowIdx] = '' //modify 'board' object in the background 
        
        //Cleanup
        boardCellEl.removeEventListener('click', removeLetterFromBoard)//remove event listener from cell
        boardCellEl.classList.remove('board-cell-with-placed-letter') //remove board-cell-with-letter class from cell
       
        renderBoard() //render updated board
        renderLettersInTray() //render updated letters tray
    }

    function initiateLetterExchange(event){
        if(turn === 1){player = players[0]}else{player = players[1]}
        if(player.letters.length === 0){exchangingLetters = false; return} //guard: if player has no letters to exchange
        
        exchangingLetters = true

        if(placedLetters.length > 0){ //remove any placed letters from the board & put them back in the player's tray
            board = boardAsOfEndOfLastTurn //remove placed letters from board

           
            player.letters = [...player.letters, ...placedLetters.map((element) => element.letter)] //return placed letter to player's tray

            document.querySelectorAll('.board-cell-with-placed-letter').forEach((cell) => cell.classList.remove('board-cell-with-placed-letter'))
        }

        //Swap out Exchange Letters button for a new one same styling as botton:hover for completing the exchange
        const completeLetterExchangeButton = document.createElement('button')
        completeLetterExchangeButton.innerText = 'Complete Letter Exchange'
        completeLetterExchangeButton.id = 'complete-letter-exchange-button'
        completeLetterExchangeButton.addEventListener('click', completeLetterExchange)
        buttonsContainer.insertBefore(completeLetterExchangeButton, submitPlayButton)   
        
        render()
    }

    function completeLetterExchange(event){
        const completeLetterExchangeButton = document.getElementById('complete-letter-exchange-button')
        if(selectedLetters.length === 0){ //guard: if no selected letters to exchange, set conditions erxchangingLetters condition back to false and end function execution
            exchangingLetters = false 
            completeLetterExchangeButton.remove()
            render()
            return
        } 

        //Remove letters at random from bag - newLettersFromExchange
        let numLettersToRefill = selectedLetters.length //number of letters to be added to the player's tray
        if(numLettersToRefill > letterBag.length){ //guard: for when players get down to only having less than seven letters left in the bag
            messageContainer.innerHTML = `Only ${letterBag.length} letter(s) left in the bag. Please try again and select fewer letters.`
            exchangingLetters = false; 
            completeLetterExchangeButton.remove(); 
            render(); 
            return
        } 
    
        const newLettersFromExchange = []
        for(let i = 0; i < numLettersToRefill; i++){ newLettersFromExchange[i] = refillLetterFromBag() }
        
        //Remove selectedLetters from player.letters
        if(turn === 1){player = players[0]}else{player = players[1]}
        selectedLetters.forEach(function(selectedLetter){
            const indexToRemove = player.letters.indexOf(selectedLetter)
            player.letters.splice(indexToRemove, 1) //remove the letter from the player's current letters
        })
        
        //Add selectedLetters to letterBag
        letterBag = [...letterBag, ...selectedLetters].sort()
        
        //Add newLettersFromExchange to player.letters
        player.letters = [...player.letters, ...newLettersFromExchange] //refill the player's letter tray

        //Cleanup
        completeLetterExchangeButton.remove()
        endTurnUpdates()
        render()
        console.log('letter exchange done!', players.map(elem => elem.letters))
    }

    function submitPlay(){
        if(placedLetters.length === 0 && !exchangingLetters){return} //guard: if the player has not placed any letters and is not doing a letter exchange, don't do anything

        //1. Check if play is valid, and if not, return placed letters to player's tray and end turn with no change in score.
        if(!checkPlay()){
            
            board = boardAsOfEndOfLastTurn //Remove placed letters from board

            if(turn === 1){player = players[0]}else{player = players[1]}
            player.letters = [...player.letters, ...placedLetters.map((element) => element.letter)] //return placed letter to player's tray
            renderCheckPlayMessage()
            setTimeout(endTurnUpdates, 5000)
            return  
        }
        
        //2. Score the play
        if(turn === 1){player = players[0]}else{player = players[1]} 
        player.score += scorePlay()
        
        checkWin()
        endTurnUpdates()  
    }

//Checking the Validity of the Play
    
    function checkPlay(){
        const checkFirstPlayResult = checkFirstPlay() 
        const checkStraightPlayResult = checkStraightPlay()
        const checkPlayConnectedResult = checkPlayConnected()
        
        const result = checkFirstPlayResult && checkStraightPlayResult && checkPlayConnectedResult

        return(result)
    }

    //Checking Validity of Placement
    function checkFirstPlay(){
        if(turn !== 1 || round !== 1){return(true)} //guard: if this is not the first play, return 'true' (these checks no longer applicable)
        const cols = placedLetters.map((item) => item.colIdx)
        const rows = placedLetters.map((item) => item.rowIdx)

        const uniqueCols = [... new Set(cols)]
        const uniqueRows = [... new Set(rows)]

        let isHorizontalPlay = false
        if(uniqueRows.length === 1){isHorizontalPlay = true} //check if play is horizontal

        let coversCentralSquare = false
        if(uniqueCols.includes(7) && uniqueRows.includes(7)){coversCentralSquare = true}

        const result = isHorizontalPlay && coversCentralSquare

        return(result)
    }

    function checkStraightPlay(){
        const cols = placedLetters.map((item) => item.colIdx)
        const rows = placedLetters.map((item) => item.rowIdx)

        const uniqueCols = [... new Set(cols)]
        const uniqueRows = [... new Set(rows)]

        const result = uniqueCols.length === 1 || uniqueRows.length === 1 //check if play is in either one column or one row
        return(result)
    }

    function checkPlayConnected(){
        if(turn === 1 && round === 1){return(true)} //guard: if this is the first play, return 'true' (can't be connected on the first play)
        const result = placedLetters.map((item) => checkLetterConnectedToPreviouslyPlacedLetters(item)).some((element) => element === true)
        return(result)
    }

    function checkLetterConnectedToPreviouslyPlacedLetters(placedLetter){
        const adjacentCells = getAdjacentCells(boardAsOfEndOfLastTurn, placedLetter.colIdx, placedLetter.rowIdx)
        const result = adjacentCells.map((item) => item.contents !== '').some((element) => element === true)
        // console.log(result)
        return(result)
    }

//Scoring the Play

    function getNewWordsCreatedByPlay(){
        const newHorizontalWords = [...new Set(placedLetters.map(item => getHorizontalWord(item)))]
        const newVerticalWords = [...new Set(placedLetters.map(item => getVerticalWord(item)))]
        const newWords = [...newHorizontalWords, ...newVerticalWords].filter((item) => item !== undefined)
        return(newWords)
    }

    function getHorizontalWord(placedLetter){
        const rowIdx = placedLetter.rowIdx
        const rightEndColIdx = getEndIdx(placedLetter, 'right').colIdx
        const leftEndColIdx = getEndIdx(placedLetter, 'left').colIdx
        const wholeRange = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14]
        const wordRange = wholeRange.slice(leftEndColIdx, rightEndColIdx + 1) //Method 4 (Weston's suggestion)

        if(wordRange.length === 1){return} //guard: should only be able to play 1-letter word on a blank board (first valid play)
       
        const wordBoardCells = wordRange.map(item => [item, rowIdx])
        const word = wordBoardCells.map(item => board[item[0]][item[1]]).join('')

        return(word)
    }

    function getVerticalWord(placedLetter){
        if(turn === 1 && round === 1){return} //guard: no vertical words on first play
        const colIdx = placedLetter.colIdx
        const wholeRange = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14]
        const wordRange = wholeRange.slice(getEndIdx(placedLetter, 'up').rowIdx, getEndIdx(placedLetter, 'down').rowIdx + 1) //Method 4 (Weston's suggestion)

        if(wordRange.length === 1){return} //guard: should only be able to play 1-letter word on a blank board (first valid play)
        
        const wordBoardCells = wordRange.map(item => [colIdx, item])
        const word = wordBoardCells.map(item => board[item[0]][item[1]]).join('')

        return(word)
    }

    function getEndIdx(placedLetter, direction){
        const allowedDirections = ['right','left','up','down']
        if (!allowedDirections.includes(direction)) { // Check if the direction is valid
            throw new Error('Invalid direction. Accepted values are "right", "left", "up" or "down".');
        }

        let offsets 
        switch(direction){
            case 'right': offsets = {rowOffset: 0, colOffset: 1}; break;
            case 'left': offsets = {rowOffset: 0, colOffset: -1}; break;
            case 'up': offsets = {rowOffset: -1, colOffset: 0}; break;
            case 'down': offsets = {rowOffset: 1, colOffset: 0};
        }

        let colIdx = placedLetter.colIdx
        let rowIdx = placedLetter.rowIdx
        
        while(
            board[colIdx] !== undefined && //colIdx >= 0 && colIdx <= 6 //Ensure that we stay on the board (within bounds)
            board[colIdx][rowIdx] !== undefined &&
            board[colIdx][rowIdx] !== ''
        ){
            colIdx += offsets.colOffset
            rowIdx += offsets.rowOffset
        }
        
        const result = {colIdx, rowIdx}
        return(result)
    }
    
    function scorePlay(){
        const wordsCreatedByPlay = getNewWordsCreatedByPlay()
        const scoreLetters = getNewWordsCreatedByPlay().flatMap(word => word.split(''))
        
        let playPoints = 0;

        scoreLetters.forEach((letter) => {    
            if(letters[letter]){
                playPoints += letters[letter].points;
            }
        })

        if(turn === 1){player = players[0]}else{player = players[1]} 
        if(placedLetters.length === 7){playPoints += 50} 

        return(playPoints)
    }

//Check Win & Assign Winner

    function checkWin(){
        if(letterBag.length !== 0){return} //guard: no winning unless no letters left in the bag
        if(turn === 1){const player = players[0]}else{const player = players[1]}
        if(player.letters.length !== 0){return} //guard: no winning unless someone is out of letters

        const finalPlayer = player //assign winner variable
        const otherPlayer = turn === 1 ? players[1] : players[0]
        if(turn === 1){const otherPlayer = players[1]}else{const otherPlayer = players[0]} //final score adjustments
        const otherPlayerLetters = otherPlayer.letters
        let winPoints = 0;
        otherPlayerLetters.forEach((letter) => {    
            if(letters[letter]){
                winPoints += letters[letter].points;
            }
        })
        
        finalPlayer.score += winPoints //Add letter points from other player to the score of the player who ran out of letters
        otherPlayer.score -= winPoints  //Deduct any letters left in trays from other player's score
        
        if(finalPlayer.score === otherPlayer.score){winner = 'T'}else{
            winner = finalPlayer.score > otherPlayer.score ? finalPlayer : otherPlayer
        }

        renderWinMessage()
    }

//Other Functions (often useful in more than one of the above)

    // Expand letters object into an array containing the actual letter tiles
    function createLetterBag(){
        letterBag = [];

        for (const letter in letters) {
            const letterData = letters[letter];
            const { count } = letterData; // Extract the 'count' property
            
            for (let i = 0; i < count; i++) { // Push the letter into the array 'count' number of times
                letterBag.push(letter);
            }
        }
    }

    function getAdjacentCells(grid, col, row, direction) {
        if(col > 14 || row > 14){return}

        //Create correct offsets to provide only results for the selected direction
        let offsets 
        switch(direction){
            
            case 'all':
            offsets = [ // Define offsets for adjacent cells (up, down, left, right)
                {row: -1, col: 0}, // Up
                {row: 1, col: 0},  // Down
                {row: 0, col: -1}, // Left
                {row: 0, col: 1}   // Right
            ]; break;
            
            case 'horizontal':
            offsets = [ 
                {row: 0, col: -1}, 
                {row: 0, col: 1}   
            ]; break;

            case 'right':
            offsets = [ 
                {row: 0, col: 1}   
            ]; break;

            case 'left':
            offsets = [ 
                {row: 0, col: -1}  
            ]; break;
         
            case 'vertical':
            offsets = [ 
                {row: -1, col: 0}, 
                {row: 1, col: 0},  
            ]; break;

            case 'up':
            offsets = [ 
                {row: 1, col: 0}   
            ]; break;

            case 'down':
            offsets = [ 
                {row: -1, col: 0}   
            ]; break;

            default:
            offsets = [ 
                {row: -1, col: 0}, // Up
                {row: 1, col: 0},  // Down
                {row: 0, col: -1}, // Left
                {row: 0, col: 1}   // Right
            ];
        }

        const adjacentCells = [] //empty object for storing results of loop
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

    function endTurnUpdates(){
        messageContainer.innerText = ''
        refillLettersButtonClicked = false //reset refillLettersButoonClicked
        exchangingLetters = false
        initiateLetterExchangeButton.style.visibility = 'visible'
        selectedLetters = [] // reset selectedLetters
        placedLetters = [] // reset placedLetters
        if(turn === 1){ // update turn and round
            turn = 2
        }else{
            turn = 1
            round += 1
        }

        render()
    } 

    function delay(milliseconds) {
        return new Promise(resolve => {
          setTimeout(resolve, milliseconds);
        });
      }

init()
render()