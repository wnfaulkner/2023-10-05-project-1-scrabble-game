![Scrabble Logo](https://logodix.com/logo/2057532.png)

# Play the a classic word game Scrabble! 
Scrabble is a game that combines vocabulary knowledge, word formation, and strategy. The main objective of Scrabble is to create words on the game board and score points based on the letters used and their placement. There are 100 letter tiles, each with a letter and a point value. The game board is a square grid with various special squares that offer bonus points for letter or word placement.

## Screenshots
<img src="./screenshots/Screenshot%201.png" alt="Game Start" width="500"/>
<img src="./screenshots/Screenshot%201.png" alt="First Play" width="500"/>
<img src="./screenshots/Screenshot%201.png" alt="Second Play" width="500"/>

## Tech Stack
Standard DOM Architecture:
* HTML & CSS for rendering & styling
* JavaScript for user interactivity, scoring, and win logic

## Getting Started

1. Click 'Refill Letters' to get started. Remember to refill anytime during gameplay when you have fewer than seven letters!
2. Click a letter in the letter tray to select it (you will see the color change when it is selected). Click any cell on the board to place the selected letter.
3. Double-click letters to remove them from the board and put them back in your letter tray.
4. The first play must be horizontal and cover the center board square. All plays must be in only one row or one column (horizontal or vertical, no diagonal plays). All plays must be connected to at least one letter that was on the board when the play began.
5. Once you are ready, click the 'Submit Play' button. Your play will be scored and the turn will pass to the other player.
6. If you feel that there are no legal plays to be made and do not want to exchange letters (or if there are no letters left in the bag to exchange), you can pass your turn by clicking the 'Pass Turn' button. Any letters you placed on the board during the play will be returned to your tray and you will not receive any points for the play.
7. Anytime you have letters in your tray, you can choose to exchange instead of playing a word. Click the 'Exchange Letters' button. Then select any letters Any letters you placed on the board during the play will be returned to your tray and you will not receive any points for the play.
8. Once all letters are gone from the bag and a player plays all of their letters, the game ends. When the game ends, all points from letters that have not been played will be deducted from the final score of the player with those letters. The total points of all unplayed letters will be added to the score of the player who is out of letters to produce the final score for the game. The Scrabble player with the highest score after all final scores are tallied wins!

Scrabble involves strategic thinking and word-building skills. Players aim to use high-value letters, take advantage of bonus squares, and create longer words for maximum points.

Play the game online at: https://wnfaulkner.github.io/2023-10-05-project-1-scrabble-game/

## Next Steps

Functionality
* Check played words vs. a dictionary to verify they are playable Scrabble words. Instead of automatically checking every word, the interface should allow players to challenge one or more of the words formed by the last play.
* Players can select their own player names
* Add capacity to handle 2-4 players.
* Board visualization & scoring calculation includes double/triple letter and double/triple word bonuses
* Players can smoothly drag-n-drop letters onto the board with the mouse
* Scoreboard shows a score preview for the placed-but-not-submitted play
* Players can reorder the letters in their console before placing them on the board

Aesthetic Improvements:
* The win message could be in larger, more celebratory font!
* Better space buttons & messages so that they appear to the side of the board (more convenient on most wide-format monitors)
* Add a button to show/hide game instructions

## Planning Materials

### Planning Materials: MVP Goals
**Game Setup:**
* Render the game board
* Render a player console that displays all player scores, the current player's letter tray, and player controls

**User Interaction - players shall be able to:**
* Alternate turns
* During their turn:
    * Select seven initial letters (first turn only)
    * See their letters (and not the other player's letters) during their turn
    * Simulate their play by clicking letters and then clicking the board to place the letters, producing a preview of the play
    * Remove letters from the board
    * Submit their play and receive an informative message if the play is invalid:
        * does not connect with any words currently on the board
        * is not a playable word (according to an external dictionary)
    * Receive a set of new random letters from the letter 'bag' (they will not show up for the player until the player's next turn)
    * Perform tile exchanges once per turn (without placing anything on the board or scoring points)
    * End their turn
    * Skip their turn if they see no legal moves left
    * End the game if all previous players in the player order have skipped their turn because they see no legal moves left

**Scorekeeping & Winning Logic - the system shall:**
* On the first play, only allow horizontal plays covering the center square of the board 
* Update & display players' scores at the end of each turn
* Update & display the number of letters left in the letter bag
* End the game if all letters are played automatically
* At the end of game:
    * Calculate player final scores 
    * Determine the winner
    * Display a message congratulating the winner
    * Offer a button to initiate a new game



### Planning Materials: Stretch Goals

**Game Setup**
* Scoring calculation includes double/triple letter and double/triple word bonuses
* Allow three & four players (MVP will be set up for only two players)
* Players can select their own player names
* Letter 'bag' includes two blank 'wild cards'; when placed on the board during a play, a pop-up will allow the player to choose the letter to which the blank is assigned. Once chosen, the letter will render differently (lighter color text) to indicate they were wild cards and do not count for any points.


**User Interaction**
* Players can smoothly drag-n-drop letters onto the board with the mouse
* Scoreboard shows a score preview for the placed-but-not-submitted play
* Players can reorder the letters in their console before placing them on the board
* Helpful play instructions are provided for first-time players
* Players can save games and return to them later *(might be too much as it would require a login system?)*


**Winning Logic**
* Game automatically checks an official/updated scrabble dictionary using an API



### Planning Materials: Potential Roadblocks
* The play checking logic could get confusing as it will have to recognize which tiles have just been played vs. those that were on the board, check that the new tiles connect with those already played, determine all of the new words formed by the newly played tiles, and check them against a dictionary. I did find .txt versions of the dictionary [here](https://boardgames.stackexchange.com/questions/38366/latest-collins-scrabble-words-list-in-text-file).
* To get beyond using a built-in word list, the game may need to reference an external API to be able to check the official Scrabble Dictionary (assuming someone has made an open, online, machine-readable version somewhere), or actually go to a website (e.g. https://scrabble.merriam.com/), input word entries and scrape the website response?  