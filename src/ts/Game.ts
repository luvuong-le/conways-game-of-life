import Grid from './Grid';
import GameConfiguration from './types/GameConfiguration';

export default class Game {

    // Input Elements
    private iterationInput: HTMLElement;
    private startBtn: HTMLElement;
    private resetBtn: HTMLElement;
    private stopBtn: HTMLElement;
    private cellColorInput: HTMLElement;
    private configIcon: HTMLElement;
    private displayToggleIcon: HTMLElement;

    private _canvas: HTMLCanvasElement;

    // Display Elements
    private iterationCountDisplay: HTMLElement;
    private cellColorRandomiserDisplay: HTMLElement;
    private gameRunningDisplay: HTMLElement;
    private cellsDeadDisplay: HTMLElement;
    private toast: HTMLElement;
    private gameConfiguration: HTMLElement;
    private gameDisplay: HTMLElement;

    // Game Instance Variables
    private _grid: Grid
    private _iterationCount: number;
    private _currentIteration: number;
    private _running: boolean;
    private _gameConfig: GameConfiguration;
    private _animationFrame: number;

    constructor(config: GameConfiguration) {
        this._canvas = config.canvas;

        /** Set Canvas Configs */
        this._canvas.width = config.canvasWidth;
        this._canvas.height = config.canvasHeight;

        this._currentIteration = 1;
        this._iterationCount = parseInt((<HTMLInputElement>config.iterationCount).value) || 0;
        this._running = false;
        this._gameConfig = config;
        this._animationFrame = 0;

        this.cellColorInput = null;

        // Set Element Nodes
        this.getElementNodes();

        this._grid = new Grid(<CanvasRenderingContext2D>this._canvas.getContext("2d"), (this.cellColorInput.value === "true"));

        this.grid.renderBoard();

    }

    public get grid(): Grid {
        return this._grid;
    }

