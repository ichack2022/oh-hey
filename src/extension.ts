import * as vscode from "vscode";
import { sendCodeMessage } from "./commands";
import { addConsoleLog, MyCodeLensProvider, recievedRepliesBox } from "./ui";

import { LocalStorageService } from "./localStorage";
import { getWebex } from "./webex";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  let storageManager = new LocalStorageService(context.workspaceState);

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "vscode-messages" is now active!');

  let regularMessage = vscode.commands.registerCommand("vscode-messages.sendRegularMessage", () => {
  });

  let consoleLogMessage = vscode.commands.registerCommand("vscode-messages.addConsoleLog", addConsoleLog);

  let webex: any = undefined;
  let login = vscode.commands.registerCommand("vscode-messages.webexLogin", () => {
    webex = getWebex(storageManager);
    vscode.window.showInformationMessage("Succesfully logged in with Cisco Webex!");
  });

  let codeMessage = vscode.commands.registerCommand("vscode-messages.sendCodeMessage", () =>
    sendCodeMessage(storageManager)
  );

  let logout = vscode.commands.registerCommand("vscode-messages.logOut", () =>
    storageManager.removeValue("access_token")
  );

  let docSelector = {
    language: "javascript",
    scheme: "file",
  };

  vscode.languages.registerCodeLensProvider(docSelector, new MyCodeLensProvider());

  context.subscriptions.push(consoleLogMessage);
  context.subscriptions.push(codeMessage);
  context.subscriptions.push(regularMessage);
  context.subscriptions.push(login);
  context.subscriptions.push(logout);
}

// this method is called when your extension is deactivated
export function deactivate() { }
