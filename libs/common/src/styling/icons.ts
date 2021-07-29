import {
  faAlignJustify,
  faAngleDown,
  faAngleRight,
  faAngleUp,
  faCaretDown,
  faCaretRight,
  faCaretUp,
  faCertificate,
  faCheck,
  faChevronCircleRight,
  faChevronLeft,
  faCogs,
  faCompress,
  faCopy,
  faCube,
  faDotCircle,
  faEdit,
  faExchangeAlt,
  faExpand,
  faExternalLinkAlt,
  faEye,
  faFilter,
  faGlobe,
  faGlobeAmericas,
  faHdd,
  faHockeyPuck,
  faNetworkWired,
  faObjectGroup,
  faObjectUngroup,
  faPlayCircle,
  faPlug,
  faPlus,
  faPlusCircle,
  faProjectDiagram,
  faSearch,
  faServer,
  faShoePrints,
  faSpinner,
  faStamp,
  faTags,
  faTimes,
  faTrashAlt,
  faWifi,
} from "@fortawesome/free-solid-svg-icons";
import { DeploymentEntity } from "../domain/qwiltDeployment/deploymentEntity";
import { EntityTypeEnum } from "../backend/qnDeployment/_types/entitiesApiType";
import { loggerCreator } from "../utils/logger";
import { QnDeploymentEntity } from "../domain/qwiltDeployment/qnDeploymentEntity";

interface DeploymentIconOptions {
  isBold?: boolean;
  hideIspIcon?: boolean;
}

// @ts-ignore
const entitiesIconsCtx = require.context("../images/deploymentEntities");

// @ts-ignore
const ispIconsCtx = require.context("../images/isps/icons");

const ispIcon = require("../images/no-isp.svg");
const qnIcon = entitiesIconsCtx("./node-regular.svg");
const qnIconBold = entitiesIconsCtx("./node-selected.svg");
const marketIconBold = entitiesIconsCtx("./market-selected.svg");
const marketIcon = entitiesIconsCtx("./market-regular.svg");
const siteIconBold = entitiesIconsCtx("./site-selected.svg");
const siteIcon = entitiesIconsCtx("./site-regular.svg");

const moduleLogger = loggerCreator("__filename");

export class Icons {
  // Actions
  public static readonly ADD = faPlusCircle;
  public static readonly EDIT = faEdit;
  public static readonly VIEW = faEye;
  public static readonly DELETE = faTrashAlt;
  public static readonly SEARCH = faSearch;
  public static readonly CHECK = faCheck;
  public static readonly CONVERT_TO_DELIVERY_UNIT = faPlug;
  public static readonly TAGS = faTags;
  public static readonly CARET_UP = faCaretUp;
  public static readonly CARET_RIGHT = faCaretRight;
  public static readonly CARET_DOWN = faCaretDown;
  public static readonly ANGLE_UP = faAngleUp;
  public static readonly ANGLE_RIGHT = faAngleRight;
  public static readonly ANGLE_DOWN = faAngleDown;
  public static readonly CHEVRON_LEFT = faChevronLeft;
  public static readonly COMPARE = faExchangeAlt;
  public static readonly COPY = faCopy;
  public static readonly EXPAND = faExpand;
  public static readonly COMPRESS = faCompress;
  public static readonly CLOSE = faTimes;
  public static readonly LINK = faExternalLinkAlt;
  public static readonly BATCH = faCogs;

  // Elements
  public static readonly FILTER = faFilter;
  public static readonly SPINNER = faSpinner;

  // Entities
  public static readonly CDN = faGlobe;
  public static readonly CERTIFICATE = faCertificate;
  public static readonly LOCATION = faGlobeAmericas;
  public static readonly DELIVERY_UNIT_GROUP = faObjectGroup;
  public static readonly DELIVERY_UNIT_GROUP_MID = faObjectUngroup;
  public static readonly CACHE = faCube;
  public static readonly DELIVERY_UNIT = faHdd;
  public static readonly DELIVERY_SERVICE = faPlayCircle;
  public static readonly DELIVERY_SERVICE_TEMPLATE = faStamp;
  public static readonly NETWORK = faProjectDiagram;

  public static readonly DNS_SEGMENT = faAlignJustify;
  public static readonly MONITOR_SEGMENT = faAlignJustify;
  public static readonly DNS_RECORD = faHockeyPuck;
  public static readonly REVISION = faDotCircle;
  public static readonly REVISION_PARENT = faChevronCircleRight;
  public static readonly FOOTPRINT_ELEMENT = faShoePrints;

  public static readonly MONITOR = faServer;
  public static readonly DNS_ROUTER = faNetworkWired;
  public static readonly HTTP_ROUTER = faWifi;
  public static readonly HEALTH_COLLECTOR = faPlus;
  public static readonly HTTP_ROUTER_GROUP = require("../images/wifi-group.svg");
  public static readonly ISP_PLACEHOLDER = ispIcon;
  public static readonly CP_PLACEHOLDER = ispIcon;

  static getDeploymentEntityIcon(
    entity: DeploymentEntity | QnDeploymentEntity,
    { isBold = false, hideIspIcon = false }: DeploymentIconOptions = {}
  ) {
    if (entity instanceof QnDeploymentEntity || entity.type === EntityTypeEnum.QN) {
      return isBold ? qnIconBold : qnIcon;
    }
    if (entity.type === EntityTypeEnum.SITE) {
      return isBold ? siteIconBold : siteIcon;
    }
    if (entity.type === EntityTypeEnum.MARKET) {
      return isBold ? marketIconBold : marketIcon;
    }
    if (entity.type === EntityTypeEnum.NETWORK) {
      let ispIconPath;
      if (!hideIspIcon) {
        try {
          ispIconPath = ispIconsCtx(`./${entity.uniqueName}.png`);
        } catch (e) {
          moduleLogger.warn("could not find isp icon for: " + entity.uniqueName);
        }
      }

      if (!ispIconPath) {
        try {
          ispIconPath = ispIcon;
        } catch (e) {
          moduleLogger.warn("could not find isps fallback icon");
        }
      }
      return ispIconPath;
    }
  }
}
