// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

function indent(line, indent_level) {
  var out = '';
  for (var i = 0; i < indent_level; i++) {
    out += '    ';
  }
  return out + line;
}
//this function actualy format text
function format(src) {
  var output = '';
  var i = 1;
  const lines = src.split(/(\n|\r)/);
	const l = lines.length;
	var blockStarts = [
		'(','INPUT','MENU','GLOBALS','MAIN','IF','REPORT','FUNCTION','FOR',
		'WHILE','FOREACH','CASE'];
	var keywords =  [
		'END','INPUT','MENU','GLOBALS','MAIN','IF','REPORT','FUNCTION','FOR'
		,'WHILE','FOREACH','CASE','RECORD','PRINT','AFTER','BEFORE','ON','ELSE'
		,'BEGIN','COMMIT','WORK','ROLLBACK','ERROR','LET','CALL','MESSAGE','AT'
		,'PROMPT','DISPLAY','DEFINE','ARRAY','DECLARE','CURSOR','INT','DEC'
		,'CHAR','SELECT','FROM','FORM','WHERE','AND','OR','DATE','ROUND','SUM'
		,'INTEGER','OUTPUT','OPTIONS','FORMAT','DATABASE','AS','ORDER','BY'
		,'INITIALIZE','TO','NULL','LIKE','CONSTRUCT','NAME','EXIT','PROGRAM'
		,'DECIMAL','CLIPPED','PREPARE','START','FINISH','RUN','INTO','SET_COUNT'
		,'KEY','LOCK','SKIP','TO','TOP','OF','PAGE','LINE','CLOSE','SMALLINT'
		,'DEFER','INTERRUPT','INSERT','UPDATE','DELETE','CONTROL','STARTLOG'
		,'INTO','OPEN','WINDOW','ATTRIBUTE','BORDER','COMMAND','WITH','ROWS'
		,'COLUMNS','TIME','TODAY','INFIELD','FIELD','NEXT','THEN','FETCH'
		,'FIRST','PREVIOUS','LAST','STATUS','WITHOUT','DEFAULTS','WHEN'
		,'OTHERWISE','TRUE','FALSE','CLEAR','RETURN'];
	// indent level
  var il = 0;
  for (i = 0; i < l; i++) {
    var line = lines[i].trim();
    if (line !== '\n' && line !== '') {
      // line processing
      var tokens = line.split(/(\s|\t)/);
      var outline = '';
      for (var j = 0; j < tokens.length; j++) {
        var token = tokens[j];
        if (token !== '' && token !== ' ' && token !== '\t' && token !== '\n' && token !== '\r') {
					if(keywords.indexOf(token.toUpperCase()) >= 0){
						token = token.toUpperCase();
					}
					if(j == 0 && token.toUpperCase() == 'COLUMN'){
						outline += '      COLUMN ';
					}
					else{
						outline += token + ' ';
					}
        }
      }
			// output
			if(il < 0){
				il = 0;
			}
			var foundEnd = 0;
			if(tokens[0].toUpperCase() == 'END'
			||tokens[0].toUpperCase() == ')'){
				il--;
				foundEnd = 1;
			}
			var ifendif = 0;
			if(line.match(/\s(END|end)\s/)&&tokens[0].match(/(if|IF)/)){
				ifendif = 1;
			}
			var lessIndentThisLine = 0;
			if(tokens[0].toUpperCase() == 'ELSE'
			||tokens[0].toUpperCase() == 'OPTIONS'
			||tokens[0].toUpperCase() == 'OUTPUT'
			||tokens[0].toUpperCase() == 'FORMAT'
			||tokens[0].toUpperCase() == 'AFTER'
			||tokens[0].toUpperCase() == 'BEFORE'
			||tokens[0].toUpperCase() == 'WHEN'
			||tokens[0].toUpperCase() == 'ON'){
				lessIndentThisLine = 1;
				il--;
			}
			output += indent(outline, il) + '\n';				
			if(lessIndentThisLine){
				il++;
			}
			if(!foundEnd && !ifendif
			&& ( blockStarts.indexOf(tokens[0].toUpperCase()) >= 0
			|| line.match(/(record|RECORD)$/))){
				il++;
			}
			if(ifendif){
				ifendif = 0;
			}
    }
  }
  return output;
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  context.subscriptions.push(
    vscode.languages.registerDocumentFormattingEditProvider('4GL', {
      provideDocumentFormattingEdits(document) {
        const text = document.getText();
        const range = new vscode.Range(
          document.positionAt(0),
          document.positionAt(text.length)
        );
        return Promise.resolve([new vscode.TextEdit(range, format(text))]);
      }
    })
  );
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate
};
