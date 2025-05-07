import Base from './objects/base.js'
import Card from './objects/card'
import Tile from './objects/tile.js'

const MaxSize       = 128
const DefaultWidth  = 4
const DefaultHeight = 3

const defaultBaseGrid: Array<Array<Base>> = new Array(DefaultWidth)
const defaultCardGrid: Array<Array<Card>> = []
const defaultTileGrid: Array<Array<Tile>> = []

for (let i = 0; i < DefaultWidth; i++) {
    defaultBaseGrid[i] = new Array(DefaultHeight)
    for (let j = 0; j < DefaultHeight; j++) {
        defaultBaseGrid[i][j] = new Base()
    }
}

export default class Puzzle {
    public width    = DefaultWidth
    public height   = DefaultHeight

    public baseGrid: Array<Array<Base>>

    constructor(baseGrid: Array<Array<Base>> = defaultBaseGrid) {
        this.baseGrid = baseGrid
    }

    // TODO
    load() {

    }


    x() {
        return Math.floor((MaxSize - this.width) / 2)
    }
    y() {
        return Math.floor((MaxSize - this.height) / 2)
    }

    growEast() {
        this.width++
    }
    growSouth() {
        this.height++
    }
    growWest() {
        this.width++
    }
    growNorth() {
        this.height++
    }

    shrinkEast() {
        if (this.width === 1) return

        this.width--
    }
    shrinkSouth() {
        if (this.height === 1) return

        this.height--
    }
    shrinkWest() {
        if (this.width === 1) return

        this.width--
    }
    shrinkNorth() {
        if (this.height === 1) return

        this.height--
    }


    containsX(gridX: number) {
        return gridX >= 0 && gridX < this.width
    }
    containsY(gridY: number) {
        return gridY >= 0 && gridY < this.height
    }
    contains(gridX: number, gridY: number) {
        return this.containsX(gridX) && this.containsX(gridY)
    }

}