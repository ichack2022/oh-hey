import fetch from "node-fetch";

const Webex = require(`webex`);
const webex = Webex.init({
  credentials: {
    access_token:
      "NWYyYmE4YTgtODkxZi00NDhkLWE1ZDEtM2VhNGQzZWMzZDYzOWRiYTFlNTEtM2Ux_PF84_3f179706-f11a-4ab7-ba3e-57a4a96b089f",
  },
});

async function auth() {
  const res = await fetch(
    "https://webexapis.com/v1/authorize?client_id=C8609770741382a6add794423a26f06154db2ae0f6e256b6c33a8a873d7ddc0c1&response_type=code&redirect_uri=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DdQw4w9WgXcQ&scope=spark-admin%3Aworkspaces_write%20spark%3Acalls_write%20spark-admin%3Aresource_groups_read%20spark%3Aall%20spark%3Akms%20Identity%3Aone_time_password%20spark-admin%3Aroles_read%20identity%3Atokens_write%20identity%3Atokens_read&state=set_state_here"
  );
}

export default auth().then(() => {
  // Create a room with the title "My First Room"
  // Add Alice and Bob to the room
  // Send a **Hi Everyone** message to the room
  webex.rooms.create({ title: `My Second Room` }).then((room) => {
    return Promise.all([
      webex.memberships.create({
        roomId: room.id,
        personEmail: `pranavbansal19@imperial.ac.uk`,
      }),
    ]).then(() =>
      webex.messages.create({
        markdown: `**Hi Everyone**`,
        roomId: room.id,
      })
    );
  });
});
