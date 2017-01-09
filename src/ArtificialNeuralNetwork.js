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


function ArtificialNeuralNetwork(opts) {
	opts = opts || {};

  // Layer Sizes
	this.inputLayerSize = opts.inputLayerSize || 2;
  this.outputLayerSize = opts.outputLayerSize || 1;
  this.hiddenLayerSize = opts.hiddenLayerSize || 3;

  // Learning Rate
  this.rate = opts.rate || 0.7;

	// Weights for Synapses
  this.weights = {
  	inputToHidden: this.randMatrix(this.inputLayerSize, this.hiddenLayerSize),
    hiddenToOutput: this.randMatrix(this.hiddenLayerSize, this.outputLayerSize)
  }

  // Neuron States
  this.neurons = {
  	hiddenSum: 0,
    hidden: 0,
    outputSum: 0,
    output: 0
  }

}

ArtificialNeuralNetwork.prototype.randMatrix = function(rows, columns) {
	var m = [];
	for(var i = 0; i < rows; i++) {
  	var arr = [];
    for(var j = 0; j < columns; j++) {
    	arr.push(Math.random());
    }
    m.push(arr);
  }
  return m;
}

ArtificialNeuralNetwork.prototype.dot = function(matrix1, matrix2) {
	var result = [];
  for(var i = 0; i < matrix1.length; i++) {
  	result[i] = [];
    for(var j = 0; j < matrix2[0].length; j++) {
      var total = 0;
      for(var n = 0; n < matrix1[i].length; n++) {
        total += matrix1[i][n] * matrix2[n][j]
      }
      result[i].push(total)
    }
  }
	return result;
}

ArtificialNeuralNetwork.prototype.multiply = function(matrix1, matrix2) {
	var result = [];
  for(var i = 0; i < matrix1.length; i++) {
    result[i] = [];
    for(var j = 0; j < matrix1[i].length; j++) {
      var total = 0;
      total += matrix1[i][j] * matrix2[i][j]
      result[i].push(total)
    }
  }
	return result;
}

ArtificialNeuralNetwork.prototype.subtract = function(matrix1, matrix2) {
	var result = [];
  for(var i = 0; i < matrix1.length; i++) {
  	result[i] = [];
    for(var j = 0; j < matrix2[0].length; j++) {
    	var total = 0;
      for(var n = 0; n < matrix1[0].length; n++) {
      	total += matrix1[i][n] - matrix2[i][j];
      }
    	result[i].push(total);
    }
  }
	return result;
}

ArtificialNeuralNetwork.prototype.add = function(matrix1, matrix2) {
	var result = [];
  for(var i = 0; i < matrix1.length; i++) {
  	result[i] = [];
    for(var j = 0; j < matrix2[0].length; j++) {
    	var total = 0;
      for(var n = 0; n < matrix1[0].length; n++) {
      	total += matrix1[i][n] + matrix2[i][j];
      }
    	result[i].push(total);
    }
  }
	return result;
}

ArtificialNeuralNetwork.prototype.scalar = function(matrix, num) {
  for(var i = 0; i < matrix.length; i++) {
    for(var j = 0; j < matrix[i].length; j++) {
    	matrix[i][j] *= num;
    }
  }
	return matrix;
}

ArtificialNeuralNetwork.prototype.square = function(matrix) {
  for(var i = 0; i < matrix.length; i++) {
    for(var j = 0; j < matrix[i].length; j++) {
    	matrix[i][j] = Math.pow(matrix[i][j], 2);
    }
  }
	return matrix;
}

ArtificialNeuralNetwork.prototype.sum = function(matrix) {
	return matrix.reduce(function(all, row) {
  	return all + row.reduce(function(total, num) {
    	return total + num;
    }, 0);
  }, 0);
}

ArtificialNeuralNetwork.prototype.transpose = function(matrix) {
  return matrix[0].map(function(col, i) {
  	return matrix.map(function(row) {
    	return row[i] ;
  	})
	});
}

ArtificialNeuralNetwork.prototype.transform = function(m, fn) {
  for(var i = 0; i < m.length; i++) {
    var arr = m[i];
    m[i] = m[i].map(fn);
  }
  return m;
}

ArtificialNeuralNetwork.prototype.activate = function(arrs) {
	var activated = [];
	for(var i = 0; i < arrs.length; i++) {
  	activated[i] = [];
    for(var j = 0; j < arrs[i].length; j++) {
    	activated[i][j] = 1 / (1 + Math.exp(-arrs[i][j]));
    }
  }
  return activated;
}

ArtificialNeuralNetwork.prototype.deactivate = function(arrs) {
	var deactivated = [];
	for(var i = 0; i < arrs.length; i++) {
  	deactivated[i] = [];
    for(var j = 0; j < arrs[i].length; j++) {
    	deactivated[i][j] = Math.exp(-arrs[i][j]) / ((1 + Math.pow(Math.exp(-arrs[i][j]), 2)));
    }
  }
  return deactivated;
}

ArtificialNeuralNetwork.prototype.train = function(data) {
	// Move Inputs Through the Net (Forward Propogation)
  this.data = data;
  // Matrix of all Neurons in the Hidden Layer
	this.neurons.hiddenSum = this.dot(this.data.inputs, this.weights.inputToHidden);
  // Apply Activation
  this.neurons.hidden = this.activate(this.neurons.hiddenSum);
  // Matrix of all Nuerons in the Output Layer
  this.neurons.outputSum = this.dot(this.neurons.hidden, this.weights.hiddenToOutput);

  // Get Prediction after Applying Activation Function
  this.neurons.output = this.activate(this.neurons.outputSum);
}

ArtificialNeuralNetwork.prototype.cost = function() {
	return 0.5 * this.sum((this.square(this.subtract(this.data.inputs, this.neurons.output))));
}

ArtificialNeuralNetwork.prototype.adjust = function() {
	// Get Error Amount
	this.err = this.cost();

  var delta3 = this.multiply(this.scalar(this.subtract(this.data.outputs, this.neurons.output), -1), this.deactivate(this.neurons.outputSum));
  var dJdW2 = this.dot(this.transpose(this.neurons.output), delta3);
  var delta2 = this.multiply(this.dot(delta3, this.transpose(this.weights.hiddenToOutput)), this.deactivate(this.neurons.hiddenSum));

}

var NN = new ArtificialNeuralNetwork({

});

NN.train({inputs:[
	[1, 1],
  [0, 0]
], outputs:[
	[0],
  [1]
]});




p.innerHTML = JSON.stringify(NN, null, 2);

setTimeout(function() {
NN.adjust();
NN.train({inputs:[
	[1, 1],
  [0, 0]
], outputs:[
	[0],
  [1]
]})



p.innerHTML = JSON.stringify(NN, null, 2);
}, 500)
