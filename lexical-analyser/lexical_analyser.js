const fileService = require('./../afd-generator/file_service');
const afg_gen = require('./../afd-generator/bnf_syntax');
const sourceFont = './font.mcs'
let symbol_tabel = Array(0)

exports.process = function() {

    let outRibbon = '$'
    let TableGenerator = afg_gen.process()
    let AFD = TableGenerator.aAFD
    let TS = Array(0)
    let cInput = fileService.open(sourceFont)

    for (let i = 0; i < cInput.length; i++) {
        let currentState = 0
        let nextTransition = ''
        let currentToken = ''
        for (let j = 0; j < cInput[i].length; j++) {
            let endOfTokenOrLine = cInput[i][j + 1] == " " || j == cInput[i].length
            let state = AFD[currentState]
            let currentChar = cInput[i][j]

            outRibbon += currentChar
            currentToken += currentChar

            nextTransition = state.findIndex((el) => el.symbolName == currentChar)

            if (state[nextTransition] == undefined) {
                break
            }

            IDnextTransition = TableGenerator.aNT.findIndex((el) => el.ruleName == state[nextTransition].transition)

            if (TableGenerator.aNT[IDnextTransition].isFinal && endOfTokenOrLine) {
                TS.push({ token: currentToken, type: '', scope: '' })
            }
        }
    }


}


this.process()