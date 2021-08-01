import { getEnv, getOriginForApi } from "common/backend/backendOrigin";
import { Ajax } from "common/utils/ajax";
import { Notifier } from "common/utils/notifications/notifier";
import { GenericServerEntity } from "src/selectedCdn/tabs/tabMonitorsAndRouters/_domain/server/genericServerEntity";

export class ServerApiUtil {
  static API_URL = `${getOriginForApi("traffic-routers-monitors", getEnv())}/api/1/cdns/`;

  // NOTE: Delete when tempFlag_serversTabMoreConfigurations removed
  static async updateServer(
    server: GenericServerEntity,
    field: string,
    newValue: unknown,
    callback: () => void,
    cdnName: string
  ): Promise<boolean> {
    try {
      const SERVER_API_URL = this.API_URL + cdnName + "/traffic-routers-monitors/servers/" + server.hostname;
      const body = {
        [field]: newValue,
      };
      await Ajax.putJson(SERVER_API_URL, body);
      callback();
      return true;
    } catch (e) {
      Notifier.error("Operation failed", e);
      return false;
    }
  }
}
