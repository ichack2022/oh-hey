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
    webex.messages.listen()
      .then(() => {
        console.log('listening to message events');
        webex.messages.on('created', (event: any) => {
          console.log(event);
          displayMessage(event, webex);
        });
        webex.messages.on('deleted', (event: any) => console.log(`Got a message:deleted event:\n${event}`));
      })
      .catch((e: any) => console.error(`Unable to register for message events: ${e}`));
  }

  console.log("Returning webex with access_token ", at);
  return webex;
}

function getAccessToken(storageManager: LocalStorageService): string {
  let accessToken: string = storageManager.getValue("access_token");

  if (accessToken === null) {
    vscode.env.openExternal(
      vscode.Uri.parse(
        "https://webexapis.com/v1/authorize?client_id=C8609770741382a6add794423a26f06154db2ae0f6e256b6c33a8a873d7ddc0c1&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A8000&scope=spark-admin%3Aworkspaces_write%20spark%3Acalls_write%20spark-admin%3Aresource_groups_read%20spark%3Aall%20spark%3Akms%20Identity%3Aone_time_password%20spark-admin%3Aroles_read%20identity%3Atokens_write%20identity%3Atokens_read&state=set_state_here"
      )
    );
    app.get("/", (req: any, res: any) => {
      const options = {
        method: "POST",
        url: "https://api.ciscospark.com/v1/access_token",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
        form: {
          grant_type: "authorization_code",
          client_id:
            "C8609770741382a6add794423a26f06154db2ae0f6e256b6c33a8a873d7ddc0c1",
          client_secret:
            "728b1bfae38f8ded8cc6160bc777f53f1dbf57b85be2fb592942ade5f403166a",
          code: req.query.code,
          redirect_uri: "http://localhost:8000",
        },
      };
      request(options, (error: any, response: any, body: any) => {
        const json = JSON.parse(body);
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
        // app.close();
      });
    });
    app.listen(8000, function () {
      console.log("Webex OAuth Integration started on port: " + 8000);
    });
  }

  return accessToken;
}