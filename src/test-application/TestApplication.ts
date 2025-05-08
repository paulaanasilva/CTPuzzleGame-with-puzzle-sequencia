import { Mecanica } from "../ct-platform-classes/Mecanica";

export class TestApplication {
  name: string;
  url: string;
}

export class UrlHelper {
  method: string;
  url: string;
  help: string;
}

export class PreparedParticipation {
  test: Test;
  urlToEndOfTestQuiz: UrlHelper;
  urlToSendResponses: UrlHelper;
}

export class Test {
  items: TestItem[];
}

export class TestItem {
  id: number;
  url: string;
  item: Mecanica;
  hasResponse: boolean;
}
