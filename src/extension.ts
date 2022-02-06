// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { addConsoleLog, MyCodeLensProvider, recievedRepliesBox, sendCodeMessage } from "./commands";

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
    vscode.window.showInformationMessage("Typescript is bad");
    recievedRepliesBox();
  });

  let consoleLogMessage = vscode.commands.registerCommand("vscode-messages.addConsoleLog", addConsoleLog);

  let webex: any = undefined;
  let login = vscode.commands.registerCommand("vscode-messages.webexLogin", () => {
    webex = getWebex(storageManager);
    vscode.window.showInformationMessage("Succesfully logged in with Cisco Webex!");
    console.log("listening");
    webex.messages.listen()
      .then(() => {
        console.log('listening to message events');
        webex.messages.on('created', (event: any) => console.log(`Got a message:created event:\n${event}`));
        webex.messages.on('deleted', (event: any) => console.log(`Got a message:deleted event:\n${event}`));
      })
      .catch((e: any) => console.error(`Unable to register for message events: ${e}`));
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
