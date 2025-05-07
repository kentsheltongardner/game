import Base from './objects/base.js';
const MaxSize = 128;
const DefaultWidth = 4;
const DefaultHeight = 3;
const defaultBaseGrid = new Array(DefaultWidth);
const defaultCardGrid = [];
const defaultTileGrid = [];
for (let i = 0; i < DefaultWidth; i++) {
    defaultBaseGrid[i] = new Array(DefaultHeight);
    for (let j = 0; j < DefaultHeight; j++) {
        defaultBaseGrid[i][j] = new Base();
    }
}
export default class Puzzle {
    width = DefaultWidth;
    height = DefaultHeight;
    baseGrid;
    constructor(baseGrid = defaultBaseGrid) {
        this.baseGrid = baseGrid;
    }
    // TODO
    load() {
    }
    x() {
        return Math.floor((MaxSize - this.width) / 2);
    }
    y() {
        return Math.floor((MaxSize - this.height) / 2);
    }
    growEast() {
        this.width++;
    }
    growSouth() {
        this.height++;
    }
    growWest() {
        this.width++;
    }
    growNorth() {
        this.height++;
    }
    shrinkEast() {
        if (this.width === 1)
            return;
        this.width--;
    }
    shrinkSouth() {
        if (this.height === 1)
            return;
        this.height--;
    }
    shrinkWest() {
        if (this.width === 1)
            return;
        this.width--;
    }
    shrinkNorth() {
        if (this.height === 1)
            return;
        this.height--;
    }
    containsX(gridX) {
        return gridX >= 0 && gridX < this.width;
    }
    containsY(gridY) {
        return gridY >= 0 && gridY < this.height;
    }
    contains(gridX, gridY) {
        return this.containsX(gridX) && this.containsX(gridY);
    }
}
