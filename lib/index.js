
const options = require("../simpleWebpack.config");

const Compiler = require("./compiler");

let compiler = new Compiler(options);

compiler.run();

