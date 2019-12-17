import Grid from './Grid';
import GameConfiguration from './types/GameConfiguration';

export default class Game {

    private _canvas: HTMLCanvasElement;
    private _grid: Grid
    private _iterationCount: number;
    private _currentIteration: number;
    private _running: boolean;
    private _gameConfig: GameConfiguration;

    constructor(config: GameConfiguration) {
        this._canvas = config.canvas;

        /** Set Canvas Configs */
        this._canvas.width = config.canvasWidth;
        this._canvas.height = config.canvasHeight;

        this._currentIteration = 1;
        this._iterationCount = parseInt((<HTMLInputElement>config.iterationCount).value) || 0;
        this._running = false;
        this._gameConfig = config;

        this._grid = new Grid(<CanvasRenderingContext2D>this._canvas.getContext("2d"));

        this.grid.renderBoard();
    }

    public get grid(): Grid {
        return this._grid;
    }

    public get canvas(): HTMLCanvasElement {
        return this._canvas;
    }

    public get gameConfig(): GameConfiguration {
        return this._gameConfig;
    }

    public get iteration(): number {
        return this._currentIteration;
    }

    public set iteration(updatedIteration: number) {
        this._currentIteration = updatedIteration;
    }

    public get iterationTotal(): number {
        return this._iterationCount;
    }

    public set iterationTotal(iterationCount: number) {
        this._iterationCount = iterationCount;
    }

    public get running(): boolean {
        return this._running;
    }

    public set running(isGameRunning: boolean) {
        this._running = isGameRunning;
    }

    setEventListeners = () => {
        const iterationInput = <HTMLElement>document.getElementById("iterationCountInput");

        iterationInput.addEventListener("change", e => {
            if (e.target instanceof HTMLInputElement) {
                this.iteration = 1;
                this.iterationTotal = parseInt(e.target.value);
            }
        });

        const startBtn = <HTMLElement>document.getElementById("startBtn");

        startBtn.addEventListener("click", this.startGame);
    }

    updateDisplay = () => {
        let iterationCountDP = <HTMLElement>document.getElementById("iterationCountDisplay");

        iterationCountDP.textContent = this.iteration.toString();

        this.iteration++;
    }

    updateIteration = (startMode: boolean): void => {
        this.grid.updateBoard();
        this.updateDisplay();

        if (startMode) {
            if (this.iteration <= this.iterationTotal) {
                requestAnimationFrame(this.updateIteration.bind(this, startMode));
            }
        } else {
            requestAnimationFrame(this.updateIteration.bind(this, startMode));
        }

    }

    startIterations = (startMode: boolean): void => {
        requestAnimationFrame(this.updateIteration.bind(this, startMode));
    }

    startGame = (): void => {
        if (this.iterationTotal === 0) {
            this.startIterations(false);
        }
        this.startIterations(true);
    }
}