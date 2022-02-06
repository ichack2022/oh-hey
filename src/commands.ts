import * as vscode from "vscode";
import { get_authors } from "./git";
import { LocalStorageService } from "./localStorage";
import { display } from "./message";
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

  let teams = webex.teams
    .list({ max: 10 })
    .then(async (teams: any) => {
      console.log(teams.items);

      const teamItems = teams.items.map((team: any) => {
        return new QuickSelectItem(team.name, "", team.id);
      });

      console.log(teamItems);

      const selectedTeam = await quickSelectBox("Choose a Team", teamItems);
      return selectedTeam;
    })
    .then((teamId: any) => {
      console.log("TEAM", teamId);
      return webex.teamMemberships.list({ teamId: teamId });
    })
    .then(async (membership: any) => {
      console.log(membership.items);

      const memberItems = membership.items.map((member: any) => {
        return new QuickSelectItem(
          member.personDisplayName,
          member.personEmail,
          member.personId
        );
      });

      return await quickSelectBox(
        "Choose the Person you want to message",
        memberItems
      );
    })
    .then((personId: any) => {
      console.log("PERSON", personId);

      return webex.messages.create({
        markdown: `
\`\`\`
${text}
\`\`\`
              `,
        toPersonId: personId,
      });
    });

  vscode.window.showInformationMessage(`The author of this line is: ${authors}`);
  // vscode.window.showInformationMessage(`File: ${path} Text: ${text} from ${start}, ${end}`);
}

// Gets the input from an input box and returns it
export async function getInputBox(message: string): Promise<string> {
  let editor = vscode.window.activeTextEditor;
  const res = await vscode.window.showInputBox({
    placeHolder: message,
    value: editor?.document.getText(editor?.selection),
  });
  return res ?? "";
}

// Takes in a list of Quick Select items and a placeholder, retunrs the chosen Quick Select object

// const items = [
//     new QuickSelectItem("Alice", "alice@example.com"),
//     new QuickSelectItem("Bob", "bob@example.com"),
//     new QuickSelectItem("Charlie", "charlie@example.com"),
//     new QuickSelectItem("Dave", "dave@example.com"),
//    ];
//    const resp3 = await quickSelectBox("Pick one", items);
export class QuickSelectItem {
  label: string;
  description: string;
  returnObj: any;
  constructor(label: string, description: string, returnObj: any) {
    this.label = label;
    this.description = description;
    this.returnObj = returnObj;
  }
}
export async function quickSelectBox(
  message: string,
  items: QuickSelectItem[]
): Promise<any> {
  const res = await vscode.window.showQuickPick(items, {
    placeHolder: message,
  });
  return res?.returnObj!;
}
