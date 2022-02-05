//
// Copyright (c) 2016 Cisco Systems
// Licensed under the MIT License
//
/*
 * a Webex Teams Integration based on Node.js, that acts on user's behalf.
 * implements the Webex OAuth flow, to retreive an API access tokens.
 *
 * See documentation: https://developer.webex.com/authentication.html
 *
 */

// Load environment variables from project .env file
// require("node-env-file")(__dirname + "/.env");

const debug = require("debug")("oauth");
const fine = require("debug")("oauth:fine");

const request = require("request");
const express = require("express");
const app = express();

let access_token: string | undefined = undefined;

export function getAccessToken(): string | undefined {
  return access_token
}

// const initiateURL =
// "https://webexapis.com/v1/authorize?client_id=C8609770741382a6add794423a26f06154db2ae0f6e256b6c33a8a873d7ddc0c1&response_type=code&redirect_uri=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DdQw4w9WgXcQ&scope=spark-admin%3Aworkspaces_write%20spark%3Acalls_write%20spark-admin%3Aresource_groups_read%20spark%3Aall%20spark%3Akms%20Identity%3Aone_time_password%20spark-admin%3Aroles_read%20identity%3Atokens_write%20identity%3Atokens_read&state=set_state_here";
// const join = require("path").join;

// const read = require("fs").readFileSync;
// const str = read(join(__dirname, "/www/index.ejs"), "utf8");
// const ejs = require("ejs");



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
    console.log("HERE1");
    const json = JSON.parse(body);
    access_token = json.access_token
   // console.log(json.access_token);
    // console.log(json);
    res.send({
      "code": req.query.code,
      "token": access_token
    })
  }
});

function startServer(): void {
  app.listen(8000, function () {
    console.log("Webex OAuth Integration started on port: " + 8000);
  });
}

export default startServer;
