const fileService = require('./../afg-generator/file_service');
const afg_gen = require('./../afg-generator/bnf_syntax');
const sourceFont = './font.mcs'
let symbol_tabel = Array(0)



exports.process = function() {

    this.aAFD = afg_gen.process().aAFD
        // let cInput = fileService.open(sourceFont)
        // var aLn = ''

    // for (let i = 0; i < cInput.length; i++) {
    //     for (let j = 0; j < cInput[i].length; j++) {
    //         aLn += cInput[i][j]
    //     }
    // }


}
this.process()