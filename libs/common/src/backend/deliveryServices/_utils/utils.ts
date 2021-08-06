import { DeliveryServicesApiType } from "../_types/deliveryServicesTypes";

export class DeliveryServicesUtils {
  static lastId = 0;

  static obfuscateDsName(deliveryServicesApiType: DeliveryServicesApiType): DeliveryServicesApiType {
    return {
      ...deliveryServicesApiType,
      name: "Delivery Service " + this.lastId++,
    };
  }
}
