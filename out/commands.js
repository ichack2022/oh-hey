"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendCodeMessage = void 0;
const vscode = require("vscode");
const git_1 = require("./git");
const webex_1 = require("./webex");
async function sendCodeMessage(storeManager) {
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
    let webex = (0, webex_1.getWebex)(storeManager);
    console.log("Got webex while sending message", webex);
    // webex.rooms
    //   .list({ max: 100 })
    //   .then((r: any) => console.log("rooms", r.items));
    let teams = webex.teams
        .list({ max: 10 })
        .then((teams) => {
        console.log(teams.items);
        return teams.items.filter((team) => team.name === "WACC")[0];
    })
        .then((team) => {
        console.log("TEAM", team);
        return webex.teamMemberships.list({ teamId: team.id });
    })
        .then((membership) => {
        console.log(membership.items);
        return membership.items.filter((m) => m.personEmail === "at619@ic.ac.uk")[0];
    })
        .then((person) => {
        console.log("PERSON", person);
        return webex.messages.create({
            markdown: `
\`\`\`
${text}
\`\`\`
              `,
            toPersonId: person.personId,
        });
    });
    // webex.rooms.create({ title: `My Second Room` }).then((room: any) => {
    //   console.log("creating a room");
    //   return Promise.all([
    //     webex.memberships.create({
    //       roomId: room.id,
    //       personEmail: `at619@ic.ac.uk`,
    //     }),
    //   ]).then(() => {
    //     console.log("sending a message");
    //     return webex.messages.create({
    //       markdown: `
    //       \`\`\`
    //         ${text}
    //       \`\`\`
    //       `,
    //       roomId: room.id,
    //     });
    //   });
    // });
    vscode.window.showInformationMessage(`Authors: ${authors}`);
    // vscode.window.showInformationMessage(`File: ${path} Text: ${text} from ${start}, ${end}`);
}
exports.sendCodeMessage = sendCodeMessage;
//# sourceMappingURL=commands.js.map