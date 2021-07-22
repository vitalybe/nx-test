import { action, computed, observable } from "mobx";
import { mockUtils } from "common/utils/mockUtils";

export class StoreStatus {
  @observable
  error: Error | undefined;

  @computed
  get hasError(): boolean {
    return this.error !== undefined;
  }
  @action
  setError = (message: string) => {
    this.error = new Error(message);
  };
  @action
  clearError = () => {
    this.error = undefined;
  };

  static createMock(overrides?: Partial<StoreStatus>) {
    return mockUtils.createMockObject<StoreStatus>({
      hasError: false,
      error: undefined,
      setError: () => null,
      clearError: () => null,
      ...overrides,
    });
  }
}
