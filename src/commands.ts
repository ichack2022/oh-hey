import * as vscode from "vscode";
import { get_authors } from "./git";

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

 vscode.window.showInformationMessage(`Authors: ${authors}`);
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
