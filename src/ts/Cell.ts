export default class Cell {
    private _state: number;

    constructor() {
        this._state = Math.floor(Math.random() * 2)
    }

    public get cellState(): number {
        return this._state;
    }

    public set cellState(state: number) {
        this._state = state;
    }
}