import Grid from './Grid';

export default class Game {

    private _canvas: HTMLCanvasElement;
    private _grid: Grid

    constructor(canvas: HTMLCanvasElement, grid: Grid) {
        this._canvas = canvas;
        this._grid = grid;
    }

    public get grid() {
        return this._grid;
    }

    public get canvas() {
        return this._canvas;
    }

    startGame() {
        this.grid.beginGenerations();
    }
}