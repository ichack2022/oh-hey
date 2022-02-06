import * as vscode from "vscode";
import { recievedRepliesBox } from "./commands";

const CHARS_PER_LINE = 80;
export type Priority = "HIGH" | "MEDIUM" | "LOW";

type Message = {
  author: string,
  filename: string,
  lineStart: number,
  lineEnd: number,
  message: string,
  priority: Priority
};

export async function displayMessage(event: any, webex: any) {
  let message = await parseMessage(event, webex);
  display(message.filename, message.message, message.lineStart-1, message.lineEnd, message.priority);
  recievedRepliesBox(message.author, message.filename, message.lineStart, message.lineEnd, message.message);
}

async function parseMessage(event: any, webex: any): Promise<Message> {
  const data = event.data;
  const rawText: string = data.text;
  const person = await webex.people.get(event.actorId);
  const author = person.displayName;

  console.log(rawText, rawText.indexOf("‌"));
  const msg = rawText.slice(0, rawText.indexOf("‌"));
  const priority = /Priority: (.*)/.exec(rawText)![1] as Priority;
  const lines = /Lines: ([0-9]*)-([0-9]*)/.exec(rawText)!;
  const start = parseInt(lines[1]);
  const end = parseInt(lines[2]);

  return {
    author: author,
    filename: "",
    lineStart: start,
    lineEnd: end,
    message: msg,
    priority: priority,
  };
}


function display(filename: string, text: string, start: number, end: number, priority: Priority) {
  let editor = vscode.window.activeTextEditor!;
  // if (editor.document.fileName !== filename) {
  //   return;
  // }
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