    public set grid(grid: Grid) {
        this._grid = grid;
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

    public get requestAnimFrame(): number {
        return this._animationFrame;
    }

    public set requestAnimFrame(reqId: number) {
        this._animationFrame = reqId;
    }


    setEventListeners = () => {
        /** Iteration Event */
        this.iterationInput.addEventListener("change", e => {
            if (!this.running) {
                if (e.target instanceof HTMLInputElement) {
                    this.iteration = 1;
                    this.iterationTotal = parseInt(e.target.value);
                    this.showToast("success", `Iteration Count set to ${e.target.value}`);
                }
            } else {
                this.showToast("error", "Game is already running. Please stop the game first.");
                console.warn("Game is already running. Please stop the game first.")
            }

        });

        /** Cell Color Randomiser Event */
        this.cellColorInput.addEventListener("change", e => {
            this.showToast("success", e.target.value === "true" ? `Cell Color Randomiser On` : `Cell Color Randomiser Off`);
            return e.target.value === "true" ? this.grid.updateCellColors(true) : this.grid.updateCellColors(false);
        })

        /** Start Event */
        this.startBtn.addEventListener("click", this.startGame);

        /** Stop Event */
        this.stopBtn.addEventListener("click", this.stopGame);

        /** Reset Event */
        this.resetBtn.addEventListener("click", this.resetGame);

        /** Config Event */
        this.configIcon.addEventListener("click", this.toggleGameConfigPanel);

        /** Display Event */
        this.displayToggleIcon.addEventListener("click", this.toggleGameDisplayPanel);
    }

    updateDisplay = () => {
        this.gameRunningDisplay.textContent = this.running ? "True" : "False";
        this.iterationCountDisplay.textContent = this.iteration.toString();
        this.cellColorRandomiserDisplay.textContent = this.cellColorInput.value === "false" ? "False" : "True";
        this.cellsDeadDisplay.textContent = this.grid.cellsDead.toString();

        this.iteration++;
    }

    updateIteration = (startMode: boolean): void => {
        this.grid.updateBoard();
        this.updateDisplay();

        if (startMode) {
            if (this.iteration <= this.iterationTotal) {
                this.requestAnimFrame = requestAnimationFrame(this.updateIteration.bind(this, startMode));
            } else {
                this.running = false;
            }
        } else {
            this.requestAnimFrame = requestAnimationFrame(this.updateIteration.bind(this, startMode));
        }

    }

    startIterations = (startMode: boolean): void => {
        this.requestAnimFrame = requestAnimationFrame(this.updateIteration.bind(this, startMode));
    }

    startGame = (): void => {
        if (!this.running) {
            this.running = true;
            this.showToast("success", "Game Started");
            if (this.iterationTotal === 0) {
                return this.startIterations(false);
            }
            return this.startIterations(true);
        } else {
            this.showToast("error", "Game is already running. Please stop the game first.");
            console.warn("Game is already running. Please stop the game first.")
        }

    }

    stopGame = (): void => {
        if (this.running) {
            cancelAnimationFrame(this.requestAnimFrame);
            this.running = false;
            this.showToast("success", "Game stopped");
            this.updateDisplay();
        }
    }

    resetGame = (): void => {
        if (!this.running) {
            this.iteration = 0;
            this.iterationInput.value = 0;
            this.cellColorInput.value = "false";
            this.iterationCountDisplay.textContent = "0";
            this.cellColorRandomiserDisplay.textContent = "false";
            this.grid = new Grid(<CanvasRenderingContext2D>this._canvas.getContext("2d"), (this.cellColorInput.value === "true"));
            this.grid.renderBoard();
            this.updateDisplay();
            this.showToast("success", "Game Reset.");
        } else {
            this.showToast("error", "Game is already running. Please stop the game first.");
            console.warn("Game is already running. Please stop the game first.")
        }
    }

    showToast = (type: string, msg: string): void => {
        this.toast.textContent = msg;
        this.toast.className = "";
        this.toast.classList.add("toast", `toast--${type}`);

        setTimeout(() => {
            this.toast.className = "";
            this.toast.classList.add("toast", "hidden");
        }, 2000);
    }

    toggleGameConfigPanel = (): void => {
        if (this.configIcon.dataset.visibility === "true") {
            this.gameConfiguration.style.transform = "translateX(-100%)";
            this.configIcon.dataset.visibility = "false";
        } else {
            this.gameConfiguration.style.transform = "translateX(0)";
            this.configIcon.dataset.visibility = "true";
        }
    }

    toggleGameDisplayPanel = (): void => {
        if (this.displayToggleIcon.dataset.visibility === "true") {
            this.gameDisplay.style.transform = "translateY(100%)";
            this.displayToggleIcon.dataset.visibility = "false";
        } else {
            this.gameDisplay.style.transform = "translateY(0)";
            this.displayToggleIcon.dataset.visibility = "true";
        }
    }

    getElementNodes = (): void => {
        this.iterationCountDisplay = <HTMLElement>document.getElementById("iterationCountDisplay");
        this.cellColorRandomiserDisplay = <HTMLElement>document.getElementById("cellColorRandomiserDisplay");
        this.gameRunningDisplay = <HTMLElement>document.getElementById("gameRunningDisplay");
        this.cellsDeadDisplay = <HTMLElement>document.getElementById("cellsDeadDisplay");
        this.toast = <HTMLElement>document.getElementById("toast");
        this.gameConfiguration = <HTMLElement>document.getElementById("gameConfiguration");
        this.gameDisplay = <HTMLElement>document.getElementById("gameDisplay");

        this.iterationInput = <HTMLElement>document.getElementById("iterationCountInput");
        this.cellColorInput = <HTMLElement>document.getElementById("cellColorInput");
        this.startBtn = <HTMLElement>document.getElementById("startBtn");
        this.stopBtn = <HTMLElement>document.getElementById("stopBtn");
        this.resetBtn = <HTMLElement>document.getElementById("resetBtn");
        this.configIcon = <HTMLElement>document.getElementById("configIcon");
        this.displayToggleIcon = <HTMLElement>document.getElementById("displayToggleIcon");
    }
}