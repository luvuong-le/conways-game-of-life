import Grid from './Grid';
import GameConfiguration from './types/GameConfiguration';

export default class Game {

    // Input Elements
    private iterationInput!: HTMLElement;
    private startBtn!: HTMLElement;
    private resetBtn!: HTMLElement;
    private stopBtn!: HTMLElement;
    private cellColorInput!: HTMLElement;
    private configIcon!: HTMLElement;
    private displayToggleIcon!: HTMLElement;
    private closeConfigBtn!: HTMLElement;

    private _canvas: HTMLCanvasElement;

    // Display Elements
    private iterationCountDisplay!: HTMLElement;
    private cellColorRandomiserDisplay!: HTMLElement;
    private gameRunningDisplay!: HTMLElement;
    private cellsDeadDisplay!: HTMLElement;
    private toast!: HTMLElement;
    private gameConfiguration!: HTMLElement;
    private gameDisplay!: HTMLElement;

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

        /** Set Element Nodes */
        this.getElementNodes();

        this._grid = new Grid(<CanvasRenderingContext2D>this._canvas.getContext("2d"), ((<HTMLInputElement>this.cellColorInput).value === "true"));

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
            if (this.running) return this.showToast("error", "Game is already running. Please stop the game first.");

            if (e.target instanceof HTMLInputElement) {
                if (isNaN(parseInt(e.target.value))) return this.showToast("error", "Iteration count must have a value greater than or equal to 0");

                this.iteration = 1;
                this.iterationTotal = parseInt(e.target.value);
                this.showToast("success", `Iteration Count set to ${e.target.value}`);
            }
        });

        /** Cell Color Randomiser Event */
        this.cellColorInput.addEventListener("change", (e: any) => {
            this.showToast("success", e.target.value === "true" ? `Cell Color Randomiser On` : `Cell Color Randomiser Off`);

            return e.target.value === "true" ? this.grid.updateCellColors(true) : this.grid.updateCellColors(false);
        })

        /** Start Event */
        this.startBtn.addEventListener("click", this.startGame);

        /** Stop Event */
        this.stopBtn.addEventListener("click", this.stopGame);

        /** Reset Event */
        this.resetBtn.addEventListener("click", this.resetGame);

        /** Game Configuration Click Event */
        this.configIcon.addEventListener("click", () => this.togglePanel(this.configIcon, this.gameConfiguration, { hidden: "translateX(-100%)", visible: "translateX(0)" }));

        this.closeConfigBtn.addEventListener("click", () => this.togglePanel(this.configIcon, this.gameConfiguration, { hidden: "translateX(-100%)", visible: "translateX(0)" }));

        /** Game Display Click Event */
        this.displayToggleIcon.addEventListener("click", () => this.togglePanel(this.displayToggleIcon, this.gameDisplay, { hidden: "scale(0)", visible: "scale(1)" }));
    }

    updateDisplay = () => {
        this.gameRunningDisplay.textContent = this.running ? "True" : "False";
        this.iterationCountDisplay.textContent = this.iteration.toString();
        this.cellColorRandomiserDisplay.textContent = (<HTMLInputElement>this.cellColorInput).value === "false" ? "False" : "True";
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
                this.iteration = 0;
            }
        } else {

            this.requestAnimFrame = requestAnimationFrame(this.updateIteration.bind(this, startMode));
        }

    }

    startIterations = (startMode: boolean): void => {
        startMode ? this.showToast("success", `Iteration Count Detected. Starting game with iteration rounds of ${this.iterationTotal}`) : this.showToast("success", `Iteration Count Not Detected. Starting game with continuous iterations`);
        this.requestAnimFrame = requestAnimationFrame(this.updateIteration.bind(this, startMode));
    }

    startGame = (): void => {
        if (this.running) return this.showToast("error", "Game already running. Please stop the game first");

        if (!this.running) {
            this.resetGame();
            this.running = true;
            this.showToast("success", "Game Started");
            return this.iterationTotal === 0 ? this.startIterations(false) : this.startIterations(true);
        }
    }

    stopGame = (): void => {
        if (!this.running) return this.showToast("error", "Game is not currently running. Please start the game first");

        if (this.running) {
            cancelAnimationFrame(this.requestAnimFrame);
            this.running = false;
            this.showToast("success", "Game Stopped");
            this.updateDisplay();
        }
    }

    resetGame = (): void => {
        if (this.running) return this.showToast("error", "Game already running. Please stop the game first");

        if (!this.running) {
            this.iteration = 0;
            (<HTMLInputElement>this.iterationInput).value = "0";
            (<HTMLInputElement>this.cellColorInput).value = "false";
            this.iterationCountDisplay.textContent = "0";
            this.cellColorRandomiserDisplay.textContent = "false";
            this.grid = new Grid(<CanvasRenderingContext2D>this._canvas.getContext("2d"), ((<HTMLInputElement>this.cellColorInput).value === "true"));
            this.grid.renderBoard();
            this.updateDisplay();
            this.showToast("success", "Game Reset");
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

    togglePanel = (icon: HTMLElement, e: HTMLElement, style: { hidden: string, visible: string }): void => {
        if (icon.dataset.visibility === "true") {
            e.style.transform = style.hidden;
            icon.dataset.visibility = "false";
        } else {
            e.style.transform = style.visible;
            icon.dataset.visibility = "true";
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
        this.closeConfigBtn = <HTMLElement>document.getElementById("closeConfigBtn");
    }
}