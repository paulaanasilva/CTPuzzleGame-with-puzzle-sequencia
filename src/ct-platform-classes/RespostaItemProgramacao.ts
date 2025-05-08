
type Ambiente = "celular" | "computador"
export class RespostaItemProgramacao {

  comandosUtilizados: string[] = []
  tempoInicio: number
  tempoEmSegundos: number
  pulouFase: boolean
  contadorUsoLixeira: number = 0
  contadorUsoDebug: number = 0
  contadorUsoPlay: number = 0
  contadorUsoStop: number = 0
  contadorReinicioFase: number = 0
  contadorTentativas: number = 0
  contadorCliques: number = 0
  contadorGiros: number = 0
  ambiente: Ambiente = 'computador'
  caminhoPercorrido: { x: number, y: number }[] = []
  caminhoPercorridoTexto:string = ""
  finalizou = false



  countTrashUse() {
    this.contadorUsoLixeira++
  }

  countRestartUse() {
    this.contadorReinicioFase++
  }

  countStop() {
    this.contadorUsoStop++
  }

  countGiros() {
    this.contadorGiros++
  }

  countCliques() {
    this.contadorCliques++
  }

  countPlay() {
    this.contadorUsoPlay++
  }

  countDebug() {
    this.contadorUsoDebug++
  }
}
