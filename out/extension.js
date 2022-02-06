"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const commands_1 = require("./commands");
const localStorage_1 = require("./localStorage");
const webex_1 = require("./webex");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    let storageManager = new localStorage_1.LocalStorageService(context.workspaceState);
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "vscode-messages" is now active!');
    let regularMessage = vscode.commands.registerCommand("vscode-messages.sendRegularMessage", () => {
        vscode.window.showInformationMessage("Typescript is bad");
    });
    let webex = undefined;
    let login = vscode.commands.registerCommand("vscode-messages.webexLogin", () => {
        webex = (0, webex_1.getWebex)(storageManager);
        vscode.window.showInformationMessage("Succesfully logged in with Cisco Webex!");
    });
    let codeMessage = vscode.commands.registerCommand("vscode-messages.sendCodeMessage", () => (0, commands_1.sendCodeMessage)(storageManager));
    let logout = vscode.commands.registerCommand("vscode-messages.logOut", () => storageManager.removeValue("access_token"));
    context.subscriptions.push(codeMessage);
    context.subscriptions.push(regularMessage);
    context.subscriptions.push(login);
    context.subscriptions.push(logout);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map