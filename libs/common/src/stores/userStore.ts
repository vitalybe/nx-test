import { Ajax, NetworkError } from "common/utils/ajax";
import { action, computed, observable, runInAction } from "mobx";
import { mockUtils } from "common/utils/mockUtils";
import { devToolsStore } from "common/components/devTools/_stores/devToolsStore";
import { loggerCreator } from "common/utils/logger";
import { RouteMetadata } from "common/stores/_models/routeMetadata";
import { LOGIN_ORIGIN } from "common/backend/backendOrigin";
import { CapabilitiesApiType, SnowBallPermissionsEnum } from "common/stores/_models/CapabilitiesApiType";
import { RecordSession } from "common/utils/telemetryRecording/recordSession";
import { CommonUrls } from "common/utils/commonUrls";
import { UrlStore } from "common/stores/urlStore/urlStore";
import { CommonUrlParams } from "common/urlParams/commonUrlParams";
import { Cookies } from "common/utils/cookies";

const moduleLogger = loggerCreator(__filename);
export class UserStore {
  private constructor() {
    this.initialize();
  }

  private initializePromise?: Promise<void>;

  @observable isLoading: boolean = true;
  @observable errorStatus: number | undefined = undefined;
  @observable cqloudUserInfo: CqloudUserInfo | undefined;
  @observable capabilities: CapabilitiesApiType | undefined;
  @observable routesMetadata: RouteMetadata[][] = [];

  checkHasCapability(capabilityName: string): boolean {
    return !!this.capabilities?.permissions?.qcServices[capabilityName];
  }

  get isSuperUser(): boolean {
    return UserStore.instance.checkHasCapability("contentManagementAdmin");
  }

  @computed get isQwiltUser(): boolean {
    const forceNotQwiltUser = UrlStore.getInstance<CommonUrlParams>().getParamExists(
      CommonUrlParams.forcePretendNotQwiltUser
    );
    if (forceNotQwiltUser) {
      return false;
    } else {
      return !!this.cqloudUserInfo?.email.endsWith("@qwilt.com");
    }
  }

  private recordGoogleAnalyticsDomain(email: string) {
    let userMailDomain;
    try {
      userMailDomain = email.split("@")[1];
    } catch (e) {
      moduleLogger.warn("failed to get user mail domain");
      userMailDomain = "N/A";
    }

    // @ts-ignore
    window.gtag("event", "user_login", { "User Mail Domain": userMailDomain });
  }

  private getUserInfoFromCookie(): CqloudUserInfo | undefined {
    let result: CqloudUserInfo | undefined;
    const userDetails = Cookies.get("userDetails");
    if (userDetails) {
      const userDetailsParsed = JSON.parse(userDetails);
      if (userDetailsParsed || userDetailsParsed.email || userDetailsParsed.fullName) {
        result = userDetailsParsed;
      } else {
        moduleLogger.warn(`failed to parse userDetails cookie`);
      }
    } else {
      moduleLogger.warn(`failed to get userDetails cookie`);
    }

    return result;
  }

