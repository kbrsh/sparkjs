/*
* Spark v0.0.0
* Copyright 2016, Kabir Shah
* https://github.com/KingPixil//
* Free to use under the MIT license.
* https://kingpixil.github.io/license
*/
var Spark = {
  markov: markov,
  classifier: classifier
}

function classifier() {
  this.data = {};
  this.total = 0;
  this.vocab = [];
  this.frequency = {};
  this.confidence = 0;
}
classifier.prototype.train = function(label, text) {
  var words = text.split(/[\s]/gi);
  if (!this.data[label]) {
    this.data[label] = {
      words: words,
      frequency: {},
      total: 1
    };
  } else {
    this.data[label].words.push.apply(this.data[label].words, words);
    this.data[label].total++;
  }
  this.total += words.length;
}

classifier.prototype.seed = function() {
  for (var label in this.data) {
    var category = this.data[label];

    category.prior = category.words.length / this.total;

    for (var word in category.words) {
      if (!category.frequency[category.words[word]]) {
        category.frequency[category.words[word]] = 1;
      } else {
        category.frequency[category.words[word]]++;
      }

      if (this.vocab.indexOf(category.words[word]) === -1) {
        this.vocab.push(category.words[word]);
      }

      if (!this.frequency[category.words[word]]) {
        this.frequency[category.words[word]] = 1;
      } else {
        this.frequency[category.words[word]]++;
      }
    }

    var uniqueWords = category.words.filter(function(item, pos) {
      return category.words.indexOf(item) == pos;
    });
    category.words = uniqueWords;

  }
}

classifier.prototype.classify = function(text) {
  var choice = null;
  var prob = 0;
  var max = 0;
  var words = text.split(/[\s]/gi);
  this.seed();

  for (var i = 0; i < words.length; i++) {
    var word = words[i];

    for (var category in this.data) {
      if (this.data[category].frequency[word]) {
        prob += ((this.data[category].frequency[word] / this.data[category].total) * (this.data[category].prior)) / (this.frequency[word] / this.total)
      } else {
        prob += (1 - this.data[category].prior);
      }
      if (prob > max) {
        max = prob;
        prob = 0;
        choice = category;
      }
    }

  }
  return choice;
}

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
