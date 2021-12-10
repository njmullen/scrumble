import itertools
import json
import nltk
import random
import os
import threading
import requests
from datetime import datetime

all_words = []

def generate_matches(letters, num_letters):
    words = []
    print("Searching: " + str(num_letters))
    permutations = list(itertools.product(letters, repeat=num_letters))
    for perm in permutations:
        if key_letter in perm and (('a' in perm) or ('e' in perm) or ('i' in perm) or ('o' in perm) or ('u' in perm)):
            word = ''
            for y in perm:
                word += y
            if word.lower() in setofwords:
                syns = wordnet.synsets(word)
                if len(syns) > 0:
                    words.append({"word": word, "definition": syns[0].definition(), "score": len(word)})
                    total_score += len(word)
                else:
                    print("! Word not found: " + word)
    all_words.append(words)


# For each puzzle use:
#   - 1 key letter from common letters
#   - 2 vowels
#   - 2 common letters
#   - 2 remaining letters
vowels = ['a', 'e', 'i', 'o', 'u']
common_letters = ['r', 'n', 't', 'l', 'c', 'd', 'g', 'p', 'm']
remaining_letters = ['h', 'b', 'y', 'f', 'v', 'k', 'w', 'z', 'x', 'j', 'q']
games = []

# Make 20 puzzles
count = 0
while count < 20:
    # Add a key letter from common letters
    key_letter = random.choice(common_letters)
    letters = []
    letters.append(key_letter)

    # Get 2 vowels
    while len(letters) < 3:
        letter = random.choice(vowels)
        if letter not in letters:
            letters.append(letter)

    # Get 2 common letters
    while len(letters) < 6:
        letter = random.choice(common_letters)
        if letter not in letters:
            letters.append(letter)

    # Get 2 remaining letters
    while len(letters) < 7:
        letter = random.choice(remaining_letters)
        if letter not in letters:
            letters.append(letter)

    print("Generating puzzle with the following letters: ")
    print(letters)

    # Start nltk
    # Use the following line if first time running
    # nltk.download()
    from nltk.corpus import words
    from nltk.corpus import wordnet
    setofwords = set(words.words())

    words = []
    total_score = 0

    for word in setofwords:
        # Check that only these letters appear in the word
        fail = False

        # If word is < 4 characters, fail
        if len(word) < 4:
            fail = True
        else:
            if key_letter not in word:
                fail = True
            else:
                for letter in word:
                    if letter not in letters:
                        fail = True
                        break

        # If this word passed, double-check and add to list
        if not fail:
            syns = wordnet.synsets(word)

            if len(syns) > 0:
                # Check dictionary API
                url = 'https://api.dictionaryapi.dev/api/v2/entries/en/' + word
                response = requests.get(url)
                if response.status_code == 200:
                    words.append({"word": word, "definition": syns[0].definition(), "score": len(word)})
                    total_score += len(word)
                else:
                    print("! Word rejected: " + word)
            else:
                print("! Word not found: " + word)

    # Sort the words by score
    words = sorted(words, key=lambda k: k['score'])

    # Create puzzle ID
    puzzle_id = key_letter
    for letter in letters:
        puzzle_id += letter

    output = {}
    output['total_score'] = total_score
    output['key_letter'] = key_letter
    output['puzzle_id'] = puzzle_id
    output['letters'] = letters
    output['words'] = words

    puzzle_title = 'puzzle_' + str(total_score)
    for letter in letters:
        puzzle_title += '_' + letter
    puzzle_title += '.json'

    # Determine the save path based on the score
    # if total_score < 100:
    #     save_path = 'puzzles_under_100'
    # elif total_score >= 100 and total_score < 200:
    #     save_path = 'puzzles_under_200'
    # else:
    #     save_path = 'puzzles_over_200'
    # total_path = os.path.join(save_path, puzzle_title)
    # with open(total_path, 'w') as fp:
    #     json.dump(output, fp)

    # Check the score, if it's over 100, include it
    if total_score > 100:
        print("Adding puzzle. Score: " + str(total_score))
        games.append(output)
        count += 1

# Write out the games
path = 'games.json'
with open(path, 'w') as fp:
    json.dump(games, fp)

