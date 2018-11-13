// DOC: http://www.goldparser.org/doc/templates/tag-lalr-table.htm
const fileService = require('../afd-generator/file_service');
const sourceGrammar = './MyGrammar.xml'
const LEX_OUT = require('./../lexical-analyser/lexical-analyser').process();
const parseString = require('xml2js').parseString;
var Symbols = Array(0)
var Productions = Array(0)
var LALRTab = Array(0)

exports.process = function() {
    LoadGrammar()

    let outRibbon = LEX_OUT.outRibbon.slice()
    let currentState = 0;
    let symbol = 0;
    let stack = Array("0")

    while (outRibbon.length > 0) {
        let topSymbol = outRibbon[0]
        let id = Symbols.findIndex((el) => el.$.TSindex == topSymbol)


        if (id < 0) {
            throw "Symbol not found"
        } else {
            symbol = Symbols[id].$.Index
        }

        id = LALRTab[currentState].LALRAction.findIndex((el) => el.$.SymbolIndex == symbol)
        LALRAction = LALRTab[currentState].LALRAction[id]

        switch (LALRAction.$.Action) {
            case "1": // Shift
                currentState = LALRAction.$.Value
                stack.push(LALRAction.$.Value)
                outRibbon.shift()
                continue;
            case "2": // Reduce
                let nonTerminal = Productions[LALRAction.$.Value].$.NonTerminalIndex
                for (let i = 0; i < Productions[LALRAction.$.Value].$.SymbolCount; i++) {
                    stack.pop()
                }

                id = LALRTab[stack[stack.length - 1]].LALRAction.findIndex((el) => el.$.SymbolIndex == nonTerminal)
                LALRAction = LALRTab[stack[stack.length - 1]].LALRAction[id]
                stack.push(LALRAction.$.Value)

                currentState = stack[stack.length - 1]
                continue;
            case "3": // GOTO (Jump)
                continue;
            case "4": // Accept
                continue;
            default:
                continue;
        }
    }
    console.log(LALRTab[0].LALRAction)

}

function LoadGrammar() {
    let cInput = fileService.open(sourceGrammar)
    let Grammar = Array(0)
    let xml = ""
    let TS = LEX_OUT.TS

    for (var i = 0; i < cInput.length; i++) {
        for (let j = 0; j < cInput[i].length; j++) {
            xml += cInput[i][j]
        }
    }

    parseString(xml, function(err, result) {
        Grammar = result
    });

    Symbols = Grammar.Tables.m_Symbol[0].Symbol
    Productions = Grammar.Tables.m_Production[0].Production
    LALRTab = Grammar.Tables.LALRTable[0].LALRState

    for (var i = 0; i < TS.length; i++) {
        let id = Symbols.findIndex((el) => el.$.Name == TS[i].token)

        if (id > -1) {
            Symbols[id].$["TSindex"] = TS[i].state
        }
    }

    id = Symbols.findIndex((el) => el.$.Name == "DecimalLiteral")
    Symbols[id].$["TSindex"] = 72

    id = Symbols.findIndex((el) => el.$.Name == "Identifier")
    Symbols[id].$["TSindex"] = 71

}

this.process()