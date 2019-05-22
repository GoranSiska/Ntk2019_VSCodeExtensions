/* global suite, test */

const should = require('chai').should();
const vscode = require("vscode");

// Defines a Mocha test suite to group tests of similar kind together
suite("Given synonym extension", function() {

	// Defines a Mocha unit test
	test("command logSynonym should be registered", async () => {
		let commands = await vscode.commands.getCommands(true);
		
		commands.should.include("synonym.logSynonym");
	});
});
