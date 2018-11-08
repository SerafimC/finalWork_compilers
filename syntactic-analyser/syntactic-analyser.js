// DOC: http://www.goldparser.org/doc/templates/tag-lalr-table.htm
const fileService = require('../afd-generator/file_service');
const sourceFont = './MyGrammar.xml'
const lex_an = require('./../lexical-analyser/lexical-analyser');
var parseString = require('xml2js').parseString;
var xml = "" 
var Grammar

let cInput = fileService.open(sourceFont)
for (var i = 0; i < cInput.length; i++) {
    for (let j = 0; j < cInput[i].length; j++) {
        xml += cInput[i][j]
    }
}

// console.log(xml)


parseString(xml, function(err, result) {
    Grammar = result
});

console.log(Grammar)
