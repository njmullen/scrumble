

letters = ["l", "a", "e", "r", "p", "n", "y"]
key_letter = "l"

# Start nltk
# Use the following line if first time running
# nltk.download()
from nltk.corpus import words
from nltk.corpus import wordnet
from nltk.tag import pos_tag
import requests

setofwords = set(words.words())

x = 4
threads = []
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
print(words)
