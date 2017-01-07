(function(root, factory) {
  (typeof module === "object" && module.exports) ? module.exports = factory() : root.Spark = factory();
}(this, function() {
  /* ======= Global Spark ======= */
  var Spark = {
    MarkovChain: MarkovChain,
    NaiveBayes: NaiveBayes
  }

  //=require MarkovChain.js
  //=require NaiveBayes.js

  return Spark;
}));
