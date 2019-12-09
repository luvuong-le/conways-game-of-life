import Cell from './Cell';

export default class Grid {

    private _gridColSize: number;
    private _gridRowSize: number;
    private _gridCellSize: number;
    private _renderingContext: CanvasRenderingContext2D;

    // Multidimensional Array Board => [cols][rows] / [y][x]
    private _grid: number[][];

    // Accessors
    get grid(): number[][] {
        return this._grid;
    }

    get columns(): number {
        return this._gridColSize;
    }

    get rows(): number {
        return this._gridRowSize;
    }

    get cellSize(): number {
        return this._gridCellSize;
    }

    get renderingContext(): CanvasRenderingContext2D {
        return this._renderingContext;
    }

    // Mutators
    set grid(newBoard: number[][]) {
        this._grid = newBoard;
    }

    /**
     * @param {CanvasRenderingContext2D} renderingContext
     */
    constructor(renderingContext: CanvasRenderingContext2D) {
        this._renderingContext = renderingContext
        this._gridCellSize = 10;

        this._gridColSize = renderingContext.canvas.width / this._gridCellSize;
        this._gridRowSize = renderingContext.canvas.height / this._gridCellSize;

        this._grid = new Array(this.columns).fill(null).map(_ => new Array(this.rows).fill(null).map(_ => Math.floor(Math.random() * 2)));
    }
    /**
     * @description Get the surrounding neighbours of the current cell
     */
    getNeighbours = (col: number, row: number): number => {
        let neighbourCount = 0;

        // Get surrounding neighbours
        for (let y = -1; y <= 1; y++) {
            for (let x = -1; x <= 1; x++) {
                // Continue if the current neighbour is the cell itself
                if (col + y === col && row + x === row) {
                    continue;
                }

                // The next cell coordinates to check
                const colToCheck = col + y;
                const rowToCheck = row + x;

                // Ignore edges
                if (colToCheck >= 0 && rowToCheck >= 0 && colToCheck < this.columns && rowToCheck < this.rows) {
                    const neighbour = this.grid[colToCheck][rowToCheck];
                    neighbourCount += neighbour;
                }
            }
        }

        return neighbourCount;
    }

    /**
     * @description Creates the next generation
     */
    generateNextGen = (): number[][] => {
        // Placeholder copy for current generation instead of modifying directly
        const newGeneration: number[][] = this.grid.map(grid => grid.slice());

        // Alter the new generation
        for (let col = 0; col < this.columns; col++) {
            for (let row = 0; row < this.rows; row++) {
                const currentCell = this.grid[col][row];
                const neighbourCount = this.getNeighbours(col, row);

                if (currentCell === 0 && neighbourCount === 3) {
                    newGeneration[col][row] = 1;
                } else if (currentCell === 1 && (neighbourCount < 2 || neighbourCount > 3)) {
                    newGeneration[col][row] = 0;
                } else {
                    newGeneration[col][row] = currentCell
                }
            }
        }

        return newGeneration;
    }

    /**
     * @description Renders the board
     */
    renderBoard = (): void => {
        for (let col = 0; col < this.columns; col++) {
            for (let row = 0; row < this.rows; row++) {
                // Draw Board
                this.renderingContext.beginPath();
                this.renderingContext.rect(col * this.cellSize, row * this.cellSize, this.cellSize, this.cellSize);
                this.renderingContext.fillStyle = this.grid[col][row] ? "#000000" : "#ffffff"
                this.renderingContext.fill();
                this.renderingContext.stroke();
                this.renderingContext.closePath();
            }
        }
    }

    updateBoard = (): void => {
        this.grid = this.generateNextGen();
        this.renderBoard();
        requestAnimationFrame(this.updateBoard);
    }

    beginGenerations = (): void => {
        requestAnimationFrame(this.updateBoard);
    }
}