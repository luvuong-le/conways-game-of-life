import Grid from './Grid';
import Game from './Game';

const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("canvas");
canvas.width = 800;
canvas.height = 800;

const game = new Game(canvas, new Grid(<CanvasRenderingContext2D>canvas.getContext("2d")));

game.startGame();