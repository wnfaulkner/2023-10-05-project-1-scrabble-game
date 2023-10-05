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

### Game Setup:
* Render the game board
* Render a player console that reacts dynamically with user input

**User Interaction - users shall be able to:**
* Initiate a new game
* Alternate turns
* During their turn:
    * Select seven initial letters (first turn only)
    * See their letters (and not the other player's letters) during their turn
    * Place their letters on the board
    * Perform tile exchanges once per turn (without placing anything on the board or scoring points)
    * End their turn

Scorekeeping & Winning Logic - the system shall:
* Update players' scores at the end of each turn
* Display current players' scores
*  

## Stretch Goals
Game Setup
* Allow 3 & 4 players (MVP will be set up for only 2 players)
* Players can select their own player names

User Interaction
*


Winning Logic
* Game automatically checks a scrabble dictionary 

## Potential Roadblocks
* To get beyond using a built-in word list, the game may need to reference an external API to be able to check the official Scrabble Dictionary (assuming someone has made an open, online, machine-readable version somewhere), or actually go to a website (e.g. https://scrabble.merriam.com/), input word entries and scrape the website response?  