  @action
  async initialize() {
    if (!this.initializePromise) {
      this.initializePromise = (async () => {
        let isRedirecting = false;
        try {
          if (!devToolsStore.isMockMode) {
            // New stormpath requires the username to provide user info
            const userInfoFromCookie = this.getUserInfoFromCookie();
            // Backward compatability to older stormpath
            const targetUrl = `${LOGIN_ORIGIN}/me?api=true&username=${userInfoFromCookie?.email ?? ""}`;
            const userInfoFromStormPath = (await Ajax.getJson(targetUrl)) as { account: CqloudUserInfo };

            runInAction(() => {
              this.cqloudUserInfo = userInfoFromStormPath.account;
              const account = this.cqloudUserInfo;
              RecordSession.init(account.fullName, account.email, this.isQwiltUser);

              try {
                this.recordGoogleAnalyticsDomain(this.cqloudUserInfo.email);
              } catch (e) {
                moduleLogger.warn("failed to update google analytics");
              }
            });
          } else {
            this.cqloudUserInfo = UserStore.createMock().cqloudUserInfo;
          }

          // sidebar will show all routes by default while in dev/localhost, ignoring permissions
          // - use this flag to obey permissions in dev/localhost.
          const isObeyPermissions = UrlStore.getInstance().getBooleanParam(CommonUrlParams.obeyPermissions);
          const isDevHostname = CommonUrls.isQcServicesDev() || CommonUrls.isQcServicesLocalhost();

          if (devToolsStore.isMockMode) {
            this.capabilities = {
              permissions: {
                qcServices: { experimentsToolbar: true },
                snowball: { readWrite: true, [SnowBallPermissionsEnum.overwriteCreationValue]: true },
              },
            };
          } else {
            this.capabilities = (await Ajax.getJson(
              `${LOGIN_ORIGIN}/api/1.0/capabilities/frontend`
            )) as CapabilitiesApiType;
          }

          const qcServicesPermissions: string[] = Object.keys(this.capabilities.permissions.qcServices);

          try {
            const routeGroups = (await Ajax.getJson(
              CommonUrls.qcServicesUrl + "/data/sidebar-v2.json"
            )) as RouteMetadata[][];

            runInAction(() => {
              this.routesMetadata =
                !isObeyPermissions && isDevHostname
                  ? routeGroups
                  : this.filterRoutesByPermissions(routeGroups, qcServicesPermissions);
            });
          } catch (e) {
            if (location.hostname !== CommonUrls.LOCALHOST_INDICATOR) {
              moduleLogger.warn("failed to load routes", e);
            }
          }
        } catch (e) {
          moduleLogger.warn("authentication failed", e);
          if (e instanceof NetworkError) {
            e = e as NetworkError;
            if (e.status === 302) {
              isRedirecting = true;
            }
            // this can happen if user has both dev and production cookies. logging in again should clear it up
            // since production always logs out on logins, even on env logins
            else if (e.status === 400) {
              Ajax.redirectToLogin();
              isRedirecting = true;
            } else {
              this.errorStatus = e.status;
            }
          }
        } finally {
          runInAction(() => {
            this.isLoading = isRedirecting;
          });
        }
      })();
    }

    return await this.initializePromise;
  }

  private filterRoutesByPermissions(routeGroups: RouteMetadata[][], qcServicesPermissions: string[]) {
    const filteredRouteGroups = [];
    for (const list of routeGroups) {
      const group = [];

      for (const route of list) {
        const { capabilityId } = route;
        //filtering route children
        let children;
        if (route.children) {
          children = [];
          for (const child of route.children) {
            if (!child.capabilityId || (child.capabilityId && qcServicesPermissions.includes(child.capabilityId))) {
              children.push(child);
            }
          }
        }

        const isCapability = capabilityId && qcServicesPermissions.includes(capabilityId);
        const isParentOfCapabilities = !capabilityId && children && children.length > 0;

        if (isCapability || isParentOfCapabilities) {
          group.push({ ...route, children });
        }
      }
      if (group.length > 0) {
        filteredRouteGroups.push(group);
      }
    }

    return filteredRouteGroups;
  }
  private static _instance: UserStore | undefined;
  static get instance(): UserStore {
    if (!this._instance) {
      this._instance = new UserStore();
    }

    return this._instance;
  }

  static createMock(overrides?: Partial<UserStore>) {
    return mockUtils.createMockObject<UserStore>({
      isLoading: false,
      errorStatus: undefined,
      capabilities: undefined,
      routesMetadata: [],
      cqloudUserInfo: {
        fullName: "Mock Mockman",
        email: "mock@qwilt.com",
        username: "mock@qwilt.com",
      },
      initialize: mockUtils.mockAsyncAction("initialize"),
      isQwiltUser: false,
      isSuperUser: false,
      checkHasCapability: (): boolean => true,
      ...overrides,
    });
  }
}

export interface CqloudUserInfo {
  fullName: string;
  email: string;
  username: string;
}
