import Connection from './data/connection.js';
import BaseTypes from './enums/base_types.js';
import Directions from './enums/directions.js';
import Base from './objects/base.js';
const DefaultWidth = 4;
const DefaultHeight = 3;
const defaultBaseGrid = new Array(DefaultWidth);
// const defaultCardGrid: Array<Array<Card>> = new Array(DefaultWidth)
// const defaultTileGrid: Array<Array<Tile>> = new Array(DefaultWidth)
for (let i = 0; i < DefaultWidth; i++) {
    defaultBaseGrid[i] = new Array(DefaultHeight);
    const e = i < DefaultWidth - 1;
    const w = i > 0;
    for (let j = 0; j < DefaultHeight; j++) {
        const base = new Base();
        const s = j < DefaultHeight - 1;
        const n = j > 0;
        if (e)
            base.connections |= Directions.Bits[Directions.East];
        if (s)
            base.connections |= Directions.Bits[Directions.South];
        if (w)
            base.connections |= Directions.Bits[Directions.West];
        if (n)
            base.connections |= Directions.Bits[Directions.North];
        if (e && s)
            base.connections |= Directions.Bits[Directions.Southeast];
        if (w && s)
            base.connections |= Directions.Bits[Directions.Southwest];
        if (w && n)
            base.connections |= Directions.Bits[Directions.Northwest];
        if (e && n)
            base.connections |= Directions.Bits[Directions.Northeast];
        defaultBaseGrid[i][j] = base;
    }
}
export default class Puzzle {
    baseGrid;
    constructor(baseGrid = defaultBaseGrid) {
        this.baseGrid = baseGrid;
    }
    // TODO
    load() {
    }
    //  #####   #######  #######  #######  
    // #     #     #          #   #        
    // #           #         #    #        
    //  #####      #        #     ####     
    //       #     #       #      #        
    // #     #     #      #       #        
    //  #####   #######  #######  #######  
    width() {
        return this.baseGrid.length;
    }
    height() {
        return this.baseGrid[0].length;
    }
    //  #####   ######    #####   #     #  
    // #     #  #     #  #     #  #     #  
    // #        #     #  #     #  #     #  
    // #        ######   #     #  #  #  #  
    // #   ###  #   #    #     #  # # # #  
    // #     #  #    #   #     #  ##   ##  
    //  #####   #     #   #####   #     #  
    growEast() {
        const height = this.height();
        const columnEast = new Array(height);
        for (let i = 0; i < height; i++) {
            columnEast[i] = new Base();
        }
        this.baseGrid.push(columnEast);
    }
    growWest() {
        const height = this.height();
        const columnWest = new Array(height);
        for (let i = 0; i < height; i++) {
            columnWest[i] = new Base();
        }
        this.baseGrid.unshift(columnWest);
    }
    growSouth() {
        for (let i = 0; i < this.width(); i++) {
            this.baseGrid[i].push(new Base());
        }
    }
    growNorth() {
        for (let i = 0; i < this.width(); i++) {
            this.baseGrid[i].unshift(new Base());
        }
    }
    //  #####   #     #  ######   #######  #     #  #     #  
    // #     #  #     #  #     #     #     ##    #  #    #   
    // #        #     #  #     #     #     # #   #  #   #    
    //  #####   #######  ######      #     #  #  #  ####     
    //       #  #     #  #   #       #     #   # #  #   #    
    // #     #  #     #  #    #      #     #    ##  #    #   
    //  #####   #     #  #     #  #######  #     #  #     #  
    shrinkEast() {
        if (this.width() === 1)
            return false;
        this.baseGrid.pop();
        const columnEast = this.baseGrid[this.width() - 1];
        for (let i = 0; i < this.height(); i++) {
            columnEast[i].connections &= ~(Directions.BitsNortheast | Directions.BitsEast | Directions.BitsSoutheast);
        }
        return true;
    }
    shrinkWest() {
        if (this.width() === 1)
            return false;
        this.baseGrid.shift();
        const columnWest = this.baseGrid[0];
        for (let i = 0; i < this.height(); i++) {
            columnWest[i].connections &= ~(Directions.BitsNorthwest | Directions.BitsWest | Directions.BitsSouthwest);
        }
        return true;
    }
    shrinkSouth() {
        if (this.height() === 1)
            return false;
        const rowSouthIndex = this.height() - 2;
        for (let i = 0; i < this.width(); i++) {
            this.baseGrid[i].pop();
            this.baseGrid[i][rowSouthIndex].connections &= ~(Directions.BitsSoutheast | Directions.BitsSouth | Directions.BitsSouthwest);
        }
        return true;
    }
    shrinkNorth() {
        if (this.height() === 1)
            return false;
        for (let i = 0; i < this.width(); i++) {
            this.baseGrid[i].shift();
            this.baseGrid[i][0].connections &= ~(Directions.BitsNortheast | Directions.BitsNorth | Directions.BitsNorthwest);
        }
        return true;
    }
    //  #####    #####   #     #  #######     #     #######  #     #  
    // #     #  #     #  ##    #     #       # #       #     ##    #  
    // #        #     #  # #   #     #      #   #      #     # #   #  
    // #        #     #  #  #  #     #     #######     #     #  #  #  
    // #        #     #  #   # #     #     #     #     #     #   # #  
    // #     #  #     #  #    ##     #     #     #     #     #    ##  
    //  #####    #####   #     #     #     #     #  #######  #     #  
    containsX(gridX) {
        return gridX >= 0 && gridX < this.width();
    }
    containsY(gridY) {
        return gridY >= 0 && gridY < this.height();
    }
    contains(gridX, gridY) {
        return this.containsX(gridX) && this.containsX(gridY);
    }
    //  #####    #####   #     #  #     #  #######   #####   #######  
    // #     #  #     #  ##    #  ##    #  #        #     #     #     
    // #        #     #  # #   #  # #   #  #        #           #     
    // #        #     #  #  #  #  #  #  #  ####     #           #     
    // #        #     #  #   # #  #   # #  #        #           #     
    // #     #  #     #  #    ##  #    ##  #        #     #     #     
    //  #####    #####   #     #  #     #  #######   #####      #     
    canBasesConnect(base1, base2) {
        if (base1.type !== base2.type)
            return false;
        if (!BaseTypes.Powered[base1.type])
            return true;
        return base1.power === base2.power;
    }
    canBaseConnectEast(gridX, gridY) {
        if (gridX < 0)
            return false;
        if (gridX >= this.width() - 1)
            return false;
        const base = this.baseGrid[gridX][gridY];
        const east = this.baseGrid[gridX + 1][gridY];
        return this.canBasesConnect(base, east);
    }
    canBaseConnectSouth(gridX, gridY) {
        if (gridY < 0)
            return false;
        if (gridY >= this.height() - 1)
            return false;
        const base = this.baseGrid[gridX][gridY];
        const south = this.baseGrid[gridX][gridY + 1];
        return this.canBasesConnect(base, south);
    }
    canBaseConnectSoutheast(gridX, gridY) {
        if (!this.canBaseConnectEast(gridX, gridY))
            return false;
        if (!this.canBaseConnectSouth(gridX, gridY))
            return false;
        const base = this.baseGrid[gridX][gridY];
        const southeast = this.baseGrid[gridX + 1][gridY + 1];
        return this.canBasesConnect(base, southeast);
    }
    potentialBaseConnections() {
        const potentialBaseConnections = [];
        for (let i = 0; i < this.width(); i++) {
            for (let j = 0; j < this.height(); j++) {
                if (this.canBaseConnectEast(i, j)) {
                    potentialBaseConnections.push(new Connection(i, j, Directions.East));
                }
                if (this.canBaseConnectSouth(i, j)) {
                    potentialBaseConnections.push(new Connection(i, j, Directions.South));
                }
                if (this.canBaseConnectSoutheast(i, j)) {
                    potentialBaseConnections.push(new Connection(i, j, Directions.Southeast));
                }
            }
        }
        return potentialBaseConnections;
    }
    connectBaseEast(gridX, gridY) {
        const base = this.baseGrid[gridX][gridY];
        const east = this.baseGrid[gridX + 1][gridY];
        base.connections |= Directions.BitsEast;
        east.connections |= Directions.BitsWest;
    }
    connectBaseSouth(gridX, gridY) {
        const base = this.baseGrid[gridX][gridY];
        const south = this.baseGrid[gridX][gridY + 1];
        base.connections |= Directions.BitsSouth;
        south.connections |= Directions.BitsNorth;
    }
    connectBaseSoutheast(gridX, gridY) {
        const base = this.baseGrid[gridX][gridY];
        const east = this.baseGrid[gridX + 1][gridY];
        const south = this.baseGrid[gridX][gridY + 1];
        const southeast = this.baseGrid[gridX + 1][gridY + 1];
        base.connections |= (Directions.BitsEast | Directions.BitsSouth | Directions.BitsSoutheast);
        east.connections |= (Directions.BitsWest | Directions.BitsSouth | Directions.BitsSouthwest);
        south.connections |= (Directions.BitsEast | Directions.BitsNorth | Directions.BitsNortheast);
        southeast.connections |= (Directions.BitsWest | Directions.BitsNorth | Directions.BitsNorthwest);
    }
    disconnectBaseEast(gridX, gridY) {
        const base = this.baseGrid[gridX][gridY];
        const east = this.baseGrid[gridX + 1][gridY];
        base.connections &= ~Directions.BitsEast;
        east.connections &= ~Directions.BitsWest;
        if (gridY > 0) {
            const north = this.baseGrid[gridX][gridY - 1];
            const northeast = this.baseGrid[gridX + 1][gridY - 1];
            base.connections &= ~Directions.BitsNortheast;
            northeast.connections &= ~Directions.BitsSouthwest;
            east.connections &= ~Directions.BitsNorthwest;
            north.connections &= ~Directions.BitsSoutheast;
        }
        if (gridY < this.height() - 1) {
            const south = this.baseGrid[gridX][gridY + 1];
            const southeast = this.baseGrid[gridX + 1][gridY + 1];
            base.connections &= ~Directions.BitsSoutheast;
            southeast.connections &= ~Directions.BitsNorthwest;
            east.connections &= ~Directions.BitsSouthwest;
            south.connections &= ~Directions.BitsNortheast;
        }
    }
    disconnectBaseSouth(gridX, gridY) {
        const base = this.baseGrid[gridX][gridY];
        const south = this.baseGrid[gridX][gridY + 1];
        base.connections &= ~Directions.BitsSouth;
        south.connections &= ~Directions.BitsNorth;
        if (gridX > 0) {
            const west = this.baseGrid[gridX - 1][gridY];
            const southwest = this.baseGrid[gridX - 1][gridY + 1];
            base.connections &= ~Directions.BitsSouthwest;
            southwest.connections &= ~Directions.BitsNortheast;
            south.connections &= ~Directions.BitsNorthwest;
            west.connections &= ~Directions.BitsSoutheast;
        }
        if (gridX < this.width() - 1) {
            const east = this.baseGrid[gridX + 1][gridY];
            const southeast = this.baseGrid[gridX + 1][gridY + 1];
            base.connections &= ~Directions.BitsSoutheast;
            southeast.connections &= ~Directions.BitsNorthwest;
            east.connections &= ~Directions.BitsSouthwest;
            south.connections &= ~Directions.BitsNortheast;
        }
    }
    disconnectBaseSoutheast(gridX, gridY) {
        const base = this.baseGrid[gridX][gridY];
        const east = this.baseGrid[gridX + 1][gridY];
        const south = this.baseGrid[gridX][gridY + 1];
        const southeast = this.baseGrid[gridX + 1][gridY + 1];
        base.connections &= ~Directions.BitsSoutheast;
        east.connections &= ~Directions.BitsSouthwest;
        south.connections &= ~Directions.BitsNortheast;
        southeast.connections &= ~Directions.BitsNorthwest;
    }
    // #######  #     #   #####   #######  ######   #######  
    //    #     ##    #  #     #  #        #     #     #     
    //    #     # #   #  #        #        #     #     #     
    //    #     #  #  #   #####   ####     ######      #     
    //    #     #   # #        #  #        #   #       #     
    //    #     #    ##  #     #  #        #    #      #     
    // #######  #     #   #####   #######  #     #     #     
    disconnectSurroundingBases(gridX, gridY) {
        const e = gridX < this.width() - 1;
        const s = gridY < this.height() - 1;
        const w = gridX > 0;
        const n = gridY > 0;
        if (e) {
            this.baseGrid[gridX + 1][gridY].connections &= ~Directions.BitsWest;
        }
        if (s) {
            this.baseGrid[gridX][gridY + 1].connections &= ~Directions.BitsNorth;
        }
        if (w) {
            this.baseGrid[gridX - 1][gridY].connections &= ~Directions.BitsEast;
        }
        if (n) {
            this.baseGrid[gridX][gridY - 1].connections &= ~Directions.BitsSouth;
        }
        if (s && e) {
            this.baseGrid[gridX + 1][gridY].connections &= ~Directions.BitsSouthwest;
            this.baseGrid[gridX][gridY + 1].connections &= ~Directions.BitsNortheast;
            this.baseGrid[gridX + 1][gridY + 1].connections &= ~Directions.BitsNorthwest;
        }
        if (s && w) {
            this.baseGrid[gridX - 1][gridY].connections &= ~Directions.BitsSoutheast;
            this.baseGrid[gridX][gridY + 1].connections &= ~Directions.BitsNorthwest;
            this.baseGrid[gridX - 1][gridY + 1].connections &= ~Directions.BitsNortheast;
        }
        if (n && w) {
            this.baseGrid[gridX - 1][gridY].connections &= ~Directions.BitsNortheast;
            this.baseGrid[gridX][gridY - 1].connections &= ~Directions.BitsSouthwest;
            this.baseGrid[gridX - 1][gridY - 1].connections &= ~Directions.BitsSoutheast;
        }
        if (n && e) {
            this.baseGrid[gridX + 1][gridY].connections &= ~Directions.BitsNorthwest;
            this.baseGrid[gridX][gridY - 1].connections &= ~Directions.BitsSoutheast;
            this.baseGrid[gridX + 1][gridY - 1].connections &= ~Directions.BitsSouthwest;
        }
    }
    insertSingleBase(base, gridX, gridY) {
        if (!this.contains(gridX, gridY))
            return;
        this.baseGrid[gridX][gridY] = base;
        this.disconnectSurroundingBases(gridX, gridY);
    }
}
