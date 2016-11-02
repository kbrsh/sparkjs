function markov(opts) {
  this.sentence = [];
  this.map = {};
  this.starters = [];
  this.opts = opts;
}

markov.prototype.seed = function(data) {
  for (var i = 0; i < data.length; i++) {
    var words = this.toWords(data[i]);
    this.starters.push(words[0]);
    for (var j = 0; j < words.length; j++) {
      if (this.map.hasOwnProperty(words[j])) {
        this.map[words[j]].push(words[j + 1]);
      } else {
        this.map[words[j]] = [words[j + 1]];
      }
    }
  }
}

markov.prototype.randomElement = function(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

markov.prototype.toWords = function(str) {
  return str.split(" ");
}

markov.prototype.clear = function() {
  this.sentence = [];
  this.map = {};
  this.starters = [];
}

markov.prototype.train = function(data) {
  this.seed(data);
}

markov.prototype.generate = function() {
  var word = this.randomElement(this.starters);
  this.sentence.push(word);

  while(this.map.hasOwnProperty(word)) {
    var lastWord = this.sentence[this.sentence.length - 1];
    word = this.randomElement(this.map[lastWord]);
    this.sentence.push(word);
    if (this.sentence.length > (this.opts.min) && this.sentence.length < (this.opts.max) && this.map[lastWord] === [null]) break;
  }
  var readableSentence = this.sentence.join(" ");
  this.clear();
  return readableSentence;
}
