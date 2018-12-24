// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

var Char = /** @class */ (function () {
	function Char(stream, pos) {
			this.stream = stream;
			this.pos = pos;
	}
	Object.defineProperty(Char.prototype, "value", {
			get: function () {
					return this.stream[this.pos];
			},
			enumerable: true,
			configurable: true
	});
	return Char;
}());
var Token = /** @class */ (function () {
	function Token(stream, start, end) {
			this.stream = stream;
			this.start = start;
			this.end = end;
	}
	Object.defineProperty(Token.prototype, "value", {
			get: function () {
					return this.stream.slice(this.start, this.end);
			},
			enumerable: true,
			configurable: true
	});
	Object.defineProperty(Token.prototype, "whitespace", {
			get: function () {
					var i = this.start - 1;
					for (; i >= 0 && /\s/.test(this.stream[i]); i--)
							;
					return new Token(this.stream, i + 1, this.start);
			},
			enumerable: true,
			configurable: true
	});
	return Token;
}());
function nextChar(s, i, regex) {
	if (regex === void 0) { regex = /\S/g; }
	if (!regex.global)
			throw new Error('Regexp must be global');
	regex.lastIndex = i;
	var res = regex.exec(s);
	if (!res)
			return;
	return new Char(s, res.index);
}
function nextToken(s, i) {
	var char = nextChar(s, i);
	if (!char)
			return;
	var start = char.pos;
	char = nextChar(s, start + 1, /\s/g);
	var end = char ? char.pos + Number(char.value == '>') : s.length;
	return new Token(s, start, end);
}


//this function actualy format text
function format(src, indent){
	var output = "";
	var token;
	while(token = nextToken(src) && token !== null){
		output +=token+indent;
	}
	return output;
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	context.subscriptions.push(
		vscode.languages.registerDocumentFormattingEditProvider('4GL', {
			provideDocumentFormattingEdits(document){
				const text = document.getText();
				const range = new vscode.Range(
					document.positionAt(0),
					document.positionAt(text.length)
				);
				return Promise.resolve([
					new vscode.TextEdit(range, "format(text, 2)")
				]);
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
}
