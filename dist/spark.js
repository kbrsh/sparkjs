/*
* Spark v0.1.1
* Copyright 2016, Kabir Shah
* https://github.com/KingPixil//
* Free to use under the MIT license.
* https://kingpixil.github.io/license
*/
var Spark = {
  generator: generator,
  classifier: classifier
}

if(typeof window === 'undefined') {
  module.exports = Spark;
}

function Classifier(opts) {
	this.opts = opts || {};
	this.vocab = {};
  this.totalVocab = {};
  this.documents = {};
  this.totalDocs = 0;
	this.train = function(doc, label) {
  	var words = doc.split(" ");
    this.totalDocs++;
  	if(!this.vocab[label]) {
    	this.vocab[label] = {};
    }
    if(!this.documents[label]) {
    	this.documents[label] = 1;
    } else {
    	this.documents[label]++;
    }

    if(!this.totalVocab[label]) {
    	this.totalVocab[label] = 0;
    }

    for(var i = 0; i < words.length; i++) {
     var word = words[i];
     this.totalVocab[label]++;
     if(this.vocab[label][word] === undefined) {
     		this.vocab[label][word] = 1;
     } else {
       	this.vocab[label][word]++;
     }
    }
  }

  this.getPriorProb = function(docs, total) {
  	return docs / total;
  }

  this.max = function(obj) {
  	return Object.keys(obj).reduce(function(a, b){ return obj[a] > obj[b] ? a : b });
  }

  this.toObj = function(arr) {
  	var obj = {};
  	for(var i = 0; i < arr.length; i++) {
    	obj[arr[i]] ? obj[arr[i]]++ : obj[arr[i]] = 1;
    }
    return obj;
  }

  this.getState = function() {
  	return {
    	vocab: this.vocab,
      totalVocab: this.totalVocab,
      documents: this.totalDocuments,
      totalDocs: this.totalDocs
    }
  }


  this.classify = function(text) {
  	var chances = {};
    var words = this.toObj(text.split(" "));

  	for(var label in this.vocab) {
    	var prior = this.getPriorProb(this.documents[label], this.totalDocs);
    	chances[label] = prior;
      for(var word in this.vocab[label]) {
      	if(words[word]) {
        	chances[label] *= (this.vocab[label][word] + 1) / (this.documents[label] + this.totalVocab[label]);
        } else {
        	chances[label] *= 1 - ((this.vocab[label][word] + 1) / (this.documents[label] + this.totalVocab[label]));
        }
      }

      chances[label] = (chances[label] / prior) + ((1 - chances[label])*(1 - prior));
    }
    var choice = this.max(chances);
  	return this.opts.verbose ? {confidence: chances, choice: choice} : choice;
  }
}

function generator(opts) {
  this.sentence = [];
  this.map = {};
  this.starters = [];
  this.opts = opts || {
    min: 2,
    max: 5
  };
}

generator.prototype.seed = function(data) {
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

generator.prototype.randomElement = function(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

generator.prototype.toWords = function(str) {
  return str.split(" ");
}

generator.prototype.clear = function() {
  this.sentence = [];
}

generator.prototype.train = function(data) {
  this.seed(data);
}

generator.prototype.generate = function() {
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
