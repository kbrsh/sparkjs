function markov(opts) {
  this.sentence = [];
  this.map = {};
  this.starters = [];
  this.opts = opts;
}

markov.prototype.seed = function(data) {
  for (var i = 0; i < data.length; i++) {
    var words = toWords(data[i]);
    this.starters.push(words[0]);
    for (var j = 0; j < words.length; j++) {
      if (map.hasOwnProperty(words[j])) {
        map[words[j]].push(words[j + 1]);
      } else {
        map[words[j]] = [words[j + 1]];
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

markov.prototype.generate = function(data) {

  this.seed(data);
  var word = this.randomElement(this.starters);
  this.sentence.push(word);

  while(map.hasOwnProperty(word)) {
    var lastWord = this.sentence[this.sentence.length - 1];
    word = this.randomElement(map[lastWord]);
    this.sentence.push(word);
    if (this.sentence.length > (this.opts.min) && this.sentence.length < (this.opts.max) && map[lastWord] === [null]) break;
  }
  var readableSentence = this.sentence.join(" ");
  this.clear();
  return readableSentence;
}
