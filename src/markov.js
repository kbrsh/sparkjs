function markov(opts) {
  var sentence = [];
  var map = {};
  var starters = [];
}

markov.prototype.seed(data) {
  for (var i = 0; i < data.length; i++) {
    var words = toWords(data[i]);
    starters.push(words[0]);
    for (var j = 0; j < words.length; j++) {
      if (map.hasOwnProperty(words[j])) {
        map[words[j]].push(words[j + 1]);
      } else {
        map[words[j]] = [words[j + 1]];
      }
    }
  }
}

markov.prototype.randomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

markov.prototype.toWords(str) {
  return str.split(" ");
}

markov.prototype.clear() {
  sentence = [];
  map = {};
  starters = [];
}

markov.prototype.generate(data, opts) {

  seed(data);
  var word = randomElement(starters);
  sentence.push(word);

  while(map.hasOwnProperty(word)) {
    var lastWord = sentence[sentence.length - 1];
    word = randomElement(map[lastWord]);
    sentence.push(word);
    if (sentence.length > (opts.min) && sentence.length < (opts.max) && map[lastWord] === [null]) break;
  }
  var readableSentence = sentence.join(" ");
  clear();
  return readableSentence;
}
