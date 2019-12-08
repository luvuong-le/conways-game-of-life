import Cell from './Cell';

export default class Grid {

    gridColSize: number;
    gridRowSize: number;
    gridCellSize: number;
    renderingContext: CanvasRenderingContext2D;

    // Multidimensional Array Board => [cols][rows] / [y][x]
    grid: Cell[][];

    /**
     * @param  {CanvasRenderingContext2D} renderingContext
     */
    constructor(renderingContext: CanvasRenderingContext2D) {
        this.renderingContext = renderingContext
        this.gridCellSize = 10;

        this.gridColSize = renderingContext.canvas.width / this.gridCellSize;
        this.gridRowSize = renderingContext.canvas.height / this.gridCellSize;

        this.grid = new Array(this.gridColSize).fill(null).map(_ => new Array(this.gridRowSize).fill(null).map(_ => new Cell()));
    }
    /**
     * @description Get the surrounding neighbours of the current cell
     */
    getNeighbours = (col: number, row: number) => {
        let neighbourCount = 0;

        // Get neighbours
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
                if (colToCheck >= 0 && rowToCheck >= 0 && colToCheck < this.gridColSize && rowToCheck < this.gridRowSize) {
                    const neighbour = this.grid[colToCheck][rowToCheck];
                    neighbourCount += neighbour.state;
                }
            }
        }

        return neighbourCount;
    }

    /**
     * @description Creates the next generation
     */
    generateNextGen = () => {
        // Placeholder copy for current generation instead of modifying directly
        const newGen: Cell[][] = this.grid.map(grid => [...grid]);

        // Alter the new generation
        for (let col = 0; col < this.gridColSize; col++) {
            for (let row = 0; row < this.gridRowSize; row++) {
                const currentCell = this.grid[col][row];
                const neighbourCount = this.getNeighbours(col, row);

                if (currentCell.state === 0 && neighbourCount === 3) {
                    newGen[col][row].state = 1;
                } else if (currentCell.state === 1 && (neighbourCount < 2 || neighbourCount > 3)) {
                    newGen[col][row].state = 0;
                } else {
                    newGen[col][row].state = currentCell.state
                }
            }
        }

        return newGen;
    }

    /**
     * @description Renders the board
     */
    renderBoard = () => {
        for (let col = 0; col < this.gridColSize; col++) {
            for (let row = 0; row < this.gridRowSize; row++) {
                // Draw Board
                this.renderingContext.beginPath();
                this.renderingContext.rect(col * this.gridCellSize, row * this.gridCellSize, this.gridCellSize, this.gridCellSize);
                this.renderingContext.fillStyle = this.grid[col][row].state ? "#000000" : "#ffffff"
                this.renderingContext.fill();
                // this.renderingContext.stroke();
                this.renderingContext.closePath();
            }
        }
    }

    updateBoard = () => {
        this.grid = this.generateNextGen();
        this.renderBoard();
        requestAnimationFrame(this.updateBoard);
    }

    beginGenerations = () => {
        requestAnimationFrame(this.updateBoard);
    }
}