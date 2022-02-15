import { quickSelectBox, QuickSelectItem } from "./ui";
import * as vscode from "vscode";

export interface AuthProvider {
  readonly authorizationURL: string;
  readonly authenticationURL: string;
  readonly label: string;
}

const webexAuth: AuthProvider = {
  label: "Cisco Webex",
  authorizationURL:
    "https://webexapis.com/v1/authorize?client_id=C8609770741382a6add794423a26f06154db2ae0f6e256b6c33a8a873d7ddc0c1&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A8000&scope=spark-admin%3Aworkspaces_write%20spark%3Acalls_write%20spark-admin%3Aresource_groups_read%20spark%3Aall%20spark%3Akms%20Identity%3Aone_time_password%20spark-admin%3Aroles_read%20identity%3Atokens_write%20identity%3Atokens_read&state=set_state_here",
  authenticationURL: "https://api.ciscospark.com/v1/access_token",
};

const teamsAuth: AuthProvider = {
  label: "MS Teams",
  authorizationURL: "TODO",
  authenticationURL: "TODO",
};

export const authProviders: AuthProvider[] = [webexAuth, teamsAuth];

export async function login() {
  const loginSelectItems: QuickSelectItem<AuthProvider>[] = authProviders.map(
    (ap) => {
      return new QuickSelectItem(ap.label, "", ap);
    }
  );

  const selectedLoginOpt = await quickSelectBox<AuthProvider>(
    "Please choose a login option",
    loginSelectItems
  );

  if (selectedLoginOpt.label !== "Cisco Webex") {
    vscode.window.showErrorMessage("SUPPORT COMING SOON!");
    return webexAuth;
  }

  return selectedLoginOpt;
}

export default webexAuth;
