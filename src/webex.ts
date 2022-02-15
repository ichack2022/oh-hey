import { AuthProvider } from "./auth";
import { LocalStorageService } from "./localStorage";
import * as vscode from "vscode";
import { displayMessage } from "./message";

const request = require("request");
const express = require("express");
const app = express();
const Webex = require(`webex`);

let webex: any | undefined = undefined;

export function getWebex(
  storageManager: LocalStorageService,
  authProvider: AuthProvider
) {
  let at = getAccessToken(storageManager, authProvider);
  webex = Webex.init({
    credentials: {
      access_token: at,
    },
  });
  const listening = webex !== undefined;

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

function getAccessToken(
  storageManager: LocalStorageService,
  authProvider: AuthProvider
): string {
  let accessToken: string = storageManager.getValue("access_token");

  if (accessToken === null) {
    vscode.env.openExternal(vscode.Uri.parse(authProvider.authorizationURL));
    app.get("/", async (req: any, res: any) => {
      const options = {
        method: "POST",
        url: authProvider.authenticationURL,
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },

        // TODO!: UPDATE BEOFRE MAKING REPO PUBLIC
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
