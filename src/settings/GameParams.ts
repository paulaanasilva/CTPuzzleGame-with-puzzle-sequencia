export default class GameParams {
  urlToInstantiateItem: string;
  operation: string;
  dataUrl: string;

  constructor(params: URLSearchParams) {
    if (params) {
      this.operation = params.get("op");
      this.dataUrl = params.get("dataUrl");
      this.urlToInstantiateItem = params.get("urlToInstantiateItem");
    }
  }

  isAutomaticTesting() {
    return this.operation == "testing";
  }

  isPlaygroundTest(): boolean {
    return this.operation == "playground";
  }

  isTestApplication(): boolean {
    return this.operation == "application";
  }

  isItemToPlay(): boolean {
    return this.operation == "play";
  }
}
