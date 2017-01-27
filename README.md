# Spark

AI In Javascript

### Get Started

```sh
npm install sparkai
```

```js
var Spark = require('sparkai');
```

### Documentation

**Markov Chains**

Spark comes built in with a Markov Chain generator.

Example:

```js
var Spark = require('sparkai');

var bot = new Spark.MarkovChain({
  sentences: 1 // number of sentences (default = 3)
});
bot.train(['some data', 'more data']); // can be an array, or a single string
console.log(bot.generate()); // generates text
```

### License

Licensed under the [MIT License](https://kingpixil.github.io/license)
