import { GameObjects, Scene } from "phaser";
import CodeEditor from "../controls/CodeEditor";
import AlignGrid from "../geom/AlignGrid";
import Matrix from "../geom/Matrix";
import { Mecanica } from "../ct-platform-classes/Mecanica";

export type CommandName = "arrow-up" | "arrow-down" | "arrow-right" | "arrow-left" | "prog_1" | "prog_0" | "prog_2" | "if_coin" | "if_block"
| "arrow-up:if_block" | "arrow-down:if_block" | "arrow-right:if_block" | "arrow-left:if_block" | "prog_1:if_block" | "prog_0:if_block" | "prog_2:if_block"
| "arrow-up:if_coin" | "arrow-down:if_coin" | "arrow-right:if_coin" | "arrow-left:if_coin" | "prog_1:if_coin" | "prog_0:if_coin" | "prog_2:if_coin"

export const DEFAULT_SKIP_MESSAGE = 'Você vai pular essa fase?'
export const DEFAULT_EXIT_MESSAGE = 'Vai sair dessa fase?'
export const DEFAULT_RESTART_MESSAGE = 'Reiniciar fase?'

class Poligonos {
  pontos: { x: number, y: number }[] = [];
  posicao: { x: number, y: number }[] = [];
  cor: string = '';
  quantidade?: number = 0;
}

export default class MazePhase {

  skipPhaseMessage:string = DEFAULT_SKIP_MESSAGE
  exitPhaseMessage:string = DEFAULT_EXIT_MESSAGE
  restartPhaseMessage:string = DEFAULT_RESTART_MESSAGE
  setupTutorialsAndObjectsPositions: () => void;
  messagesBeforeStartPlay:string[] = []
  scene: Scene;
  grid: AlignGrid
  itemId: number
  Mecanica: Mecanica;
  next: MazePhase
  backgroundOverlay: GameObjects.Sprite;

  codeEditor: CodeEditor;
  commands: Array<CommandName[]> = [];
  poligonoEncaixe: Poligonos;
  poligonos: Poligonos[] = [];
  poligonoDestino: { x: number, y: number }[] = [];
  pontosDestino: { x: number, y: number }[] = [];

  constructor(scene: Scene, codeEditor: CodeEditor) {
    this.scene = scene;
    this.grid = codeEditor.grid;
    this.codeEditor = codeEditor;
  }

  setupMatrixAndTutorials() {
    this.setupTutorialsAndObjectsPositions();
  }

}
