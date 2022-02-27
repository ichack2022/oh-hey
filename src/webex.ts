import { LocalStorageService } from "./localStorage";
import * as vscode from "vscode";
import { displayMessage } from "./message";

const request = require("request");
const express = require("express");
const app = express();
const Webex = require(`webex`);

let webex: any | undefined = undefined;

export function getWebex(storageManager: LocalStorageService) {
  let at = getAccessToken(storageManager);
  const listening = webex !== undefined;
  webex = Webex.init({
    credentials: {
      access_token: at,
    },
  });

  if (!listening) {
    console.log("listening");
    webex.messages
      .listen()
      .then(() => {
        console.log("listening to message events");
        webex.messages.on("created", (event: any) => {
          console.log(event);
          displayMessage(event, webex);
        });
        webex.messages.on("deleted", (event: any) =>
          console.log(`Got a message:deleted event:\n${event}`)
        );
      })
      .catch((e: any) =>
        console.error(`Unable to register for message events: ${e}`)
      );
  }

  console.log("Returning webex with access_token ", at);
  return webex;
}

function getAccessToken(storageManager: LocalStorageService): string {
  let accessToken: string = storageManager.getValue("access_token");

  if (accessToken === null) {
    vscode.env.openExternal(
      vscode.Uri.parse("https://dev-messages-server.herokuapp.com/webex")
    );
    app.get("/", async (req: any, res: any) => {
      const encodedJSON = req.query.json;

      const decodedJSON = Buffer.from(encodedJSON, "base64").toString();
      console.log("JSON", decodedJSON);

      const json = JSON.parse(decodedJSON);
      accessToken = json.access_token;
      storageManager.setValue("access_token", accessToken);
      res.send(`
        <h1>Success! Feel free to close this :)</h1>
        <script>
          console.log("Closing in 3 seconds");
          setTimeout(() => {
            window.close()
          }, 3000);
        </script>
        `);
    });

    app.listen(3000, function () {
      console.log("Webex OAuth Integration started on port: " + 8000);
    });
  }

  return accessToken;
}
