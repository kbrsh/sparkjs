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

  function MarkovChain(opts) {
  	opts = opts || {};
    this.map = opts.map || {};
    this.vocab = opts.vocab || [];
    this.startWords = opts.startWords || [];
    this.sentences = opts.sentences || 3;
    this.endWords = opts.endWords || {};
  	this.seperator = opts.seperator || " ";
  }
  
  MarkovChain.prototype.train = function(data) {
  	if(data.constructor === Array) {
  		for(var i = 0; i < data.length; i++) {
  			this.train(data[i]);
  		}
  		return;
  	}
  
  	var blocks = data.split(this.seperator);
  	this.startWords.push(blocks[0]);
  	this.endWords[blocks[blocks.length - 1]] = true;
  
  	for(var i = 0; i < blocks.length; i++) {
  		var block = blocks[i];
  		var nextBlock = blocks[i + 1];
  		this.vocab.push(block);
  
  		if(nextBlock) {
  			if(!this.map[block]) {
  				this.map[block] = [nextBlock];
  			} else {
  				this.map[block].push(nextBlock);
  			}
  		}
  	}
  }
  
  MarkovChain.prototype.randomElement = function(arr) {
  	return arr[Math.floor(Math.random()*arr.length)];
  }
  
  MarkovChain.prototype.getBlock = function() {
  	var word = this.randomElement(this.startWords);
  	var block = [word];
  	while(!this.endWords[word]) {
  		word = this.randomElement(this.map[word]);
  		block.push(word);
  	}
  	return block.join(this.seperator);
  }
  
  MarkovChain.prototype.generate = function() {
  	var block = [];
  	for(var i = 0; i < this.sentences; i++) {
  		block.push(this.getBlock());
  	}
  	return block.join(this.seperator);
  }
  
  MarkovChain.prototype.getState = function() {
  	return this;
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
