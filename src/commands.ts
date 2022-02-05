import * as vscode from "vscode";
import { get_authors } from "./git";
import { getAccessToken } from "./webex";

const accessToken = getAccessToken();
const Webex = require(`webex`);
const webex = Webex.init({
  credentials: {
    access_token: accessToken,
  },
});

export async function sendCodeMessage() {
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

  webex.rooms.create({ title: `My Second Room` }).then((room: any) => {
    return Promise.all([
      webex.memberships.create({
        roomId: room.id,
        personEmail: `pranavbansal19@imperial.ac.uk`,
      }),
    ]).then(() =>
      webex.messages.create({
        markdown: `${text}`,
        roomId: room.id,
      })
    );
  });

  vscode.window.showInformationMessage(`Authors: ${authors}`);
  // vscode.window.showInformationMessage(`File: ${path} Text: ${text} from ${start}, ${end}`);
}
