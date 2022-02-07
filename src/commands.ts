import * as vscode from "vscode";
import { getAuthors } from "./git";
import { LocalStorageService } from "./localStorage";
import { getWebex } from "./webex";
import path = require("path");
import { getRoot } from "./git";
import {
  QuickSelectItem,
  quickSelectBox,
  getInputBox,
} from "./ui";

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

  const authors = await getAuthors(filepath, start, end);

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

          var message = {
            markdown: markdown,
            toPersonId: personId,
          };

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
