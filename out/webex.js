"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccessToken = void 0;
const request = require("request");
const express = require("express");
const app = express();
let access_token = undefined;
function getAccessToken() {
    return access_token;
}
exports.getAccessToken = getAccessToken;
app.get("/", (req, res) => {
    const options = {
        method: "POST",
        url: "https://api.ciscospark.com/v1/access_token",
        headers: {
            "content-type": "application/x-www-form-urlencoded",
        },
        form: {
            grant_type: "authorization_code",
            client_id: "C8609770741382a6add794423a26f06154db2ae0f6e256b6c33a8a873d7ddc0c1",
            client_secret: "728b1bfae38f8ded8cc6160bc777f53f1dbf57b85be2fb592942ade5f403166a",
            code: req.query.code,
            redirect_uri: "http://localhost:8000",
        },
    };
    request(options, (error, response, body) => {
        const json = JSON.parse(body);
        access_token = json.access_token;
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
    `);
        app.close();
    });
});
function startServer() {
    app.listen(8000, function () {
        console.log("Webex OAuth Integration started on port: " + 8000);
    });
}
exports.default = startServer;
//# sourceMappingURL=webex.js.map