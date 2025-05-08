import { RespostaItemProgramacao } from "../ct-platform-classes/RespostaItemProgramacao";
import { Logger } from "../main";
import GameParams from "../settings/GameParams";
import User from "../user/User";
import { GET, POST, PUT } from "../utils/internet";
import { getItem, getTypedItem, setItem } from "../utils/storage";
import {
  getDefaultPlatformApiUrl,
  replaceUserUuidTokenByUserHash,
} from "../utils/Utils";
import {
  PreparedParticipation,
  TestApplication,
  TestItem,
  UrlHelper,
} from "./TestApplication";

export default class TestApplicationService {
  constructor(private gameParams: GameParams) {
    Logger.info("LOADED GAME PARAMS", gameParams);
    setItem("gameParams", gameParams);
  }

  mustLoadFirstItem() {
    return this.getGameParams()?.isTestApplication();
  }

  isItemToPlay() {
    return this.getGameParams()?.isItemToPlay();
  }

  isAutoTesting() {
    return this.getGameParams().isAutomaticTesting();
  }

  isPlayground() {
    return this.getGameParams()?.isPlaygroundTest();
  }

  getPublicTestApplications(): TestApplication[] {
    return getItem("public-test-applications") as TestApplication[];
  }

  getGameParams(): GameParams {
    return getTypedItem(GameParams, "gameParams");
  }

  getCurrentPhaseString(): string {
    return getItem("progress");
  }

  get participation(): PreparedParticipation {
    return getTypedItem(PreparedParticipation, "participation");
  }

  getFirstItem(): TestItem {
    return this.participation.test.items[0];
  }

  async loadPublicApplications(): Promise<TestApplication[]> {
    let url = getDefaultPlatformApiUrl(this.gameParams);
    let testApplications = [];
    try {
      let name = "PROGRAMAÇÃO";
      let response = await GET(
        `${url}/test-applications/public/getPuplicApplicationsByMechanicName/${name}`
      );
      testApplications = await response.json();
    } catch (e) {
      Logger.error(
        "Did not succeded on load public test applications from ",
        url
      );
    }
    return testApplications;
  }

  setTestApplications(testApplications: TestApplication[]) {
    setItem("public-test-applications", testApplications);
  }

  async loadApplicationFromDataUrl(user: User) {
    try {
      let urlToGetTestApplication = this.gameParams.dataUrl;
      const urlAlreadyHasUserHash = /.*\/data\/[\w-]+\/[\w-]+/.test(
        this.gameParams.dataUrl
      );
      if (!urlAlreadyHasUserHash) {
        urlToGetTestApplication = replaceUserUuidTokenByUserHash(
          this.gameParams.dataUrl,
          user.hash
        );
      }
      let response = await GET(urlToGetTestApplication);
      let participation = (await response.json()) as PreparedParticipation;
      this.setParticipation(participation);
    } catch (e) {
      Logger.error(e);
    }
  }

  setParticipation(participation: PreparedParticipation) {
    setItem("participation", participation);
  }

  async sendResponse(
    response: RespostaItemProgramacao
  ): Promise<{ next: string }> {
    return (await POST(this.participation.urlToSendResponses.url, response)).json();
  }

  async instantiatePlaygroundItem<T>(): Promise<T> {
    let url = this.gameParams.urlToInstantiateItem;
    const response = await GET(url);
    let res = await response.json();
    if (res.participation) {
      this.setParticipation(res.participation);
      setItem("progress", res.progress);
    }
    return res.json as T;
  }
}
