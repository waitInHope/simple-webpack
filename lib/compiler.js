
const { getAST, getDependencies, transform } = require('./parser')

const path = require('path');
const fs = require('fs');

module.exports = class Compiler {

    constructor(options) {
        const { entry, output } = options;
        this.entry = entry;
        this.output = output;
        this.modules = [];
    }

    run() {
        const entryModule = this.buildModule(this.entry, true);

        this.modules.push(entryModule);
        this.modules.map((_module) => {
            _module.dependencies.map((_dependency) => {
                this.modules.push(this.buildModule(_dependency, false));
            })
        })

        // console.log(this.modules);

        this.emitFiles()
    }

    buildModule(filename, isEntry = false) {
        let ast;

        if(isEntry) {
            // filename在配置文件中是绝对路径
            ast = getAST(filename);
        } else {
            // 如果不是入口文件需要将相对路径转变为绝对路径
            let absolutePath = path.join(process.cwd(), 'src', filename);
            ast = getAST(absolutePath);
        }

        return {
            filename,
            dependencies: getDependencies(ast),
            source: transform(ast)
        }
    }

    emitFiles() {
        const outputPath = path.join(this.output.path, this.output.filename);

        let modules = '';
        this.modules.map((_module) => {
            modules += `'${_module.filename}': function(require, module, exports) {${_module.source}},`
        })

        const bundle = `(function(modules) {
            function require(filename) {
                var fn = modules[filename];
                var module = {
                    exports: {}
                }

                fn(require, module, module.exports)

                return module.exports
            }

            require('${this.entry}');
        })({ ${modules} })`;

        // console.log('bundle.js', bundle);

        fs.writeFileSync(outputPath, bundle, 'utf-8');
    }
}