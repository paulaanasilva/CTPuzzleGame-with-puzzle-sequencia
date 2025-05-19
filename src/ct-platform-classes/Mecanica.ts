type Item = "circulo" | "quadrado" | "triangulo" 

class Itens {
  nome: Item;
  posicao: { x: number, y: number };
}

class Opcoes {
  itens: Itens[] = [];
}

export class Mecanica {

  tempoEsperado!: number
  tentativasEsperadas!: number

  mensagemAoPularFase: string;
  mensagemAoSairDoJogo: string;
  mensagemAoReiniciarFase: string;

  contadorCliques: number = 0;
  contadorGiros: number = 0;

  opcoesQuestao: Opcoes[] = [];
  opcoesAlternativas: Opcoes[] = [];
  respostaQuestao: number = 0;
  
}

