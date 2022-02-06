"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const commands_1 = require("./commands");
const webex_1 = require("./webex");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "vscode-messages" is now active!');
    let codeMessage = vscode.commands.registerCommand('vscode-messages.sendCodeMessage', commands_1.sendCodeMessage);
    let regularMessage = vscode.commands.registerCommand('vscode-messages.sendRegularMessage', async () => {
        // vscode.window.showInformationMessage("Typescript is bad");
        const resp1 = await (0, commands_1.getInputBox)("Enter you message");
        const resp2 = await (0, commands_1.getInputBox)("Enter person name");
        vscode.window.showInformationMessage(resp1 + " | " + resp2);
        // vscode.window.createInputBox();
        // vscode.window.createQuickPick();
    });
    let login = vscode.commands.registerCommand("vscode-messages.webexLogin", () => {
        vscode.window.showInformationMessage("Typescript is good");
        vscode.env.openExternal(vscode.Uri.parse("https://webexapis.com/v1/authorize?client_id=C8609770741382a6add794423a26f06154db2ae0f6e256b6c33a8a873d7ddc0c1&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A8000&scope=spark-admin%3Aworkspaces_write%20spark%3Acalls_write%20spark-admin%3Aresource_groups_read%20spark%3Aall%20spark%3Akms%20Identity%3Aone_time_password%20spark-admin%3Aroles_read%20identity%3Atokens_write%20identity%3Atokens_read&state=set_state_here"));
        (0, webex_1.default)();
        console.log("added");
        context.subscriptions.push(codeMessage);
        context.subscriptions.push(regularMessage);
        context.subscriptions.push(login);
    });
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map