import { RespostaItemProgramacao } from "../ct-platform-classes/RespostaItemProgramacao"
import { Logger } from "../main"
import { getItem, getTypedItem, removeItem, setItem } from "../utils/storage"


export default class GameState {
  setReplayingPhase(replaying: boolean) {
    setItem("replaying", replaying);
  }

  isReplayingPhase(): boolean {
    return getTypedItem(Boolean, "replaying");
  }

  initializeResponse() {
    let resposta = new RespostaItemProgramacao()
    resposta.tempoEmSegundos = 0
    resposta.contadorCliques = 0
    resposta.contadorGiros = 0
    resposta.finalizou = false
    this.setResponse(resposta);
    this.initializeStartTime();
    removeItem("replaying");
  }

  
  pushMove(position: { x: number; y: number }) {
    let response = this.getResponse();
    response.caminhoPercorrido.push(position);
    response.caminhoPercorridoTexto = response.caminhoPercorrido
      .map((position) => `(${position.x},${position.y})`)
      .join("");
    this.setResponse(response);
  }

  setFinished() {
    let response = this.getResponse();
    response.finalizou = true;
    this.setResponse(response);
  }

  initializeStartTime() {
    //alert('initialize start time')
    let resposta = this.getResponse();
    if (!resposta) {
      resposta = new RespostaItemProgramacao();
    }
    resposta.tempoInicio = this.getTimeInSeconds();
    this.setResponse(resposta);
  }

  isBackgroundMusicEnabled() {
    return getItem("isBackgroundMusicEnabled", true);
  }

  setBackgroundMusicEnabled(enabled: boolean = true) {
    setItem("isBackgroundMusicEnabled", enabled);
  }

  setSpeedFactor(speed: number) {
    setItem("speedFactor", speed);
  }

  getSpeedFactor(): number {
    return getItem<number>("speedFactor", 1);
  }

  isSpeedFactorActivated(): boolean {
    return this.getSpeedFactor() == 2;
  }

  private calculateTimeSpent(): number {
    let response = this.getResponse();
    let tempoEmSegundos = 0
    if (response) {
      tempoEmSegundos = Math.floor(this.getTimeInSeconds() - response.tempoInicio)
      response.tempoEmSegundos = tempoEmSegundos
      this.setResponse(response)
    }
    console.log('Tempo em segundos', tempoEmSegundos)
    return tempoEmSegundos
  }


  registerGiveUp() {
    const response = this.getResponse();
    response.pulouFase = true;
    this.setResponse(response);
  }

  registerTrashUse() {
    let response = this.getResponse();
    response.countTrashUse();
    this.setResponse(response);
  }

  registerDebugUse() {
    let response = this.getResponse();
    response.countDebug();
    this.setResponse(response);
  }

  registerPlayUse() {
    let response = this.getResponse();
    response.countPlay();
    this.setResponse(response);
  }

  registerClickUse() {
    let response = this.getResponse()
    response.countCliques()
    this.setResponse(response)
  }

  registerRotationUse() {
    let response = this.getResponse()
    response.countGiros()
    this.setResponse(response)
  }

  registerStopUse() {
    let response = this.getResponse();
    response.countStop();
    this.setResponse(response);
  }

  registerRestartUse() {
    let response = this.getResponse();
    response.countRestartUse();
    this.setResponse(response);
  }

  registerTimeSpent() {
    let response = this.getResponse();
    if (response) {
      response.tempoEmSegundos = this.calculateTimeSpent();
      this.setResponse(response);
    }
  }

  getTimeInSeconds(): number {
    return new Date().getTime() / 1000 
  }

  getTimeInMinutes(): number {
    return new Date().getTime() / 1000 / 60
  }

  setResponse(respostaItemProgramacao: RespostaItemProgramacao) {
    setItem("response", respostaItemProgramacao);
  }

  getResponse(): RespostaItemProgramacao {
    return getTypedItem(RespostaItemProgramacao, "response");
  }

  private log(...arg0: any[]) {
    Logger.log(["GAME_STATE"].concat(arg0).join(" "));
  }


}
