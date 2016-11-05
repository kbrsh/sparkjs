var Spark = {
  generator: generator,
  classifier: classifier
}

if(typeof window === 'undefined') {
  module.exports = Spark;
}
