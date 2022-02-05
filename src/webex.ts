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

const request = require("request");
const express = require("express");
const app = express();

let access_token: string | undefined = undefined;

export function getAccessToken(): string | undefined {
  return access_token
}

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
    access_token = json.access_token
   // console.log(json.access_token);
    // console.log(json);
    res.send(`
    <h1>Success! Feel free to close this :)</h1>
    <script>
      console.log("Closing in 3 seconds");
      setTimeout(() => {
        window.close()
      }, 3000);
    </script>
    `)
    app.close();
  }
    
});

function startServer(): void {
  app.listen(8000, function () {
    console.log("Webex OAuth Integration started on port: " + 8000);
  });
}

export default startServer;
