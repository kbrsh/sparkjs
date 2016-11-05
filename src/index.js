var Spark = {
  markov: markov,
  classifier: classifier
}

if(typeof window === 'undefined') {
  module.exports = Spark;
}
