const fs = require('fs');

// //Takes text as a parameter and runs various operations on it
function alphabetChecker(text) {
  console.log(text);
  //Replace anything that isn't a letter, apostrophe or hyphen with whitespace.
  //Then, replace any hypen or apostrophe with empty string, in order to keep
  //words together. Replace any instances of two or more whitespace, with a
  //singular white space. Finally, trim the text of surroung whitespace

// Constants for regex
const removeUrl = /http.*\s/g;
const removeNonLettersAndSuch = /[^a-zA-Z'-]/g;
const removeHyphensAndApostrophes = /[-']/g;
const removeExtraWhitespace = /\s{2,}/g

  text = text.replace(removeUrl, ' ')
    .replace(removeNonLettersAndSuch, ' ')
    .replace(removeHyphensAndApostrophes, '')
    .replace(removeExtraWhitespace, ' ')
    .trim();

  //Variable holding the length of the text AKA how many characters there are
  const textLength = text.length;
  //Variable holding an array of the text separated by whitespace
  const words = text.split(' ');
  //Variable holding an array of each character of the text
  const characters = text.split('');
  //Variable holding the length of the words array AKA how many words there are
  const numberOfWords = words.length;

  // Creates a spot for each letter of the alphabet and sets
  // their default count to 0
  const alphabet = {
    a: 0,
    b: 0,
    c: 0,
    d: 0,
    e: 0,
    f: 0,
    g: 0,
    h: 0,
    i: 0,
    j: 0,
    k: 0,
    l: 0,
    m: 0,
    n: 0,
    o: 0,
    p: 0,
    q: 0,
    r: 0,
    s: 0,
    t: 0,
    u: 0,
    v: 0,
    w: 0,
    x: 0,
    y: 0,
    z: 0,
  }

  //Finds the longest word in the words array
  const longestWord = function(words) {
    let longWord = "";
    let wordList = [];
    words.forEach(function(word) {
      if(word.length > longWord.length) {
        longWord = word;
        wordList = [word];
      }
      else if (word.length === longWord.length) {
        wordList.push(word);
      }
    })

    return wordList;
  }

  //Finds the shortest word in the words array
  const shortestWord = function(words) {
    let shortWord = longestWord()[0];
    let wordList = [];
    words.forEach(function(word) {
      if(word.length < shortWord.length) {
        shortWord = word;
        wordList = [word];
      }
      else if (word.length === shortWord.length) {
        wordList.push(word);
      }
    })

    return wordList;
  }

  const textToAlphabet = function(text, alphabet) {

    for(i = 0; i < text.length; i++) {
      if(text[i].match(/[a-zA-Z]/g)) {
        alphabet[text[i].toLowerCase()] += 1;
      }
    }
  }

  textToAlphabet(text, alphabet);

  //Checks the most used letter from the body of text
  const mostLetters = function(alphabet) {
    let timesLetterUsed = 0;
    let letterList = [];

    const isEqualToTimesLetterUsed = (property) => {
      return property === timesLetterUsed
    }

    for(let property in alphabet) {
      if(alphabet[property] > timesLetterUsed) {
        letterList = [property.toString()];
        timesLetterUsed = alphabet[property];
      }
      else if (isEqualToTimesLetterUsed(alphabet[property]) && timesLetterUsed > 0) {
        letterList.push(property.toString());
      }
    }
    return letterList;
  }

  //Checks the least used letter from the body of text
  //Doesn't include letters that were not used at all
  const leastLetters = function(alphabet) {
    let timesLetterUsed = alphabet[mostLetters(alphabet)[0]];
    let letterList = [];
    for(let property in alphabet) {
      if(alphabet[property] < timesLetterUsed && alphabet[property] !== 0) {
        letterList = [property.toString()];  // no to string
        timesLetterUsed = alphabet[property];
      }
      else if (alphabet[property] === timesLetterUsed) {
        letterList.push(property.toString());
      }
    }

    return letterList;
  }

  //Checks to see if every letter of the alphabet has been used
  const alphabetCheck = function(alphabet) {
    let count = 0;

    for(let property in alphabet) {
      if(alphabet[property] > 0) {
        count++;
      }
    }

    return count;
  }

  // Sorts through alphabet to see which letters have not been
  // used at all
  const unusedLetters = function(alphabet) {
    let letterList = [];
    for(let property in alphabet) {
      if(alphabet[property] === 0) {
        letterList.push(property.toString());
      }
    }
    return letterList;
  }

  // Reads the statistics file, splits by commas, turns it into
  // an object and returns it
  getStats = function() {
    let currentStats = fs.readFileSync('./statistics.txt', 'UTF8');
    console.log(currentStats);
    const statsArray = currentStats.split(',');
    let statsObj = {};

    for(let i = 0; i < statsArray.length - 1; i += 2) {
      statsObj[statsArray[i]] = parseInt(statsArray[i+1]);
    }

    return statsObj;
  }

  // Compares the stats object to the alphabet object, then
  // adds the two together and writes the new data to the
  // statistics file
  updateStats = function(stats, alphabet) {
    for(let property in stats) {
      stats[property] += alphabet[property];
    }

    let alphaStats = '';

    for(let property in stats) {
      alphaStats += property + ',' + stats[property] + ',';
    }

    console.log(alphaStats);

    fs.writeFileSync('./statistics.txt', alphaStats, 'UTF8');
  }

  let alphaResult = '';
  alphaResult += 'All non-alphabetic characters have been removed from your comment and the following statistics have been revealed:\n\n';
  alphaResult += 'The text is **' + textLength + '** characters in length\n\n';
  alphaResult += 'The text contains **' + numberOfWords + '** words\n\n';
  //console.log(shortestWord());
  if(longestWord(words).length === 1) {
    alphaResult += 'The longest word is **' + longestWord(words) + '** at ' + longestWord(words)[0].length + ' characters in length\n\n';
  }
  else if(longestWord(words).length > 1) {
    alphaResult += 'The longest words are **' + longestWord(words) + '** at ' + longestWord(words)[0].length + ' characters in length\n\n';
  }
  alphaResult += 'The most used letters are: **' + mostLetters(alphabet) + '**\n\n';
  alphaResult += 'The least used letters are: **' + leastLetters(alphabet) + '**\n\n';
  if(alphabetCheck(alphabet) === 26) {
    alphaResult += 'The text contains **every** letter of the alphabet!';
  }
  else {
    alphaResult += 'The text contains **' + alphabetCheck(alphabet) + '/26** letters of the alphabet\n\n';
    alphaResult += 'The following letters weren\'t used: **' + unusedLetters(alphabet) + '**\n\n&nbsp;\n\n';
  }

  stats = getStats();
  updateStats(stats, alphabet);
  console.log(alphaResult);
  return alphaResult;
}

module.exports = alphabetChecker;
