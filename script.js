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
    let refillLettersButtonClicked = false //turns true once button is clicked so it can be hidden
    let selectedLetters = []; //letters that have been clicked and will either be going on the board or back into the letterbag
    let placedLetters = []; //letters that were placed during the current turn
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
            
        submitPlayButton.style.visibility = !winner ? 'visible':'hidden'
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

    function renderNumberOfLettersLeftInBag(){
        const numberofLettersLeftInBag = letterBag.length
        document.getElementById('number-of-letters-left-in-bag').innerText = numberofLettersLeftInBag
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
        render()
    }
    
    function refillLetterFromBag(){
        const numLettersInLetterBag = letterBag.length
        const randomIndex = Math.floor(Math.random() * numLettersInLetterBag) + 1;
        randomLetter = letterBag[randomIndex]
        letterBag.splice(randomIndex,1) //Take letter OUT of letterBag so it cannot be selected anymore and doesn't count towards numLettersInLetterBag
        renderNumberOfLettersLeftInBag()
        return(randomLetter)
    }

    function placeLetter(event){
        if(selectedLetters.length !== 1){return} //guard: if have no selected letters

        const boardCellEl = event.target
        if(!boardCellEl.classList.contains('board-cell')) {return} // guard: if the clicked element is not a valid board cell
        if(boardCellEl.classList.contains('board-cell-with-letter')){return} //guard: can't place a letter on top of a letter
        
        const boardCellColIdx = parseInt(boardCellEl.id.split("_")[0])
        const boardCellRowIdx = parseInt(boardCellEl.id.split("_")[1])

        board[boardCellColIdx][boardCellRowIdx] = selectedLetters[0] //modify 'board' object in the background
        renderBoard() //render updated board

        if(turn === 1){player = players[0]}else{player = players[1]} 

        //cleanup
        const indexToRemove = player.letters.indexOf(selectedLetters[0])
        player.letters.splice(indexToRemove, 1) //remove the letter from the player's current letters
        renderLettersInTray() //re-render the tray with the letter that was placed now gone
        
        const placedLetter = {letter: selectedLetters[0], xCoord: boardCellColIdx, yCoord: boardCellRowIdx}
        placedLetters.push(placedLetter) //add placed letter to placedLetters
        selectedLetters = [] //reset selectedLetters so placeLetter can be called again

        // console.log(indexToRemove, player.letters)

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
        if(placedLetters === [] && !exchangingLetters){return}

        checkPlay()
        scorePlay()


        //cleanup
        selectedLetters = [] // reset selectedLetters
        if(turn === 1){ // update turn and round
            turn = 2
        }else{
            turn = 1
            round += 1
        }
        
        // placedLetters = []
        exchangingLetters = false
        refillLettersButtonClicked = false

        // console.log(turn, round, exchangingLetters, selectedLetters, players)

        render()
        renderLettersInTray()
    }

//Checking the Validity of the Play
    
    function checkPlay(){
        if(turn === 1 && round === 1){

        }

        
    }



    // function 

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

init()
render()