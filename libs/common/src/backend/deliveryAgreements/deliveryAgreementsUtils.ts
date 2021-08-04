import { DeliveryAgreementApiEntity } from "./_types/deliveryAgreementsTypes";
import _ from "lodash";
import { ValidatedDeliveryAgreement } from "./_internal/deliveryAgreementsApi";

export class DeliveryAgreementsObfuscation {
  static lastId = 0;

  static obfuscateEntities<T extends DeliveryAgreementApiEntity = DeliveryAgreementApiEntity>(agreements: T[]): T[] {
    const obfuscatedList: T[] = [];
    for (const agreement of agreements) {
      obfuscatedList.push(this.commonAgreementObfuscation<T>(agreement));
    }

    return obfuscatedList;
  }

  static commonAgreementObfuscation<T extends DeliveryAgreementApiEntity = DeliveryAgreementApiEntity>(
    agreement: T
  ): T {
    const obfuscation = { ...agreement };
    if (agreement.dsMetadata) {
      obfuscation.dsMetadata = {
        ...agreement.dsMetadata,
        userFriendlyName: "Delivery Service " + this.lastId++,
      };
    }

    const commonlyHandledFields: Array<"contentPublisher" | "network" | "serviceProvider"> = [
      "contentPublisher",
      "network",
      "serviceProvider",
    ];
    commonlyHandledFields.forEach(field => {
      if (obfuscation[field]) {
        const fieldEntry: { uiName: string } = obfuscation[field]!;
        const entityKind = _.startCase(field as string);

        ((obfuscation as unknown) as { [key: string]: { uiName: string } })[field] = {
          ...fieldEntry,
          uiName: `${entityKind} ${this.lastId++}`,
        };
      }
    });

    return obfuscation as T;
  }
}

// This function is commonly used to get only agreements with all entity information (assuming those fields are truly optional).
export function validateDeliveryAgreements(agreements: DeliveryAgreementApiEntity[]): ValidatedDeliveryAgreement[] {
  return agreements.filter(
    agreement =>
      !!agreement.contentPublisher && (!!agreement.serviceProvider || !!agreement.network) && !!agreement.dsMetadata
  ) as ValidatedDeliveryAgreement[];
}
