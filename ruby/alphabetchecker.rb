text = File.read("text.txt")

def alphabet_checker(text)
  text.gsub!(/http.*\s/, " ")
  text.gsub!(/[^a-zA-Z"-]/, " ")
  text.gsub!(/[-"]/, "")
  text.gsub!(/\s{2,}/, " ")

  text_length = text.length
  words = text.split(" ")
  characters = text.split("")
  number_of_words = words.length

  alphabet = {
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

  def longest_word(words)
    long_word = ""
    word_list = []
    words.each { |word|
      if word.length > long_word.length
        long_word = word
        word_list = [word]
      elsif word.length == long_word.length
        word_list.push(word)
      end
    }

    return word_list
  end

  def print_longest_word(words)
    longest_words = longest_word(words)
    if longest_words.length == 1
      word = longest_words[0]
      return word
    else
      word = ""
      longest_words.each { |current_word| word += "#{current_word}, "}
      return word
    end
  end

  def shortest_word(words)
    short_word = longest_word(words)[0]
    word_list = []
    words.each { |word|
      if word.length < short_word.length
        short_word = word
        word_list = [word]
      elsif word.length == short_word.length
        word_list.push(word)
      end
    }

    if word_list.length == 1
      word = word_list[0]
      return word
    else
      word = ""
      word_list.each { |current_word| word += "#{current_word}, "}
      return word
    end
  end

  def text_to_alphabet(text, alphabet)
    for i in 0..text.length do
      if /[a-zA-Z]/.match?(text[i])
        lower_text = text[i].downcase
        alphabet[lower_text.to_sym] += 1
      end
    end
  end

  text_to_alphabet(text, alphabet)

  def most_letters(alphabet)
    times_letter_used = 0
    letter_list = []

    alphabet.each { |letter, property|
      if property > times_letter_used
        letter_list = [letter.to_s]
        times_letter_used = property
      elsif property == times_letter_used && times_letter_used > 0
        letter_list.push(letter.to_s)
      end
    }

    return letter_list
  end

  def print_most_letters(alphabet)
    letter_list = most_letters(alphabet)
    letter = ""

    if letter_list.length == 1
      letter += letter_list[0]
      return letter
    else
      letter_list.each { |current_letter| letter += "#{current_letter}, "}
      return letter
    end
  end

  def least_letters(alphabet)
    times_letter_used = alphabet[most_letters(alphabet)[0].to_sym]
    letter_list = []

    alphabet.each { |letter, property|
      if property < times_letter_used && property != 0
        letter_list = [letter.to_s]
        times_letter_used = property
      elsif property == times_letter_used && times_letter_used > 0
        letter_list.push(letter.to_s)
      end
    }

    return letter_list
  end

  def print_least_letters(alphabet)
    letter_list = least_letters(alphabet)
    letter = ""

    if letter_list.length == 1
      letter += letter_list[0]
      return letter
    else
      letter_list.each { |current_letter| letter += "#{current_letter}, "}
      return letter
    end
  end

  def alphabet_check(alphabet)
    count = 0

    alphabet.each { |letter, property|
      if property > 0
        count += 1
      end
    }

    return count
  end

  def unused_letters(alphabet)
    letter_list = []
    alphabet.each { |letter, property|
      puts "#{letter}: #{property}"
      if property == 0
        letter_list.push(letter.to_s)
      end
    }

    return letter_list
  end

  def print_unused_letters(alphabet)
    letter_list = unused_letters(alphabet)
    letter = ""

    if letter_list.length == 1
      letter += letter_list[0]
      return letter
    else
      letter_list.each { |current_letter| letter += "#{current_letter}, "}
      return letter
    end
  end

  alpha_result = ""
  alpha_result += "All non-alphabetic characters have been removed from your comment and the following statistics have been revealed:\n\n"
  alpha_result += "The text is **#{text_length}** characters in length\n\n"
  alpha_result += "The text contains **#{number_of_words}** words\n\n"
  alpha_result += "The longest word(s) is/are **#{print_longest_word(words)}** at #{longest_word(words)[0].length} characters in length\n\n"
  alpha_result += "The most used letters are: **#{print_most_letters(alphabet)}**\n\n"
  alpha_result += "The least used letters are: **#{print_least_letters(alphabet)}**\n\n"
  if alphabet_check(alphabet) == 26
    alpha_result += "The text contains **every** letter of the alphabet!"
  else
    alpha_result += "The text contains **#{alphabet_check(alphabet)}/26** letters of the alphabet\n\n"
    alpha_result += "The following letters weren't used: **#{print_unused_letters(alphabet)}**\n\n&nbsp\n\n"
  end

  puts alpha_result
end

alphabet_checker(text)
