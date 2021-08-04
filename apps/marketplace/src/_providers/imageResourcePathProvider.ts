import { MarketplaceEntity } from "src/_domain/marketplaceEntity/marketplaceEntity";
import { MarketplaceEntityIsp } from "src/_domain/marketplaceEntity/marketplaceEntityIsp";
import { MarketplaceEntityGeo } from "src/_domain/marketplaceEntity/marketplaceEntityGeo";
import { ApiGeoEntityType } from "common/backend/geoDeployment/geoDeploymentTypes";

class ImageResourcePathProvider {
  private getCountryIso(marketplaceEntity: MarketplaceEntity): string {
    let countryIso: string = "";

    if (marketplaceEntity.type === ApiGeoEntityType.ISP) {
      if (marketplaceEntity.geoParent) {
        countryIso = this.getCountryIso(marketplaceEntity.geoParent);
      }
    } else {
      if (marketplaceEntity.type === ApiGeoEntityType.COUNTRY) {
        countryIso = (marketplaceEntity as MarketplaceEntityGeo).iso2.toLowerCase();
      } else if (marketplaceEntity.geoParent) {
        countryIso = this.getCountryIso(marketplaceEntity.geoParent);
      }
    }

    return countryIso;
  }

  provideFlagImage(marketplaceEntity: MarketplaceEntity): string | undefined {
    const countryIso = this.getCountryIso(marketplaceEntity);

    if (countryIso) {
      return `common/images/flags/${countryIso}.svg`;
    } else {
      return undefined;
    }
  }

  provideFlagImageWithFallback(marketplaceEntity: MarketplaceEntity): string {
    return this.provideFlagImage(marketplaceEntity) || `common/images/no-flag.svg`;
  }

  provideIspImage(marketplaceEntity: MarketplaceEntity): string | undefined {
    if (marketplaceEntity instanceof MarketplaceEntityIsp) {
      const formattedIspName = marketplaceEntity.name
        .toLowerCase()
        .split(" ")
        .join("-");
      return `common/images/isps/${formattedIspName}.png`;
    } else {
      return undefined;
    }
  }

  provideIspImageWithFallback(marketplaceEntity: MarketplaceEntity): string {
    return this.provideIspImage(marketplaceEntity) || `common/images/no-isp.svg`;
  }

  provideImage(marketplaceEntity: MarketplaceEntity): string | undefined {
    return this.provideIspImage(marketplaceEntity) || this.provideFlagImage(marketplaceEntity);
  }
}

export const imageResourcePathProvider = new ImageResourcePathProvider();
