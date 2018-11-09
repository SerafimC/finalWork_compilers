const fileService = require('../afd-generator/file_service');
const afg_gen = require('../afd-generator/bnf_syntax');
const sourceFont = './font.mcs'
let symbol_tabel = Array(0)

exports.process = function() {


    let outRibbon = ''
    let TableGenerator = afg_gen.process()
    let AFD = TableGenerator.aAFD
    let TS = Array(0)
    let cInput = fileService.open(sourceFont)
    let currentToken = ''
    let currentState = 0

    for (var i = 0; i < cInput.length; i++) {
        let currentTransition = ''
        let nextTransition = ''
        currentToken = ''

        for (let j = 0; j < cInput[i].length; j++) {
            let endOfTokenOrLine = cInput[i][j + 1] == " " || j == cInput[i].length || cInput[i][j + 1] == "\r\n" || cInput[i][j + 1] == "\n" || cInput[i][j + 1] == "\r"
            let separatorChar = cInput[i][j] == " " || cInput[i][j] == "\r\n" || cInput[i][j] == "\n" || cInput[i][j] == "\r"
            let state = AFD[currentState]
            let nextState = {}
            let currentChar = cInput[i][j]
            let nextChar = cInput[i][j + 1]

            if (!separatorChar) {
                currentToken += currentChar
            }

            currentTransition = state.findIndex((el) => el.symbolName == currentChar)

            if (state[currentTransition] == undefined) {
                if (!separatorChar) {
                    insertTableSymbol.call(this, currentToken, 'ErrorState', 0)
                    continue
                } else {
                    currentToken = ''
                    continue
                }
            }

            IDcurrentTransition = TableGenerator.aNT.findIndex((el) => el.ruleName == state[currentTransition].transition)
            nextState = AFD[IDcurrentTransition]
            nextTransition = nextState.findIndex((el) => el.symbolName == nextChar)

            if (state[nextTransition] == undefined) {

                if (TableGenerator.aNT[IDcurrentTransition].isFinal) {
                    insertTableSymbol.call(this, currentToken, IDcurrentTransition, 2)
                    continue
                } else {
                    insertTableSymbol.call(this, currentToken, 'ErrorState', 2)
                    continue
                }
            } else {
                IDnextTransition = TableGenerator.aNT.findIndex((el) => el.ruleName == nextState[nextTransition].transition)

                if (TableGenerator.aNT[IDnextTransition] == undefined) {
                    if (TableGenerator.aNT[IDcurrentTransition].isFinal && endOfTokenOrLine) {
                        insertTableSymbol.call(this, currentToken, IDcurrentTransition, 2)
                        continue
                    } else {
                        insertTableSymbol.call(this, currentToken, 'ErrorState', 2)
                        continue
                    }
                }

                if (nextState[nextTransition].transition != 'ErrorState' && (!TableGenerator.aNT[IDnextTransition].isFinal || !endOfTokenOrLine)) {
                    currentState = IDcurrentTransition
                    continue
                } else if (nextState[nextTransition].transition == 'ErrorState' && (!TableGenerator.aNT[IDcurrentTransition].isFinal || !endOfTokenOrLine)) {
                    insertTableSymbol.call(this, currentToken, IDcurrentTransition, 2)
                    continue
                } else {
                    insertTableSymbol.call(this, currentToken, 'ErrorState', 2)
                    continue
                }

            }

        }
    }
    outRibbon += '$'

    function insertTableSymbol(label, state, displacement) {
        let idTS = TS.findIndex((el) => el.token == label);

        if (idTS >= 0) {
            i + displacement
            outRibbon += '<' + state + '>'
            currentState = 0
            currentToken = ''
            return
        }
        TS.push({ token: label, type: '', scope: '', state: state })
        outRibbon += '<' + state + '>'
        currentToken = ''
        currentState = 0
        i + displacement
    }

    // console.log(outRibbon)
    // console.log(TS)
    return { TS: TS, outRibbon: outRibbon }
}