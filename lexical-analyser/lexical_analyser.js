const fileService = require('./../afd-generator/file_service');
const afg_gen = require('./../afd-generator/bnf_syntax');
const sourceFont = './font.mcs'
let symbol_tabel = Array(0)

exports.process = function() {

    let outRibbon = ''
    let TableGenerator = afg_gen.process()
    let AFD = TableGenerator.aAFD
    let TS = Array(0)
    let cInput = fileService.open(sourceFont)

    for (let i = 0; i < cInput.length; i++) {
        let currentState = 0
        let currentTransition = ''
        let nextTransition = ''
        let currentToken = ''

        for (let j = 0; j < cInput[i].length; j++) {
            let endOfTokenOrLine = cInput[i][j + 1] == " " || j == cInput[i].length || cInput[i][j + 1] == "\r\n" || cInput[i][j + 1] == "\n" || cInput[i][j + 1] == "\r"
            let separatorChar = cInput[i][j] == " " || cInput[i][j] == "\r\n" || cInput[i][j] == "\n" || cInput[i][j] == "\r"
            let state = AFD[currentState]
            let nextState = {}
            let currentChar = cInput[i][j]
            let nextChar = cInput[i][j+1]

            if (!separatorChar) {
                currentToken += currentChar
            }

            currentTransition = state.findIndex((el) => el.symbolName == currentChar)

            if (state[currentTransition] == undefined) {
                if(!separatorChar){
                    TS.push({ token: currentToken, type: '', scope: '', state: 'ErrorState' })
                    outRibbon += '<' + 'ErrorState' + '>'
                    currentToken = ''
                    continue
                } else {
                    continue
                }
            }

            IDcurrentTransition = TableGenerator.aNT.findIndex((el) => el.ruleName == state[currentTransition].transition)
            nextState = AFD[IDcurrentTransition]
            nextTransition = nextState.findIndex((el) => el.symbolName == nextChar)
            
            if (state[nextTransition] == undefined) {

                if (TableGenerator.aNT[IDcurrentTransition].isFinal && endOfTokenOrLine) {
                    TS.push({ token: currentToken, type: '', scope: '', state: IDcurrentTransition })
                    outRibbon += '<' + IDcurrentTransition + '>'
                    currentToken = ''
                    i+2
                    continue
                }  else {
                    TS.push({ token: currentToken, type: '', scope: '', state: 'ErrorState' })
                    outRibbon += '<' + 'ErrorState' + '>'
                    currentToken = ''
                    i+2
                    continue
                }
            } else {
                IDnextTransition = TableGenerator.aNT.findIndex((el) => el.ruleName == nextState[nextTransition].transition)

                if(TableGenerator.aNT[IDnextTransition] == undefined) {
                    if (TableGenerator.aNT[IDcurrentTransition].isFinal && endOfTokenOrLine) {
                        TS.push({ token: currentToken, type: '', scope: '', state: IDcurrentTransition })
                        outRibbon += '<' + IDcurrentTransition + '>'
                        currentToken = ''
                        i+2
                        continue
                    }  else {
                        TS.push({ token: currentToken, type: '', scope: '', state: 'ErrorState' })
                        outRibbon += '<' + 'ErrorState' + '>'
                        currentToken = ''
                        i+2
                        continue
                    }
                }

                if (nextState[nextTransition].transition != 'ErrorState' && (!TableGenerator.aNT[IDnextTransition].isFinal || !endOfTokenOrLine)) {
                    continue
                } else if(state[nextTransition].transition == 'ErrorState' && (!TableGenerator.aNT[IDnextTransition].isFinal || !endOfTokenOrLine)) {
                    TS.push({ token: currentToken, type: '', scope: '', state: IDcurrentTransition })
                    outRibbon += '<' + IDcurrentTransition + '>'
                    currentToken = ''
                    i+2
                    continue
                }  else {
                    TS.push({ token: currentToken, type: '', scope: '', state: 'ErrorState' })
                    outRibbon += '<' + 'ErrorState' + '>'
                    currentToken = ''
                    i+2
                    continue
                }

            }

        }
    }
    console.log(outRibbon)
    console.log(TS)
}


this.process()