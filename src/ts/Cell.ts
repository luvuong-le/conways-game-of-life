export default class Cell {
    state: number;

    constructor() {
        this.state = Math.floor(Math.random() * 2);
    }
}