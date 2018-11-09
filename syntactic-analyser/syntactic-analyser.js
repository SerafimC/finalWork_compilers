// DOC: http://www.goldparser.org/doc/templates/tag-lalr-table.htm
const fileService = require('../afd-generator/file_service');
const sourceGrammar = './MyGrammar.xml'
const sourceFont = './font.mcs'
const lex_an = require('./../lexical-analyser/lexical-analyser');
const LEX_OUT = lex_an.process()
const TS = LEX_OUT.TS
var parseString = require('xml2js').parseString;
var Symbol = []
var xml = ""
var Grammar
var LALRTab

exports.process = function() {
    LoadGrammar()

    let outRibbon = LEX_OUT.outRibbon

    console.log(outRibbon)

    for (var i = 0; i < outRibbon.length; i++) {}
    // console.log(Symbol)
    // console.log(TS)
}

function LoadGrammar() {
    let cInput = fileService.open(sourceGrammar)

    for (var i = 0; i < cInput.length; i++) {
        for (let j = 0; j < cInput[i].length; j++) {
            xml += cInput[i][j]
        }
    }

    parseString(xml, function(err, result) {
        Grammar = result
    });

    Symbol = Grammar.Tables.m_Symbol[0].Symbol
    LALRTab = Grammar.Tables.LALRTable[0].LALRState

    for (var i = 0; i < TS.length; i++) {
        var id = Symbol.findIndex((el) => el.$.Name == TS[i].token)

        if (id > -1) {
            Symbol[id].$["TSindex"] = TS[i].state
        }
    }

    console.log(TS)
}

this.process()