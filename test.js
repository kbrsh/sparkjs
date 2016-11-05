var spark = require("./dist/spark.min.js");

var bot = new spark.generator();

bot.train(["Hello World Dude"], "Hey How World Is Life");

console.log(bot.generate())
