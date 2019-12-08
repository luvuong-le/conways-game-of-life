import Cell from './Cell';

export default class Grid {

    gridColSize: number;
    gridRowSize: number;
    gridCellSize: number;
    renderingContext: CanvasRenderingContext2D;

    // Multidimensional Array Board => [cols][rows] / [y][x]
    grid: Cell[][];

    constructor(renderingContext: CanvasRenderingContext2D) {
        this.renderingContext = renderingContext
        this.gridCellSize = 20;

        this.gridColSize = renderingContext.canvas.width / this.gridCellSize;
        this.gridRowSize = renderingContext.canvas.height / this.gridCellSize;

        this.grid = new Array(this.gridColSize).fill(null).map(_ => new Array(this.gridRowSize).fill(null).map(_ => new Cell()));
    }

    renderBoard() {
        for (let col = 0; col < this.gridColSize; col++) {
            for (let row = 0; row < this.gridRowSize; row++) {
                // Draw Board
                this.renderingContext.beginPath();
                this.renderingContext.rect(row * this.gridCellSize, col * this.gridCellSize, this.gridCellSize, this.gridCellSize);
                this.renderingContext.fillStyle = this.grid[col][row].state ? "#000000" : "#ffffff"
                this.renderingContext.fill();
                this.renderingContext.stroke();
                this.renderingContext.closePath();
            }
        }
    }
}