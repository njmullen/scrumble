# Scrumble

Scrumble is a word game where the goal is to make as many words as possible from a set of letters. All words must include the "key" letter and have at least 4 total letters.

Scrumble is written in React and the puzzles are generated in Python. To generate the puzzles, a key letter is chosen from a set of common letters. Then, the remaining 6 letters include: 2 vowels, 2 common letters, and 2 other consonants. Those letters are then run through two separate dictionary APIs to filter for words that contain at least 4 characters and aren't proper nouns. The score is calculated by counting each letter in the possible words that can be made. Puzzles with a total score of 100 or more are accepted. 

## Problems, Suggestions, Comments?

Open an issue or visit my website, https://njmullen.com/ to report feedback.
