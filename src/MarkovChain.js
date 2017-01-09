var randomItemFromArray = function(arr) {
	return arr[Math.floor(Math.random()*arr.length)];
}

function MarkovChain(opts) {
	opts = opts || {};
	this.data = data;
  this.map = {};
  this.frequency = {};
  this.lines = [];
  this.vocab = [];
  this.startWords = [];
  this.sentences = opts.sentences || 3;
  this.endWords = {};
}

MarkovChain.prototype.train = function(data) {
	this.data = data;
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
