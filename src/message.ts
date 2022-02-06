import * as vscode from "vscode";

const CHARS_PER_LINE = 40;
export type Priority = "HIGH" | "MEDIUM" | "LOW";


export function display(text: string, start: number, end: number, priority: Priority) {
  let editor = vscode.window.activeTextEditor!;
  const lines = splitText(text, end - start + 1);

  let column = 0;
  for (let i = start; i < end; i++) {
    const end = editor.document.lineAt(i).range.end.character;
    if (end > column) {
      column = end;
    }
  }

  lines.forEach((line, i) => {

    const offset = column - editor.document.lineAt(start+i).range.end.character;
    const decorationType = vscode.window.createTextEditorDecorationType({
      after: {
        contentText: line,
        margin: `0 0 0 ${offset + 10}ch`,
        backgroundColor: priorityToColour(priority),
      },
      isWholeLine: true,
    });
    editor.setDecorations(decorationType, [new vscode.Range(new vscode.Position(start + i, 0), new vscode.Position(start + i, 0))]);
  });
}

function splitText(text: string, nLines: number): string[] {
  const words = text.split(" ");
  let lines: string[] = [];
  let i = 0;
  for (let j = 0; j < nLines; j++) {
    let line = "";
    while (line.length < CHARS_PER_LINE && i < words.length) {
      line += " " + words[i];
      i++;
    }
    lines.push(line.trimLeft());
  }
  return lines;
}

function priorityToColour(priority: Priority): string {
  return {
    "HIGH": "red",
    "MEDIUM": "#f9bf3b",
    "LOW": "green"
  }[priority];
}