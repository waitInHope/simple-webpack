
const babylon = require('babylon');
const fs = require('fs');
const traverse = require('babel-traverse').default;
const { transformFromAst } = require('babel-core');

module.exports = {

    getAST: (path) => {
        const sourceCode = fs.readFileSync(path, 'utf-8');

        return babylon.parse(sourceCode, {
            sourceType: 'module'
        });
    },

    getDependencies: (ast) => {
        let dependencies = [];
        traverse(ast, {
            ImportDeclaration: ({node}) => {
                console.log('获取到的依赖信息', node.source.value);
                dependencies.push(node.source.value)
            }
        })

        return dependencies;
    },

    transform: (ast) => {
        const { code } = transformFromAst(ast, null, {
            presets: ['env']
        });
        return code;
    }

}