const fileService = require('./afd-generator/file_service');
const sourceFont = './MyGrammar.xml'
var parseString = require('xml2js').parseString;
var xml = "" //"<root>Hello xml2js!</root>"

let cInput = fileService.open(sourceFont)
for (var i = 0; i < cInput.length; i++) {
    for (let j = 0; j < cInput[i].length; j++) {
        xml += cInput[i][j]
    }
}

// console.log(xml)


parseString(xml, function(err, result) {


    console.log(result.Tables.LALRTable[0].LALRState[0].LALRAction);

});