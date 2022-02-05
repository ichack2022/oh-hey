"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendCodeMessage = void 0;
const vscode = require("vscode");
const git_1 = require("./git");
async function sendCodeMessage() {
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        return; // No open text editor
    }
    const selection = editor.selection;
    const start = selection.start.line + 1;
    const end = selection.end.line + 1;
    const text = editor.document.getText(selection);
    const path = editor.document.fileName;
    const authors = await (0, git_1.get_authors)(path, start, end);
    vscode.window.showInformationMessage(`Authors: ${authors}`);
    // vscode.window.showInformationMessage(`File: ${path} Text: ${text} from ${start}, ${end}`);
}
exports.sendCodeMessage = sendCodeMessage;
//# sourceMappingURL=commands.js.map