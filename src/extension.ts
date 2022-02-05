// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { sendCodeMessage } from './commands';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscode-messages" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let codeMessage = vscode.commands.registerCommand('vscode-messages.sendCodeMessage', sendCodeMessage);

	let regularMessage = vscode.commands.registerCommand('vscode-messages.sendRegularMessage', () => {
		vscode.window.showInformationMessage('Typescript is bad');
	});
	console.log("added");

	context.subscriptions.push(codeMessage);
	context.subscriptions.push(regularMessage);
}

// this method is called when your extension is deactivated
export function deactivate() {}
