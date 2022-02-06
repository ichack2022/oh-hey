import * as vscode from "vscode";
import { get_authors } from "./git";
import { LocalStorageService } from "./localStorage";
import { getWebex } from "./webex";
import path = require("path");
import { getRoot } from "./git";

export async function sendCodeMessage(storeManager: LocalStorageService) {
  let editor = vscode.window.activeTextEditor;
  if (!editor) {
    return; // No open text editor
  }

  const selection = editor.selection;
  const start = selection.start.line + 1;
  const end = selection.end.line + 1;
  const text = editor.document.getText(selection);
  const filepath = editor.document.fileName;
  const gitRoot = await getRoot(filepath);
  const workingDir = path.basename(gitRoot).trimEnd();
  const projectFile = filepath.slice(
    filepath.indexOf(workingDir) + workingDir.length,
    filepath.length
  );

  console.log("WD", workingDir);
  console.log("PF", projectFile);

  const authors = await get_authors(filepath, start, end);

  vscode.window.showInformationMessage(
    `The author of this line is: ${authors}`
  );


  let webex = getWebex(storeManager);

  let teams = webex.teams
  .list({ max: 10 })
  .then(async (teams: any) => {
    console.log(teams.items);

    const teamItems = teams.items.map((team: any) => {
      return new QuickSelectItem(team.name, "", team);
    });

    console.log(teamItems);

    const selectedTeam = await quickSelectBox("Choose a Team", teamItems);
    return selectedTeam;
  })
  .then((team: any) => {
    console.log("TEAM", team.id);
    return webex.teamMemberships
      .list({ teamId: team.id })
      .then((members: any) => {
        return {
          members: members,
          team: team,
        };
      });
  })
  .then(async (membership: any) => {
    console.log("MEMBERS", membership.members);

    const memberItems = membership.members.items.map((member: any) => {
      return new QuickSelectItem(
        member.personDisplayName,
        member.personEmail,
        member.personId
      );
    });

    memberItems.push(
      new QuickSelectItem(
        `${membership.team.name}`,
        "Team Space",
        membership.team
      )
    );

    return await quickSelectBox(
      "Choose the Person you want to message",
      memberItems
    );
  })
  .then(async (personId: any) => {
    console.log("PERSON", personId);

    const high = "HIGH";
    const medium = "MEDIUM";
    const low = "LOW";

    const priority = await quickSelectBox("What is the message priority?", [
      new QuickSelectItem(high, "", high),
      new QuickSelectItem(medium, "", medium),
      new QuickSelectItem(low, "", low),
    ]);

    const questionPrompt =
      "Hey, I don't understand this piece of code. Can you help me?";
    const bugPrompt = "Hey, I think this might be a bug. Can you help me?";
    const errPrompt =
      "Hey, I am having errors with this piece of code. Can you help me?";
    const customPrompt = "Write your message header";

    const selectedText = await quickSelectBox(
      "What would you like to send in the message",
      [
        new QuickSelectItem("Question", questionPrompt, questionPrompt),
        new QuickSelectItem("Bug", bugPrompt, bugPrompt),
        new QuickSelectItem("Error", errPrompt, errPrompt),
        new QuickSelectItem("Custom", customPrompt, ""),
      ]
    );

    const msg = getInputBox("Write a message", selectedText).then(
      (msg: any) => {
        console.log("TEXTMSG: ", msg);
        const markdown = `
${msg}‌
\`\`\`
${text}
\`\`\`
Project: ${workingDir}
File: ${projectFile}
Lines: ${start}-${end}
Priority: ${priority}
`;
        if (personId.id) {
          return webex.rooms.list({ max: 100 }).then((rooms: any) => {
            console.log("ALLROOMS", rooms.items);
            console.log("TITLE", personId.name);

            const filteredRooms = rooms.items.filter(
              (room: any) => room.title === personId.name
            );
            console.log("FILTERED ROOMS", filteredRooms);

            return webex.messages.create({
              markdown: markdown,
              roomId: filteredRooms[0].id,
            });
          });
        }

        return webex.messages.create({
          markdown: markdown,
          toPersonId: personId,
        });
      }
    );
  })
  .then(() => {
    vscode.window.showInformationMessage("Message Sent!");
  });
}

// Gets the input from an input box and returns it
export async function getInputBox(
  message: string,
  defaultValue: string
): Promise<string> {
  let editor = vscode.window.activeTextEditor;
  const res = await vscode.window.showInputBox({
    placeHolder: message,
    value: defaultValue,
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

export async function addConsoleLog() {
  let lineNumStr = await vscode.window.showInputBox({
    prompt: "Line Number",
  });

  let lineNum = vscode;

  let editor = vscode.window.activeTextEditor;
  if (!editor) {
    return; // No open text editor
  }
  const selection = editor.selection;
  const start = selection.start.line + 1;
  const end = selection.end.line + 1;
  let insertionLocation = new vscode.Range(start, 0, end, 0);
  let snippet = new vscode.SnippetString("console.log($1);\n");

  vscode.window.activeTextEditor!.insertSnippet(snippet, insertionLocation);
}

export async function recievedRepliesBox(author: string, file: string, start: number, end: number, message: string) {
  vscode.window
    .showInformationMessage(`${author}, ${file}, Lines: ${start}-${end}: ${message}`, "View Message", "Cancel")
    .then((selection) => {
      if (selection === "View Message") {
        let editor = vscode.window.activeTextEditor;
        editor!.revealRange(new vscode.Range(new vscode.Position(start, 0), new vscode.Position(end, 0)), vscode.TextEditorRevealType.InCenter);
      } else {
        console.log("Canceled viewing the message");
      }
    });
}

export class MyCodeLensProvider implements vscode.CodeLensProvider {
  async provideCodeLenses(document: vscode.TextDocument): Promise<vscode.CodeLens[]> {
    let topOfDocument = new vscode.Range(0, 0, 0, 0);

    let c: vscode.Command = {
      command: "vscode-messages.addConsoleLog",
      title: "Insert console.log",
    };

    let codeLens = new vscode.CodeLens(topOfDocument, c);

    return [codeLens];
  }
}
