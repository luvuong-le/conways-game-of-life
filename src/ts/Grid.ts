import Cell from './Cell';
import randomColor from 'randomcolor';

export default class Grid {

    private _gridColSize: number;
    private _gridRowSize: number;
    private _gridCellSize: number;
    private _renderingContext: CanvasRenderingContext2D;

    // Multidimensional Array Board => [cols][rows] / [y][x]
    private _grid: Cell[][];

    // Accessors
    public get grid(): Cell[][] {
        return this._grid;
    }

    public get columns(): number {
        return this._gridColSize;
    }

    public get rows(): number {
        return this._gridRowSize;
    }

    public get cellSize(): number {
        return this._gridCellSize;
    }

    public get renderingContext(): CanvasRenderingContext2D {
        return this._renderingContext;
    }

    // Mutators
    public set grid(newBoard: Cell[][]) {
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

        this._grid = new Array(this.columns).fill(null).map(_ => new Array(this.rows).fill(null).map(_ => new Cell(randomColor())));
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
                    neighbourCount += neighbour.cellState;
                }
            }
        }

        return neighbourCount;
    }

    /**
     * @description Creates the next generation
     */
    generateNextGen = (): Cell[][] => {
        // Placeholder copy for current generation instead of modifying directly

        // If using custom cell class you need to remove the object reference (ie. Create new cell class for each or use primitive numbers for comparsion)
        // If not numbers are primitive and are fine copying normally
        // We need a temp board and current generation grid to compare against

        // If not using custom cell class
        // let newGeneration: Cell[][] = this.grid.map(grid => [...grid]);

        // Shallow Copy
        // let newGeneration: Cell[][] = this.grid.map(grid => grid.map(cell => Object.assign({}, cell)));

        // Deep Copy Object Cells
        let newGeneration: Cell[][] = this.grid.map(grid => grid.map(cell => JSON.parse(JSON.stringify(cell))));

        // Alter the new generation
        for (let col = 0; col < this.columns; col++) {
            for (let row = 0; row < this.rows; row++) {
                // If the grid where the currentCell is used for checking is modified, the game will behave strangely
                // This is because the board is being modified directly and the next check is checking for the updated cell
                const currentCell = this.grid[col][row];
                const neighbourCount = this.getNeighbours(col, row);

                if (currentCell.cellState === 0 && neighbourCount === 3) {
                    newGeneration[col][row].cellState = 1;
                } else if (currentCell.cellState === 1 && (neighbourCount < 2 || neighbourCount > 3)) {
                    newGeneration[col][row].cellState = 0;
                } else {
                    newGeneration[col][row].cellState = currentCell.cellState;
                }

                // Alter other properties
                newGeneration[col][row].cellColor = currentCell.cellColor;
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
                this.renderingContext.strokeRect(col * this.cellSize, row * this.cellSize, this.cellSize, this.cellSize);
                this.renderingContext.fillStyle = this.grid[col][row].cellState ? (this.grid[col][row].cellColor ? this.grid[col][row].cellColor : "#000000") : "#ffffff"
                this.renderingContext.strokeStyle = this.grid[col][row].cellState ? randomColor() : "#ffffff";
                this.renderingContext.fill();
                this.renderingContext.stroke();
                this.renderingContext.closePath();
            }
        }
    }

    updateBoard = (): void => {
        this.grid = this.generateNextGen();
        this.renderBoard();
    }
}