import {
  HealthProviderApiType,
  ServerApiTypeV2,
} from "@qwilt/common/backend/trafficRoutersMonitors/_types/trafficRoutersMonitorsTypes";
import { HealthProviderEntity } from "../../_domain/healthProvider/healthProviderEntity";
import { HealthProviderFormType } from "../../_domain/healthProvider/healthProviderFormType";

export class MonitorsAndRoutersProviderUtils {
  static toServerEntity(serverApiEntity: ServerApiTypeV2) {
    return {
      domain: serverApiEntity.domain,
      hostname: serverApiEntity.hostname,
      httpsPort: serverApiEntity.httpsPort,
      ipv4Address: serverApiEntity.ipv4Address ?? "",
      ipv6Address: serverApiEntity.ipv6Address ?? "",
      systemId: serverApiEntity.systemId,
      tcpPort: serverApiEntity.tcpPort,
    };
  }

  static toHealthProviderEntities(apiEntities: HealthProviderApiType[]): HealthProviderEntity[] {
    return apiEntities.map((apiResult) => ({
      hostname: apiResult.name,
      priority: apiResult.priority,
    }));
  }

  static toHealthProviderApiEntity(formEntities: HealthProviderFormType[]) {
    const healthProviders: HealthProviderApiType[] = formEntities.map((item) => ({
      name: item.hostname,
      priority: item.priority,
    }));

    return healthProviders;
  }
}
