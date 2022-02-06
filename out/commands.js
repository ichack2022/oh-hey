"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuickSelectItem = exports.quickSelectBox = exports.getInputBox = exports.sendCodeMessage = void 0;
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
// Gets the input from an input box and returns it
async function getInputBox(message) {
    let editor = vscode.window.activeTextEditor;
    const res = await vscode.window.showInputBox({
        placeHolder: message,
        value: editor?.document.getText(editor?.selection),
    });
    return res ?? "";
}
exports.getInputBox = getInputBox;
// Takes in a list of Quick Select items and a placeholder, retunrs the chosen Quick Select object
// const items = [
//     new QuickSelectItem("Alice", "alice@example.com"),
//     new QuickSelectItem("Bob", "bob@example.com"),
//     new QuickSelectItem("Charlie", "charlie@example.com"),
//     new QuickSelectItem("Dave", "dave@example.com"),
//    ];
//    const resp3 = await quickSelectBox("Pick one", items);
async function quickSelectBox(message, items) {
    const res = await vscode.window.showQuickPick(items, { placeHolder: message });
    return res;
}
exports.quickSelectBox = quickSelectBox;
class QuickSelectItem {
    constructor(label, description) {
        this.label = label;
        this.description = description;
    }
}
exports.QuickSelectItem = QuickSelectItem;
//# sourceMappingURL=commands.js.map