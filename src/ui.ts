import * as vscode from "vscode";

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

export async function recievedRepliesBox(
  author: string,
  file: string,
  start: number,
  end: number,
  message: string
) {
  vscode.window
    .showInformationMessage(
      `${author}, ${file}, Lines: ${start}-${end}: ${message}`,
      "View Message",
      "Cancel"
    )
    .then((selection) => {
      if (selection === "View Message") {
        let editor = vscode.window.activeTextEditor;
        editor!.revealRange(
          new vscode.Range(
            new vscode.Position(start, 0),
            new vscode.Position(end, 0)
          ),
          vscode.TextEditorRevealType.InCenter
        );
      } else {
        console.log("Canceled viewing the message");
      }
    });
}

export class MyCodeLensProvider implements vscode.CodeLensProvider {
  async provideCodeLenses(
    document: vscode.TextDocument
  ): Promise<vscode.CodeLens[]> {
    let topOfDocument = new vscode.Range(0, 0, 0, 0);

    let c: vscode.Command = {
      command: "vscode-messages.addConsoleLog",
      title: "Insert console.log",
    };

    let codeLens = new vscode.CodeLens(topOfDocument, c);

    return [codeLens];
  }
}
