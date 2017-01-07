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
