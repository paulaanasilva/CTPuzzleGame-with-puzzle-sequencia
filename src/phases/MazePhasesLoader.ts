import { Scene } from "phaser";
import CodeEditor from "../controls/CodeEditor";
import { Mecanica } from "../ct-platform-classes/Mecanica";
import AlignGrid from "../geom/AlignGrid";
import Matrix, { MatrixMode } from "../geom/Matrix";
import { Logger } from "../main";
import GameParams from "../settings/GameParams";
import MazePhase, { DEFAULT_EXIT_MESSAGE, DEFAULT_RESTART_MESSAGE, DEFAULT_SKIP_MESSAGE } from "./MazePhase";
import TestApplicationService from "../test-application/TestApplicationService";

export default class MazePhasesLoader {

  currentPhase: number = -1
  phases: Array<MazePhase>;
  scene: Scene;
  grid: AlignGrid;
  matrixMode: MatrixMode;
  gridCenterX: number;
  gridCenterY: number;
  gridCellWidth: number;
  codeEditor: CodeEditor;
  testApplicationService: TestApplicationService;

  constructor(scene: Scene,
    grid: AlignGrid,
    codeEditor: CodeEditor,
    matrixMode: MatrixMode,
    gridCenterX: number,
    gridCenterY: number,
    gridCellWidth: number) {

    this.matrixMode = matrixMode;
    this.gridCenterX = gridCenterX;
    this.gridCenterY = gridCenterY;
    this.gridCellWidth = gridCellWidth;
    this.codeEditor = codeEditor;

    this.scene = scene;
    this.grid = grid;

  }

  //Aqui é carregado, se vier da plataforma, prioriza este, se não, carrega o hardcoded
  async load(gameParams: GameParams): Promise<MazePhasesLoader> {
    this.testApplicationService = new TestApplicationService(gameParams);
    let phasesLoader: MazePhasesLoader;
    try {
      if (gameParams.isPlaygroundTest()) {
        phasesLoader = await this.loadTestItem();
      }
      if (gameParams.isTestApplication()) {
        phasesLoader = this.loadTestApplication();
      }
      if (gameParams.isItemToPlay()) {
        phasesLoader = await this.loadTestItem();
      }
      if (phasesLoader == null) {
        throw new Error("empty phases");
      }
    } catch (e) {
      Logger.error(e);
    }
    return phasesLoader;
  }

  //as fases estão em um array
  private async loadTestItem(): Promise<MazePhasesLoader> {
    let item =
      await this.testApplicationService.instantiatePlaygroundItem<Mecanica>();
    const mazePhase = this.convertMecanicaToPhase(item);
    this.phases = [mazePhase];
    return this;
  }

  //aqui é aonde busca do json
  private loadTestApplication(): MazePhasesLoader {
    let item = this.testApplicationService.getFirstItem();
    if (item) {
      location.href = item.url;
    }
    return this;
  }

  convertMecanicaToPhase(Mecanica: Mecanica): MazePhase {
    let phase = new MazePhase(this.scene, this.codeEditor);
    phase.Mecanica = Mecanica;

    phase.setupTutorialsAndObjectsPositions = () => {

      phase.opcoesQuestao = Mecanica.opcoesQuestao.map(opcao => {
        return {
          itens: opcao.itens.map(item => {
            return {
              nome: item.nome,
              posicao: { x: item.posicao.x, y: item.posicao.y }
            }
          })
        }
      });

      phase.opcoesAlternativas = Mecanica.opcoesAlternativas.map(opcao => {
        return {
          itens: opcao.itens.map(item => {
            return {
              nome: item.nome,
              posicao: { x: item.posicao.x, y: item.posicao.y }
            }
          })
        }
      });

      phase.respostaQuestao = Mecanica.respostaQuestao;

      // Conversão dos polígonos
      phase.poligonoDestino = phase.Mecanica.poligonoDestino.map(p => {
        return { x: p.x, y: p.y }
      })

      phase.pontosDestino = phase.Mecanica.pontosDestino.map(p => {
        return { x: p.x, y: p.y }
      })


      phase.poligonos = {
        pontos: Mecanica.poligonos.pontos.map(point => ({ x: point.x, y: point.y })),
        posicao: Mecanica.poligonos.posicao.map(position => ({ x: position.x, y: position.y })),
        quantidade: Mecanica.poligonos.quantidade
      };

      //aqui termina o poligono


      phase.skipPhaseMessage =
        Mecanica.mensagemAoPularFase || DEFAULT_SKIP_MESSAGE;
      phase.exitPhaseMessage =
        Mecanica.mensagemAoSairDoJogo || DEFAULT_EXIT_MESSAGE;
      phase.restartPhaseMessage =
        Mecanica.mensagemAoReiniciarFase || DEFAULT_RESTART_MESSAGE;

    };
    return phase;
  }


  getNextPhase(): MazePhase {
    this.currentPhase++;
    return this.phases[this.currentPhase];
  }
}
