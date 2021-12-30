
const { getAST, getDependencies, transform } = require('./parser')

const path = require('path');

module.exports = class Compiler {

    constructor(options) {
        const { entry, output } = options;
        this.entry = entry;
        this.output = output;
    }

    run() {
        const entryModule = this.buildModule(this.entry, true);
    }

    buildModule(filename, isEntry = false) {
        let ast;

        if(isEntry) {
            // filename在配置文件中是绝对路径
            ast = getAST(filename);
        } else {
            // 如果不是入口文件需要将相对路径转变为绝对路径
            ast = getAST(path.join(process.cwd(), 'src', filename));
        }
    }

    emitFiles() {

    }
}