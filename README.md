![Scrabble Logo](https://logodix.com/logo/2057532.png)

# Play the a classic word game Scrabble! 
Scrabble is a game that combines vocabulary knowledge, word formation, and strategy. The main objective of Scrabble is to create words on the game board and score points based on the letters used and their placement. There are 100 letter tiles, each with a letter and a point value. The game board is a square grid with various special squares that offer bonus points for letter or word placement.

## Gameplay:

* Players draw seven letter tiles from a bag to start the game.
* Players take turns forming words on the game board. Words can be placed horizontally or vertically, and they must connect to existing words on the board.
* Players earn points for the letters they use, with each letter having its own point value. Special squares on the board, such as Double or Triple Letter Score, can multiply the points for specific letters or words.
* Players replenish their letter tiles after each turn to maintain a certain number of tiles on their rack.
* The game continues until all letter tiles have been used, or no more legal plays can be made. The player with the highest score at the end of the game wins.

Scrabble involves strategic thinking and word-building skills. Players aim to use high-value letters, take advantage of bonus squares, and create longer words for maximum points.

## Tech Stack
Standard DOM Architecture:
* HTML & CSS for rendering & styling
* JavaScript for user interactivity, scoring, and win logic


## Wireframes



## MVP Goals

**Game Setup:**
* Render the game board
* Render a player console that reacts dynamically with user input

**User Interaction - users shall be able to:**
* Alternate turns
* During their turn:
    * Select seven initial letters (first turn only)
    * See their letters (and not the other player's letters) during their turn
    * Simulate their play by clicking letters and then clicking the board to place the letters, producing a preview of the play
    * Remove letters from the board
    * Submit their play and receive an informative message if the play is invalid:
        * does not connect with any words currently on the board
        * is not a playable word (according to an external dictionary)
    * Perform tile exchanges once per turn (without placing anything on the board or scoring points)
    * End their turn
    * Skip their turn if they see no legal moves left
    * End the game if all previous players in the player order have skipped their turn because they see no legal moves left

**Scorekeeping & Winning Logic - the system shall:**
* Update players' scores at the end of each turn
* Display all players' current scores
* End the game if all letters are played and:
    * Calculate final scores & determine the winner
    * Display a message congratulating the winner
    * Initiate a new game

## Stretch Goals

**Game Setup**
* Allow 3 & 4 players (MVP will be set up for only 2 players)
* Players can select their own player names
* Letter 'bag' includes blank letters; when placed on the board during a play, a pop-up will allow the user to choose the letter to which the blank is assigned. Once chosen, the letter will render differently

**User Interaction**
* A
* Players can reorder the letters in their console
* Users can save games and return to them later *(might be too much as it would require a login system?)*


Winning Logic
* Game automatically checks an official/updated scrabble dictionary using an API

## Potential Roadblocks
* The play checking logic could get confusing as it will have to recognize which tiles have just been played vs. those that were on the board, check that the new tiles connect with those already played, determine all of the new words formed by the newly played tiles, and check them against a dictionary. I did find .txt versions of the dictionary [here][https://boardgames.stackexchange.com/questions/38366/latest-collins-scrabble-words-list-in-text-file].
* To get beyond using a built-in word list, the game may need to reference an external API to be able to check the official Scrabble Dictionary (assuming someone has made an open, online, machine-readable version somewhere), or actually go to a website (e.g. https://scrabble.merriam.com/), input word entries and scrape the website response?  