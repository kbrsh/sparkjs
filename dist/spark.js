/*
* Spark v0.1.2
* Copyright 2016-2017, Kabir Shah
* https://github.com/KingPixil//
* Free to use under the MIT license.
* https://kingpixil.github.io/license
*/
(function(root, factory) {
  (typeof module === "object" && module.exports) ? module.exports = factory() : root.Spark = factory();
}(this, function() {
  /* ======= Global Spark ======= */
  var Spark = {
    MarkovChain: MarkovChain,
    NaiveBayes: NaiveBayes
  }

  var randomItemFromArray = function(arr) {
  	return arr[Math.floor(Math.random()*arr.length)];
  }
  
  function MarkovChain(data, opts) {
  	opts = opts || {};
  	this.data = data;
    this.map = {};
    this.frequency = {};
    this.lines = [];
    this.vocab = [];
    this.startWords = [];
    this.sentences = opts.sentences || 3;
    this.endWords = {};
    this.init();
  }
  
  MarkovChain.prototype.init = function() {
    this.lines = this.data.replace(/([.?!])\s*(?=[A-Z])/g, "$1|").split("|");
    for(var i = 0; i < this.lines.length; i++) {
    	var line = this.lines[i];
      var wordsOne = line.split(" ");
      var words = [];
      for(var j = 0; j < wordsOne.length; j+=2) {
        if(wordsOne[j+1]) {
          words.push(wordsOne[j] + " " + wordsOne[j+1]);
        } else {
          words.push(wordsOne[j]);
        }
      }
      this.startWords.push(words[0]);
      this.endWords[words[words.length - 1]] = true;
      for(var j = 0; j < words.length; j++) {
      	this.vocab.push(words[j]);
        if(!this.map[words[j]]) {
        	this.map[words[j]] = [words[j+1]];
        } else {
        	this.map[words[j]].push(words[j+1]);
        }
      }
    }
  }
  
  MarkovChain.prototype.generate = function(opts) {
    opts = opts || {};
    this.start = randomItemFromArray(this.startWords);
    if(opts.start) {
      var totalMatches = this.startWords.filter(function(item){
        return opts.start.test(item);
      });
      this.start = randomItemFromArray(totalMatches);
    }
    if(opts.end) {
      this.endWords = {};
      this.endWords[opts.end] = true;
    }
  	var currentWord = this.start;
    var sentenceCount = 0;
    var text = [currentWord];
    var i = 0;
    while(this.map.hasOwnProperty(currentWord)) {
    	i++;
    	var next = randomItemFromArray(this.map[currentWord]);
      text.push(next);
      currentWord = next;
      if(this.endWords.hasOwnProperty(next) || this.map[next] === [undefined] || /\\end\{.+\}/g.test(next)) sentenceCount++;
      if(sentenceCount === this.sentences) break;
    }
    return text.join(' ');
  }
  
  function NaiveBayes(opts) {
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
  
    NaiveBayes.getPriorProb = function(docs, total) {
    	return docs / total;
    }
  
    NaiveBayes.max = function(obj) {
    	return Object.keys(obj).reduce(function(a, b){ return obj[a] > obj[b] ? a : b });
    }
  
    NaiveBayes.toObj = function(arr) {
    	var obj = {};
    	for(var i = 0; i < arr.length; i++) {
      	obj[arr[i]] ? obj[arr[i]]++ : obj[arr[i]] = 1;
      }
      return obj;
    }
  
    NaiveBayes.getState = function() {
    	return {
      	vocab: this.vocab,
        totalVocab: this.totalVocab,
        documents: this.totalDocuments,
        totalDocs: this.totalDocs
      }
    }
  
  
    NaiveBayes.classify = function(text) {
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
  

  return Spark;
}));
