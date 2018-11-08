// DOC: http://www.goldparser.org/doc/templates/tag-lalr-table.htm
const fileService = require('../afd-generator/file_service');
const sourceFont = './MyGrammar.xml'
const lex_an = require('./../lexical-analyser/lexical-analyser');
const LEX_OUT = lex_an.process()
const TS = LEX_OUT.TS
var parseString = require('xml2js').parseString;
var Symbol = []
var xml = "" 
var Grammar


exports.process = function() {
    LoadGrammar()
    console.log(Symbol)
    // console.log(TS)
}

function LoadGrammar() {
    let cInput = fileService.open(sourceFont)
    
    for (var i = 0; i < cInput.length; i++) {
        for (let j = 0; j < cInput[i].length; j++) {
            xml += cInput[i][j]
        }
    }

    parseString(xml, function(err, result) {
        Grammar = result
    });

    Symbol = Grammar.Tables.m_Symbol[0].Symbol

    for(var i = 0; i < TS.length; i++) {
        var id = Symbol.findIndex((el) => el.$.Name == TS[i].token)
        
        if(id > -1) {
            Symbol[id].$["TSindex"] = i
        }
    }
}

this.process()
