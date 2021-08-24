console.log("Updating blockly");
var https = require('https');
var fs = require('fs');

var blocklyFiles = ['blockly_compressed.js', 'blocks_compressed.js', 'javascript_compressed.js']

blocklyFiles.forEach(function(filename, index) {

  var file = fs.createWriteStream(filename);
  var request = https.get("https://raw.githubusercontent.com/google/blockly/master/" + filename, function(response) {
    response.pipe(file);
    console.log("\t" + filename + " downloaded");
  });
});

var supportedLanguages = ['en', 'it'];
var directory = "msg/js/";
if (!fs.existsSync(directory)){
  fs.mkdirSync("msg");
  fs.mkdirSync("msg/js");
}
supportedLanguages.forEach(function(lang, index) {

  var filename = lang+".js";
  var file = fs.createWriteStream(directory+filename);
  var request = https.get("https://raw.githubusercontent.com/google/blockly/master/msg/js/"+filename, function(response) {
    response.pipe(file);
    console.log("\t" + filename + " downloaded");
  });
});

var acornInterpreterFiles = ['acorn.js', "interpreter.js"]

acornInterpreterFiles.forEach(function(filename, index) {

  var file = fs.createWriteStream(filename);
  var request = https.get("https://raw.githubusercontent.com/NeilFraser/JS-Interpreter/master/" + filename, function(response) {
    response.pipe(file);
    console.log("\t" + filename + " downloaded");
  });
});
