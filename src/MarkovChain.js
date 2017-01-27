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
