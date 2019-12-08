import Grid from './Grid';

export default class Game {

    canvas: HTMLCanvasElement;
    grid: Grid

    constructor(canvas: HTMLCanvasElement, grid: Grid) {
        this.canvas = canvas;
        this.grid = grid;
    }

    startGame() {
        this.grid.beginGenerations();
    }
}