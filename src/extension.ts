// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

import startServer from "./webex";

const Webex = require(`webex`);
const webex = Webex.init({
  credentials: {
    access_token:
      "NWYyYmE4YTgtODkxZi00NDhkLWE1ZDEtM2VhNGQzZWMzZDYzOWRiYTFlNTEtM2Ux_PF84_3f179706-f11a-4ab7-ba3e-57a4a96b089f",
  },
});

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "vscode-messages" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let codeMessage = vscode.commands.registerCommand(
    "vscode-messages.webexLogin",
    () => {
      vscode.window.showInformationMessage("Typescript is good");
      vscode.env.openExternal(
        vscode.Uri.parse(
          "https://webexapis.com/v1/authorize?client_id=C8609770741382a6add794423a26f06154db2ae0f6e256b6c33a8a873d7ddc0c1&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A8000&scope=spark-admin%3Aworkspaces_write%20spark%3Acalls_write%20spark-admin%3Aresource_groups_read%20spark%3Aall%20spark%3Akms%20Identity%3Aone_time_password%20spark-admin%3Aroles_read%20identity%3Atokens_write%20identity%3Atokens_read&state=set_state_here"
        )
      );
      // console.log(res);
      startServer();

      // console.log(res);

      // auth().then(() => {
      //   // Create a room with the title "My First Room"
      //   // Add Alice and Bob to the room
      //   // Send a **Hi Everyone** message to the room
      //   webex.rooms.create({ title: `My Second Room` }).then((room: any) => {
      //     return Promise.all([
      //       webex.memberships.create({
      //         roomId: room.id,
      //         personEmail: `pranavbansal19@imperial.ac.uk`,
      //       }),
      //     ]).then(() =>
      //       webex.messages.create({
      //         markdown: `**Hi Everyone**`,
      //         roomId: room.id,
      //       })
      //     );
      //   });
      // });
    }
  );

  let regularMessage = vscode.commands.registerCommand(
    "vscode-messages.sendRegularMessage",
    () => {
      vscode.window.showInformationMessage("Typescript is bad");
    }
  );
  console.log("added");

  context.subscriptions.push(codeMessage);
  context.subscriptions.push(regularMessage);
}

// this method is called when your extension is deactivated
export function deactivate() {}
