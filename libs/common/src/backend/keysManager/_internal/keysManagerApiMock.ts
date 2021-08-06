import { sleep } from "../../../utils/sleep";
import { KeysManagerApi } from "../../keysManager";
import {
  KeysManagerKeysApiResult,
  KeysManagerKeysSetsApiResult,
} from "../_types/keysManagerTypes";
import { loggerCreator } from "../../../utils/logger";
import { mockNetworkSleep } from "../../../utils/mockUtils";

const moduleLogger = loggerCreator("__filename");

export class KeysManagerApiMock extends KeysManagerApi {
  async listKeys(): Promise<KeysManagerKeysApiResult> {
    await sleep(mockNetworkSleep);

    return {
      keys: [
        {
          type: "g2o",
          description: "bla bla",
          name: "newg2okeyT",
          tags: {
            nonce: "test",
          },
          ownerOrgId: "devorg",
          id: 1,
          sha512:
            "fedcabd923a52b09ebb06808bc91d60a4e35ecc99f45de694f44e4998103cf05e69229a60c67fcaef42fdd87e8d25ca6450f613e2e32dcc8a7732da4aba7123b",
        },
        {
          type: "g2o",
          description: "bla bla",
          name: "newg2okeyT2",
          tags: {
            nonce: "test1",
          },
          ownerOrgId: "devorg",
          id: 2,
          sha512:
            "fedcabd923a52b09ebb06808bc91d60a4e35ecc99f45de694f44e4998103cf05e69229a60c67fcaef42fdd87e8d25ca6450f613e2e32dcc8a7732da4aba7123b",
        },
        {
          type: "g2o",
          description: "bla bla",
          name: "newg2okeyT",
          tags: {
            nonce: "test1",
          },
          ownerOrgId: "devorg",
          id: 4,
          sha512:
            "fedcabd923a52b09ebb06808bc91d60a4e35ecc99f45de694f44e4998103cf05e69229a60c67fcaef42fdd87e8d25ca6450f613e2e32dcc8a7732da4aba7123b",
        },
        {
          type: "g2o",
          description: "bla bla",
          name: "newg2okeyT",
          tags: {
            nonce: "test1",
          },
          ownerOrgId: "devorg",
          id: 5,
          sha512:
            "fedcabd923a52b09ebb06808bc91d60a4e35ecc99f45de694f44e4998103cf05e69229a60c67fcaef42fdd87e8d25ca6450f613e2e32dcc8a7732da4aba7123b",
        },
        {
          type: "g2o",
          description: "bla bla",
          name: "newg2okeyT",
          tags: {
            nonce: "test1",
          },
          ownerOrgId: "devorg",
          id: 6,
          sha512:
            "fedcabd923a52b09ebb06808bc91d60a4e35ecc99f45de694f44e4998103cf05e69229a60c67fcaef42fdd87e8d25ca6450f613e2e32dcc8a7732da4aba7123b",
        },
        {
          type: "g2o",
          description: "new key gen",
          name: "newg2okeyT",
          tags: {
            nonce: "test2",
          },
          ownerOrgId: "devorg",
          id: 7,
          sha512:
            "fedcabd923a52b09ebb06808bc91d60a4e35ecc99f45de694f44e4998103cf05e69229a60c67fcaef42fdd87e8d25ca6450f613e2e32dcc8a7732da4aba7123b",
        },
        {
          type: "g2o",
          description: "new key gen",
          name: "newg2okeyT",
          tags: {
            nonce: "test2",
          },
          ownerOrgId: "devorg",
          id: 8,
          sha512:
            "fedcabd923a52b09ebb06808bc91d60a4e35ecc99f45de694f44e4998103cf05e69229a60c67fcaef42fdd87e8d25ca6450f613e2e32dcc8a7732da4aba7123b",
        },
        {
          type: "g2o",
          description: "new key gen",
          name: "newg2okeyT",
          tags: {
            nonce: "test2",
          },
          ownerOrgId: "devorg",
          id: 9,
          sha512:
            "fedcabd923a52b09ebb06808bc91d60a4e35ecc99f45de694f44e4998103cf05e69229a60c67fcaef42fdd87e8d25ca6450f613e2e32dcc8a7732da4aba7123b",
        },
        {
          type: "g2o",
          description: "new key gen",
          name: "newg2okeyT",
          tags: {
            nonce: "test2",
          },
          ownerOrgId: "devorg",
          id: 10,
          sha512:
            "fedcabd923a52b09ebb06808bc91d60a4e35ecc99f45de694f44e4998103cf05e69229a60c67fcaef42fdd87e8d25ca6450f613e2e32dcc8a7732da4aba7123b",
        },
        {
          type: "g2o",
          description: "new key gen",
          name: "newg2okeyT",
          tags: {
            nonce: "test2",
          },
          ownerOrgId: "devorg",
          id: 11,
          sha512:
            "fedcabd923a52b09ebb06808bc91d60a4e35ecc99f45de694f44e4998103cf05e69229a60c67fcaef42fdd87e8d25ca6450f613e2e32dcc8a7732da4aba7123b",
        },
        {
          type: "g2o",
          description: "g2o key 2",
          name: "g2o-key-2",
          tags: {
            nonce: "test2",
          },
          keySetId: 1,
          ownerOrgId: "devorg",
          id: 12,
          sha512:
            "fedcabd923a52b09ebb06808bc91d60a4e35ecc99f45de694f44e4998103cf05e69229a60c67fcaef42fdd87e8d25ca6450f613e2e32dcc8a7732da4aba7123b",
        },
        {
          type: "g2o",
          description: "g2o key 1",
          name: "g2o-key-1",
          tags: {
            nonce: "test2",
          },
          keySetId: 1,
          ownerOrgId: "devorg",
          id: 13,
          sha512:
            "fedcabd923a52b09ebb06808bc91d60a4e35ecc99f45de694f44e4998103cf05e69229a60c67fcaef42fdd87e8d25ca6450f613e2e32dcc8a7732da4aba7123b",
        },
      ],
    };
  }

  async updateKey() {
    await sleep(mockNetworkSleep);
  }

  async addKey() {
    await sleep(mockNetworkSleep);
  }

  async deleteKey() {
    await sleep(mockNetworkSleep);
  }

  async listKeySets(): Promise<KeysManagerKeysSetsApiResult> {
    await sleep(mockNetworkSleep);

    return {
      keySets: [
        {
          type: "g2o",
          description: "amiry g2o",
          name: "amiry-g2o-1",
          ownerOrgId: "devorg",
          id: 1,
        },
        {
          type: "urlsigning",
          description: "amiry url signing",
          name: "amiry-url-signing-1",
          ownerOrgId: "devorg",
          id: 2,
        },
      ],
    };
  }

  async updateKeySet() {
    await sleep(mockNetworkSleep);
  }

  async addKeySet() {
    await sleep(mockNetworkSleep);
  }

  async deleteKeySet() {
    await sleep(mockNetworkSleep);
  }

  //region [[ Singleton ]]
  protected static _instance: KeysManagerApiMock | undefined;
  static get instance(): KeysManagerApiMock {
    if (!this._instance) {
      this._instance = new KeysManagerApiMock();
    }

    return this._instance;
  }
  //endregion

  //region [[ Mock config ]]
  private getDefaultMockConfig() {
    return {
      sampleText: "very mock",
    };
  }
  mockConfig: KeysManagerApiMockConfig = this.getDefaultMockConfig();
  //endregion
}

//region [[ Mock config types ]]
interface KeysManagerApiMockConfig {
  sampleText: string;
}
//endregion
