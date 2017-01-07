function ArtificialNeuralNetwork(opts) {
	this.opts = opts;
	this.inputs = {};
  this.output = opts.output;
  this.iterations = opts.iterations || 10;
  this.layers = 1;
  this.neuronCount = 3;
  this.sum = 0;
  this.loss = 0;
  this.state = 0;
  this.neurons = {};
  this.init();
}

ArtificialNeuralNetwork.prototype.init = function() {
	for(var i = 0; i < this.opts.inputs.length; i++) {
  	var input = this.opts.inputs[i];
    this.inputs[i] = {
    	value: input,
      weight: {}
    }
    for(var j = 0; j < this.neuronCount; j++) {
    	this.inputs[i].weight[j] = Math.random();
      this.neurons[j] = {value: 0, weight: Math.random()};
    }
  }

  for(var i = 0; i < this.iterations; i++) {
  	this.train();
  }
}

ArtificialNeuralNetwork.prototype.synapse = function(value, weight) {
	return value * weight;
}

ArtificialNeuralNetwork.prototype.activate = function(val) {
	return 1/(1+Math.exp(-val));
}

ArtificialNeuralNetwork.prototype.deactivate = function(val) {
	return this.activate(val) * (1 - this.activate(val));
}

ArtificialNeuralNetwork.prototype.back = function() {
	this.loss = this.output - this.state;

  // Calculate new weights for Neurons -> Output
  var deltaOutput = this.deactivate(this.sum) * this.loss;

  for(var i = 0; i < this.neuronCount; i++) {
  	var neuron = this.neurons[i];
    neuron.weight += deltaOutput / neuron.value;
  }

  // Calculate new weights for Inputs -> Neurons
  for(var input in this.inputs) {
  	input = this.inputs[input];
    var deltaHidden = deltaOutput / input.value;
    if(deltaHidden === Infinity || deltaHidden === -Infinity) deltaHidden = 0;
    for(var i = 0; i < this.neuronCount; i++) {
    	input.weight[i] += deltaHidden * this.deactivate(this.neurons[i].sum);
    }
  }
}

ArtificialNeuralNetwork.prototype.train = function() {
	for(var i = 0; i < this.neuronCount; i++) {
  	var neuron = this.neurons[i];
  	for(var input in this.inputs) {
    	input = this.inputs[input];
      neuron.value += this.synapse(input.value, input.weight[i]);
    }
    neuron.sum = neuron.value;
    neuron.value = this.activate(neuron.value);
    this.state += this.synapse(neuron.value, neuron.weight);
  }
  this.sum = this.state;
  this.state = this.activate(this.sum);
  this.back();
}

ArtificialNeuralNetwork.prototype.predict = function(inputs) {
	for(var i = 0; i < this.opts.inputs.length; i++) {
    this.inputs[i].value = inputs[i];
  }
  return this.state;
}
