import Game from './Game';
import GameConfiguration from './types/GameConfiguration';

const config: GameConfiguration = {
    canvas: <HTMLCanvasElement>document.getElementById("canvas"),
    canvasWidth: 700,
    canvasHeight: 700,
    iterationCount: <HTMLInputElement>document.getElementById("iterationCountInput"),
    cellColorRandomiser: <HTMLInputElement>document.getElementById("cellColorInput"),
    theme: <HTMLInputElement>document.getElementById("themeInput"),
    timerEnabled: <HTMLInputElement>document.getElementById("timerInput"),
};

const gameOfLife: Game = new Game(config);

gameOfLife.setEventListeners();