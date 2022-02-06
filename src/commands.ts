import * as vscode from "vscode";
import { get_authors } from "./git";
import { LocalStorageService } from "./localStorage";
import { getWebex } from "./webex";

export async function sendCodeMessage(storeManager: LocalStorageService) {
  let editor = vscode.window.activeTextEditor;
  if (!editor) {
    return; // No open text editor
  }

  const selection = editor.selection;
  const start = selection.start.line + 1;
  const end = selection.end.line + 1;
  const text = editor.document.getText(selection);
  const path = editor.document.fileName;

  const authors = await get_authors(path, start, end);

  let webex = getWebex(storeManager);
  console.log("Got webex while sending message", webex);


  webex.rooms.create({ title: `My Second Room` }).then((room: any) => {
    console.log("creating a room");
    return Promise.all([
      webex.memberships.create({
        roomId: room.id,
        personEmail: `at619@ic.ac.uk`,
      }),
    ]).then(() => {
      console.log("sending a message");

      return webex.messages.create({
        markdown: `
        \`\`\`
          ${text}
        \`\`\`
        `,
        roomId: room.id,
      });
    });
  });

  vscode.window.showInformationMessage(`Authors: ${authors}`);
  // vscode.window.showInformationMessage(`File: ${path} Text: ${text} from ${start}, ${end}`);
}
