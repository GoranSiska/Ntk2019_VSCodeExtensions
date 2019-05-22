const vscode = require("vscode");
const datamuse = require("datamuse");
let synonymPanel;

/**
 * this method is called when your extension is deactivated
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	/*
	//activating extensions
	console.log("synonym extension is now active!");

	//dialogs
	vscode.window.showInformationMessage("Hello world!")

	//webview
	synonymPanel = vscode.window.createWebviewPanel("synonymView", "Synonyms", vscode.ViewColumn.One, {enableScripts: true});
	synonymPanel.webview.html = `
	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Synonyms</title>
	</head>
	<body>
		<h1>Selected synonyms log:</h1>
		<ol id="synonyms_list">
		</ol>
		<script>
const vscode = acquireVsCodeApi();
const list = document.getElementById("synonyms_list");

function addSynonym(synonym) {
	var item = document.createElement("li");  
	var t = document.createTextNode(synonym);
	item.appendChild(t);
	list.appendChild(item);
}

let synonyms = vscode.getState();
if(!synonyms) {
	synonyms = [];
} else {
	synonyms.forEach(function(element){
		addSynonym(element)
	});
}

window.addEventListener('message', event => {
	const message = event.data;	
	addSynonym(message.synonym);
	synonyms.push(message.synonym);
	vscode.setState(synonyms);
});

		</script>	
	</body>
</html>`;

	context.subscriptions.push(synonymPanel);

	//command
	context.subscriptions.push(vscode.commands.registerCommand("synonym.logSynonym", (synonym) => {
		synonymPanel.webview.postMessage({synonym: synonym});
	}));

	//input dialog
	context.subscriptions.push(vscode.commands.registerCommand("synonym.logSynonymUI", (synonym) => {
		vscode.window.showInputBox({prompt: "Enter synonym"})
		.then((synonym) => vscode.commands.executeCommand("synonym.logSynonym", synonym));
	}));

	//completion provider
	const synonymProvider = vscode.languages.registerCompletionItemProvider(
		//selector
		{ scheme: "*" },
		//provider
		{ provideCompletionItems(document, position) { return findSynonyms(document, position);}},
		//trigger characters
		"#");
	context.subscriptions.push(synonymProvider);

	function findSynonyms(document, position) {
		let line = document.lineAt(position)
		let lastWord = line.text.split(' ').pop();
		if (lastWord[lastWord.length - 1] === '#') {
			//local testing
			//return Promise.resolve([{"word":"achiever","score":31525,"tags":["syn","n"]},{"word":"winner","score":30426,"tags":["syn","n"]},{"word":"successes","score":23794,"tags":["n"]},{"word":"successful","score":19711,"tags":["adj"]},{"word":"accomplishment","score":16148,"tags":["n"]},{"word":"achievements","score":16084,"tags":["n"]},{"word":"achievement","score":15794,"tags":["n"]},{"word":"triumphs","score":15205,"tags":["n"]},{"word":"accomplishments","score":15131,"tags":["n"]},{"word":"progress","score":14802,"tags":["n"]}])
			return datamuse.words({ ml: lastWord.replace("#", ""), max:10})
				.then(response=> {
				return response.map(s=> {
					let item = new vscode.CompletionItem(s.word, vscode.CompletionItemKind.Constant);
					item.sortText = (10000000000 - s.score).toString().padStart(10,"0");
					item.additionalTextEdits = [vscode.TextEdit.delete(new vscode.Range(line.lineNumber, (position.character-lastWord.length), line.lineNumber, position.character))];
					item.command = {command: "synonym.logSynonym", arguments: [s.word], title:""};
					
					return item;
				});
			});
		}
	}
	
	*/
}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
};