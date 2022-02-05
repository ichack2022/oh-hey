"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendCodeMessage = void 0;
const vscode = require("vscode");
const git_1 = require("./git");
const webex_1 = require("./webex");
const accessToken = (0, webex_1.getAccessToken)();
const Webex = require(`webex`);
const webex = Webex.init({
    credentials: {
        access_token: accessToken,
    },
});
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
    webex.rooms.create({ title: `My Second Room` }).then((room) => {
        return Promise.all([
            webex.memberships.create({
                roomId: room.id,
                personEmail: `pranavbansal19@imperial.ac.uk`,
            }),
        ]).then(() => webex.messages.create({
            markdown: `${text}`,
            roomId: room.id,
        }));
    });
    vscode.window.showInformationMessage(`Authors: ${authors}`);
    // vscode.window.showInformationMessage(`File: ${path} Text: ${text} from ${start}, ${end}`);
}
exports.sendCodeMessage = sendCodeMessage;
//# sourceMappingURL=commands.js.map