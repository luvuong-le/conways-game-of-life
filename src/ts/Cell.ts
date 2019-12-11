export default class Cell {
    private _state: number;
    private _cellColor: string;

    constructor(cellColor: string) {
        this._state = Math.floor(Math.random() * 2)
        this._cellColor = cellColor || "#000000";
    }

    public get cellState(): number {
        return this._state;
    }

    public get cellColor(): string {
        return this._cellColor;
    }

    public set cellState(state: number) {
        this._state = state;
    }

    public set cellColor(cellColor: string) {
        this._cellColor = cellColor;
    }
}