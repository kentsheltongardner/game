import Connection from './data/connection.js';
import BaseTypes from './enums/base_types.js';
import Directions from './enums/directions.js';
import Base from './objects/base.js';
import Tile from './objects/tile.js';
export default class Puzzle {
    static DefaultWidth = 4;
    static DefaultHeight = 3;
    baseGrid;
    faceGrid;
    tileGrid;
    constructor() {
        this.baseGrid = [];
        this.faceGrid = [];
        this.tileGrid = [];
    }
    loadDefault() {
        const width = Puzzle.DefaultWidth;
        const height = Puzzle.DefaultHeight;
        this.baseGrid = new Array(width);
        this.faceGrid = new Array(width);
        this.tileGrid = new Array(width);
        for (let i = 0; i < width; i++) {
            const e = i < width - 1;
            const w = i > 0;
            this.baseGrid[i] = new Array(height);
            this.faceGrid[i] = new Array(height);
            this.tileGrid[i] = new Array(height);
            for (let j = 0; j < height; j++) {
                const base = new Base();
                const s = j < height - 1;
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
                this.baseGrid[i][j] = base;
                this.faceGrid[i][j] = [];
                this.tileGrid[i][j] = new Tile();
            }
        }
        // this.faceGrid[0][0].push(new Face(
        //     FaceTypes.Back, Watermarks.Cloud, FaceRules.Beehive, Colors.Red, Directions.None, Directions.BitsNone
        // ))
        // this.faceGrid[0][0].push(new Face(
        //     FaceTypes.Front, Watermarks.Cloud, FaceRules.Beehive, Colors.Red, Directions.None, Directions.BitsNone
        // ))
    }
    load(baseGrid, faceGrid, tileGrid) {
        this.baseGrid = baseGrid;
        this.faceGrid = faceGrid;
        this.tileGrid = tileGrid;
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
    updateFacePositions() {
        for (let i = 0; i < this.faceGrid.length; i++) {
            for (let j = 0; j < this.faceGrid[i].length; j++) {
                for (let k = 0; k < this.faceGrid[i][j].length; k++) {
                    const face = this.faceGrid[i][j][k];
                    face.x = i;
                    face.y = j;
                    face.z = k;
                }
            }
        }
    }
    updateFaceConnectionBits() {
        // Upon connecting faces, update connection bits for all faces
        // Establish initial connections
        for (let i = 0; i < this.faceGrid.length; i++) {
            for (let j = 0; j < this.faceGrid[i].length; j++) {
                for (let k = 0; k < this.faceGrid[i][j].length; k++) {
                    const face = this.faceGrid[i][j][k];
                    face.connectionBits = Directions.BitsNone;
                    for (let l = 0; l < face.connections.length; l++) {
                        if (face.connections[l] !== null) {
                            face.connectionBits |= Directions.Bits[l + 1];
                        }
                    }
                }
            }
        }
        // Remove holes
        for (let i = 0; i < this.faceGrid.length; i++) {
            for (let j = 0; j < this.faceGrid[i].length; j++) {
                for (let k = 0; k < this.faceGrid[i][j].length; k++) {
                    const face = this.faceGrid[i][j][k];
                    this.removeHoles(face);
                }
            }
        }
    }
    removeHoles(face) {
        const faceEast = face.connections[Directions.East - 1];
        const faceSouth = face.connections[Directions.South - 1];
        const faceWest = face.connections[Directions.West - 1];
        const faceNorth = face.connections[Directions.North - 1];
        const isFaceEast = faceEast !== null;
        const isFaceSouth = faceSouth !== null;
        const isFaceWest = faceWest !== null;
        const isFaceNorth = faceNorth !== null;
        const parity = face.z % 2;
        const evenParity = parity === 0;
        if (isFaceEast && isFaceSouth) {
            if (evenParity) {
                if (this.isConnectedCycle(Directions.East, parity, faceEast, face)) {
                    face.connectionBits |= Directions.BitsSoutheast;
                }
            }
            else {
                if (this.isConnectedCycle(Directions.South, parity, faceSouth, face)) {
                    face.connectionBits |= Directions.BitsSoutheast;
                }
            }
        }
        if (isFaceWest && isFaceSouth) {
            if (evenParity) {
                if (this.isConnectedCycle(Directions.South, parity, faceSouth, face)) {
                    face.connectionBits |= Directions.BitsSouthwest;
                }
            }
            else {
                if (this.isConnectedCycle(Directions.West, parity, faceWest, face)) {
                    face.connectionBits |= Directions.BitsSouthwest;
                }
            }
        }
        if (isFaceWest && isFaceNorth) {
            if (evenParity) {
                if (this.isConnectedCycle(Directions.West, parity, faceWest, face)) {
                    face.connectionBits |= Directions.BitsNorthwest;
                }
            }
            else {
                if (this.isConnectedCycle(Directions.North, parity, faceNorth, face)) {
                    face.connectionBits |= Directions.BitsNorthwest;
                }
            }
        }
        if (isFaceEast && isFaceNorth) {
            if (evenParity) {
                if (this.isConnectedCycle(Directions.North, parity, faceNorth, face)) {
                    face.connectionBits |= Directions.BitsNortheast;
                }
            }
            else {
                if (this.isConnectedCycle(Directions.East, parity, faceEast, face)) {
                    face.connectionBits |= Directions.BitsNortheast;
                }
            }
        }
    }
    isConnectedCycle(directionIn, parityIn, currentFace, startFace) {
        if (currentFace === startFace)
            return true;
        const parity = currentFace.z % 2;
        if (parity === parityIn) {
            directionIn = Directions.Opposite[directionIn];
        }
        const evenParity = parity === 0;
        const direction = evenParity ? Directions.CounterClockwise[directionIn] : Directions.Clockwise[directionIn];
        const connectionIndex = direction - 1;
        const connectedFace = currentFace.connections[connectionIndex];
        if (connectedFace === null) {
            return false;
        }
        return this.isConnectedCycle(direction, parity, connectedFace, startFace);
    }
    canFacesConnect(face1, face2) {
        if (face1.type !== face2.type)
            return false;
        if (face1.watermark !== face2.watermark)
            return false;
        return true;
    }
    canFaceConnect(gridX, gridY, dx, dy, depth) {
        const faceStack = this.faceGrid[gridX][gridY];
        if (faceStack.length < depth)
            return false;
        const faceStackOther = this.faceGrid[gridX + dx][gridY + dy];
        if (faceStackOther.length < depth)
            return false;
        const face = faceStack[faceStack.length - depth];
        const faceOther = faceStackOther[faceStackOther.length - depth];
        if (!this.canFacesConnect(face, faceOther))
            return false;
        return true;
    }
    canCardConnect(gridX, gridY, dx, dy) {
        if (!this.contains(gridX, gridY))
            return false;
        if (!this.contains(gridX + dx, gridY + dy))
            return false;
        if (!this.canFaceConnect(gridX, gridY, dx, dy, 1))
            return false;
        if (!this.canFaceConnect(gridX, gridY, dx, dy, 2))
            return false;
        return true;
    }
    connectCard(gridX, gridY, dx, dy) {
        if (!this.canCardConnect(gridX, gridY, dx, dy))
            return false;
        const direction = Directions.getDirection(dx, dy);
        const oppositeDirection = Directions.Opposite[direction];
        const directionIndex = direction - 1;
        const oppositeDirectionIndex = oppositeDirection - 1;
        const topFace = this.topCardTopFace(gridX, gridY);
        const bottomFace = this.topCardBottomFace(gridX, gridY);
        const otherTopFace = this.topCardTopFace(gridX + dx, gridY + dy);
        const otherBottomFace = this.topCardBottomFace(gridX + dx, gridY + dy);
        topFace.connections[directionIndex] = otherTopFace;
        bottomFace.connections[directionIndex] = otherBottomFace;
        otherTopFace.connections[oppositeDirectionIndex] = topFace;
        otherBottomFace.connections[oppositeDirectionIndex] = bottomFace;
        this.updateFaceConnectionBits();
    }
    topCardTopFace(gridX, gridY) {
        const faceStack = this.faceGrid[gridX][gridY];
        return faceStack[faceStack.length - 1];
    }
    topCardBottomFace(gridX, gridY) {
        const faceStack = this.faceGrid[gridX][gridY];
        return faceStack[faceStack.length - 2];
    }
    creaseCard(gridX, gridY, dx, dy) {
        if (!this.contains(gridX, gridY))
            return;
        if (!this.contains(gridX + dx, gridY + dy))
            return;
        const stack = this.faceGrid[gridX][gridY];
        if (stack.length === 0)
            return;
        const topFace = this.topCardTopFace(gridX, gridY);
        const direction = Directions.getDirection(dx, dy);
        const connectionIndex = direction - 1;
        const topConnectedFace = topFace.connections[connectionIndex];
        if (topConnectedFace === null)
            return;
        const bottomFace = this.topCardBottomFace(gridX, gridY);
        const bottomConnectedFace = bottomFace.connections[connectionIndex];
        const creaseDirectionBit = Directions.Bits[direction];
        topFace.creaseBits |= creaseDirectionBit;
        bottomFace.creaseBits |= creaseDirectionBit;
        const topConnectedFaceParity = topConnectedFace.z % 2;
        const bottomConnectedFaceParity = bottomConnectedFace.z % 2;
        const oppositeCreaseDirectionBit = Directions.Bits[Directions.Opposite[direction]];
        topConnectedFace.creaseBits |= topConnectedFaceParity === 1 ? oppositeCreaseDirectionBit : creaseDirectionBit;
        bottomConnectedFace.creaseBits |= bottomConnectedFaceParity === 0 ? oppositeCreaseDirectionBit : creaseDirectionBit;
    }
    flattenCard(gridX, gridY, dx, dy) {
    }
    flipFoldCard(gridX, gridY, dx, dy) {
        if (!this.contains(gridX, gridY))
            return;
        if (!this.contains(gridX + dx, gridY + dy))
            return;
        const stack = this.faceGrid[gridX][gridY];
        if (stack.length === 0)
            return;
        const flipFoldSet = new Set();
        const topFace = this.topCardTopFace(gridX, gridY);
        const direction = Directions.getDirection(dx, dy);
        const directionBits = Directions.Bits[direction];
        this.populateFlipFoldSet(topFace, flipFoldSet, gridX, gridY, direction, directionBits);
        for (const face of flipFoldSet) {
            switch (direction) {
                case Directions.East: {
                    if (face.x > gridX)
                        return;
                    const reflectedX = gridX + (gridX - face.x) + 1;
                    if (reflectedX > this.width() - 1)
                        return;
                    break;
                }
                case Directions.South: {
                    if (face.y > gridY)
                        return;
                    const reflectedY = gridY + (gridY - face.y) + 1;
                    if (reflectedY > this.height() - 1)
                        return;
                    break;
                }
                case Directions.West: {
                    if (face.x < gridX)
                        return;
                    const reflectedX = gridX - (face.x - gridX) - 1;
                    if (reflectedX < 0)
                        return;
                    break;
                }
                case Directions.North: {
                    if (face.y < gridY)
                        return;
                    const reflectedX = gridY - (face.y - gridY) - 1;
                    if (reflectedX < 0)
                        return;
                    break;
                }
            }
        }
        for (let i = 0; i < this.width(); i++) {
            for (let j = 0; j < this.height(); j++) {
                const faceStack = this.faceGrid[i][j];
                for (let k = faceStack.length - 1; k >= 0; k--) {
                    const face = faceStack[k];
                    if (!flipFoldSet.has(face))
                        break;
                    faceStack.pop();
                    flipFoldSet.delete(face);
                    switch (direction) {
                        case Directions.East: {
                            const reflectedX = gridX + (gridX - i) + 1;
                            face.flipX();
                            this.faceGrid[reflectedX][j].push(face);
                            break;
                        }
                        case Directions.South: {
                            const reflectedY = gridY + (gridY - j) + 1;
                            face.flipY();
                            this.faceGrid[i][reflectedY].push(face);
                            break;
                        }
                        case Directions.West: {
                            const reflectedX = gridX - (i - gridX) - 1;
                            face.flipX();
                            this.faceGrid[reflectedX][j].push(face);
                            break;
                        }
                        case Directions.North: {
                            const reflectedY = gridY - (j - gridY) - 1;
                            face.flipY();
                            this.faceGrid[i][reflectedY].push(face);
                            break;
                        }
                    }
                }
            }
        }
        this.updateFacePositions();
        this.updateFaceConnectionBits();
    }
    populateFlipFoldSet(face, faces, foldGridX, foldGridY, direction, directionBits) {
        if (faces.has(face))
            return;
        faces.add(face);
        const pairedFace = face.z % 2 === 0
            ? this.faceGrid[face.x][face.y][face.z + 1]
            : this.faceGrid[face.x][face.y][face.z - 1];
        this.populateFlipFoldSet(pairedFace, faces, foldGridX, foldGridY, direction, directionBits);
        const stack = this.faceGrid[face.x][face.y];
        if (face.z < stack.length - 1) {
            const carriedFace = this.faceGrid[face.x][face.y][face.z + 1];
            this.populateFlipFoldSet(carriedFace, faces, foldGridX, foldGridY, direction, directionBits);
        }
        for (let i = Directions.East; i <= Directions.North; i++) {
            const connectedFace = face.connections[i - 1];
            if (connectedFace === null)
                continue;
            if (i === direction) {
                switch (direction) {
                    case Directions.East:
                    case Directions.West:
                        if (face.x === foldGridX
                            && (face.creaseBits & directionBits) === directionBits)
                            continue;
                        break;
                    case Directions.South:
                    case Directions.North:
                        if (face.y === foldGridY
                            && (face.creaseBits & directionBits) === directionBits)
                            continue;
                        break;
                }
            }
            this.populateFlipFoldSet(connectedFace, faces, foldGridX, foldGridY, direction, directionBits);
        }
    }
    disconnectCard(gridX, gridY, dx, dy) {
    }
    flattenCrease(gridX, gridY, dx, dy) {
    }
    delete(gridX, gridY) {
    }
    clearFaceFlags() {
        for (let i = 0; i < this.width(); i++) {
            for (let j = 0; j < this.height(); j++) {
                for (let k = 0; k < this.faceGrid[i][j].length; k++) {
                    this.faceGrid[i][j][k].flag = false;
                }
            }
        }
    }
    recursiveDelete(gridX, gridY) {
        if (!this.contains(gridX, gridY))
            return;
        if (this.faceGrid[gridX][gridY].length === 0)
            return;
        this.clearFaceFlags();
        this.propagateRecursiveDelete(this.topCardTopFace(gridX, gridY));
        for (let i = 0; i < this.width(); i++) {
            for (let j = 0; j < this.height(); j++) {
                const stack = this.faceGrid[i][j];
                for (let k = stack.length - 1; k >= 0; k--) {
                    const face = stack[k];
                    if (face.flag) {
                        stack.splice(k, 1);
                    }
                }
            }
        }
        this.updateFacePositions();
    }
    propagateRecursiveDelete(face) {
        if (face.flag)
            return;
        face.flag = true;
        const pairedIndexZ = face.z % 2 === 0 ? face.z + 1 : face.z - 1;
        const pairedFace = this.faceGrid[face.x][face.y][pairedIndexZ];
        this.propagateRecursiveDelete(pairedFace);
        for (const connectedFace of face.connections) {
            if (connectedFace === null)
                continue;
            this.propagateRecursiveDelete(connectedFace);
        }
    }
    // disconnectCard(gridX: number, gridY: number, dx: number, dy: number) {
    //     if (!this.canCardConnect(gridX, gridY, dx, dy)) return false
    //     const direction     = Directions.getDirection(dx, dy)
    //     const opposite      = Directions.Opposite[direction]
    //     const directionBits = Directions.Bits[direction]
    //     const oppositeBits  = Directions.Bits[opposite]
    //     const topFace       = this.topCardTopFace(gridX, gridY)
    //     this.topCardTopFace(gridX, gridY).connections               |= directionBits
    //     this.topCardBottomFace(gridX, gridY).connections            |= directionBits
    //     this.topCardTopFace(gridX + dx, gridY + dy).connections     |= oppositeBits
    //     this.topCardBottomFace(gridX + dx, gridY + dy).connections  |= oppositeBits
    // }
    // potentialCardConnections() {
    //     const potentialCardConnections = []
    //     for (let i = 0; i < this.width(); i++) {
    //         for (let j = 0; j < this.height(); j++) {
    //             if (this.canCardConnect(i, j, 1, 0)) {
    //                 potentialCardConnections.push(new Connection(i, j, Directions.East))
    //             }
    //             if (this.canCardConnect(i, j, 0, 1)) {
    //                 potentialCardConnections.push(new Connection(i, j, Directions.South))
    //             }
    //         }
    //     }
    //     return potentialCardConnections
    // }
    // connectCardEast(gridX: number, gridY: number) {
    //     const faceStack     = this.faceGrid[gridX][gridY]
    //     if (faceStack.length === 0) return
    //     const faceStackEast = this.faceGrid[gridX + 1][gridY]
    //     if (faceStackEast.length === 0) return
    //     const zTop          = faceStack.length - 1
    //     const zBottom       = faceStack.length - 2
    //     const zTopEast      = faceStackEast.length - 1
    //     const zBottomEast   = faceStackEast.length - 2
    //     faceStack[zTop].connections     |= Directions.BitsEast
    //     faceStack[zBottom].connections  |= Directions.BitsEast
    //     faceStackEast[zTopEast].connections     |= Directions.BitsWest
    //     faceStackEast[zBottomEast].connections  |= Directions.BitsWest
    // }
    // connectCardSouth(gridX: number, gridY: number) {
    //     const faceStack         = this.faceGrid[gridX][gridY]
    //     if (faceStack.length === 0) return
    //     const faceStackSouth    = this.faceGrid[gridX][gridY + 1]
    //     if (faceStackSouth.length === 0) return
    //     const zTop              = faceStack.length - 1
    //     const zBottom           = faceStack.length - 2
    //     const zTopSouth         = faceStackSouth.length - 1
    //     const zBottomSouth      = faceStackSouth.length - 2
    //     faceStack[zTop].connections     |= Directions.BitsSouth
    //     faceStack[zBottom].connections  |= Directions.BitsSouth
    //     faceStackSouth[zTopSouth].connections       |= Directions.BitsNorth
    //     faceStackSouth[zBottomSouth].connections    |= Directions.BitsNorth
    // }
    // disconnectCardEast(gridX: number, gridY: number) {
    //     const faceStack     = this.faceGrid[gridX][gridY]
    //     if (faceStack.length === 0) return
    //     const faceStackEast = this.faceGrid[gridX + 1][gridY]
    //     if (faceStackEast.length === 0) return
    //     const zTop          = faceStack.length - 1
    //     const zBottom       = faceStack.length - 2
    //     const zTopEast      = faceStackEast.length - 1
    //     const zBottomEast   = faceStackEast.length - 2
    //     faceStack[zTop].connections     &= ~Directions.BitsEast
    //     faceStack[zBottom].connections  &= ~Directions.BitsEast
    //     faceStackEast[zTopEast].connections     &= ~Directions.BitsWest
    //     faceStackEast[zBottomEast].connections  &= ~Directions.BitsWest
    // }
    // disconnectCardSouth(gridX: number, gridY: number) {
    //     const faceStack         = this.faceGrid[gridX][gridY]
    //     if (faceStack.length === 0) return
    //     const faceStackSouth    = this.faceGrid[gridX][gridY + 1]
    //     if (faceStackSouth.length === 0) return
    //     const zTop              = faceStack.length - 1
    //     const zBottom           = faceStack.length - 2
    //     const zTopSouth         = faceStackSouth.length - 1
    //     const zBottomSouth      = faceStackSouth.length - 2
    //     faceStack[zTop].connections     &= ~Directions.BitsSouth
    //     faceStack[zBottom].connections  &= ~Directions.BitsSouth
    //     faceStackSouth[zTopSouth].connections       &= ~Directions.BitsNorth
    //     faceStackSouth[zBottomSouth].connections    &= ~Directions.BitsNorth
    // }
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
    insertSingleFace(face, gridX, gridY) {
        if (!this.contains(gridX, gridY))
            return;
        this.faceGrid[gridX][gridY].push(face);
        this.updateFacePositions();
    }
    // #######  ######   #######  #######  
    // #        #     #     #        #     
    // #        #     #     #        #     
    // ####     #     #     #        #     
    // #        #     #     #        #     
    // #        #     #     #        #     
    // #######  ######   #######     #     
    updateBase(gridX, gridY, newBase) {
        this.propagateBase(gridX, gridY, newBase);
        this.baseGrid[gridX][gridY] = newBase;
    }
    propagateBase(gridX, gridY, newBase) {
        const base = this.baseGrid[gridX][gridY];
        if (base.type === newBase.type
            && base.power === newBase.power
            && base.fixed === newBase.fixed)
            return;
        base.type = newBase.type;
        base.power = newBase.power;
        base.fixed = newBase.fixed;
        for (let direction = Directions.East; direction <= Directions.Northeast; direction++) {
            const bits = Directions.Bits[direction];
            if ((base.connections & bits) !== bits)
                continue;
            this.propagateBase(gridX + Directions.X[direction], gridY + Directions.Y[direction], newBase);
        }
    }
    updateFace(gridX, gridY, z, newFace) {
        this.faceGrid[gridX][gridY][z] = newFace;
    }
    deleteCard(gridX, gridY) {
        const faceStack = this.faceGrid[gridX][gridY];
        if (faceStack.length === 0)
            return;
        faceStack.pop();
        faceStack.pop();
    }
    recursiveDeleteCard() {
    }
    reverseCard(gridX, gridY) {
        const faceStack = this.faceGrid[gridX][gridY];
        if (faceStack.length === 0)
            return;
        const zTop = faceStack.length - 1;
        const zBottom = faceStack.length - 2;
        const topFace = faceStack[zTop];
        const bottomFace = faceStack[zBottom];
        faceStack[zTop] = bottomFace;
        faceStack[zBottom] = topFace;
    }
    recursiveReverseCard() {
    }
}
