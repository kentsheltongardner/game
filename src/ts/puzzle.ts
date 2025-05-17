import BaseTypes        from './enums/base_types.js'
import Directions       from './enums/directions.js'
import Base             from './objects/base.js'
import Face             from './objects/face.js'
import Tile             from './objects/tile.js'
import ConnectionToggle from './data/connection_toggle.js'
import FaceRules from './enums/face_rules.js'
import FaceTypes from './enums/face_types.js'
import Colors from './enums/colors.js'
import Materials from './enums/material.js'

export default class Puzzle {

    public static readonly DefaultWidth     = 4
    public static readonly DefaultHeight    = 3

    public baseGrid: Array<Array<Base>>
    public faceGrid: Array<Array<Array<Face>>>
    public tileGrid: Array<Array<Tile | null>>

    constructor() {
        this.baseGrid = []
        this.faceGrid = []
        this.tileGrid = []
    }
    
    loadDefault() {
        const width     = Puzzle.DefaultWidth
        const height    = Puzzle.DefaultHeight
        this.baseGrid   = new Array(width)
        this.faceGrid   = new Array(width)
        this.tileGrid   = new Array(width)

        for (let i = 0; i < width; i++) {
            const e             = i < width - 1
            const w             = i > 0
            this.baseGrid[i]    = new Array(height)
            this.faceGrid[i]    = new Array(height)
            this.tileGrid[i]    = new Array(height)

            for (let j = 0; j < height; j++) {
                const base  = new Base()
                const s     = j < height - 1
                const n     = j > 0
        
                if (e)      base.connectionBits |= Directions.Bits[Directions.East]
                if (s)      base.connectionBits |= Directions.Bits[Directions.South]
                if (w)      base.connectionBits |= Directions.Bits[Directions.West]
                if (n)      base.connectionBits |= Directions.Bits[Directions.North]
                if (e && s) base.connectionBits |= Directions.Bits[Directions.Southeast]
                if (w && s) base.connectionBits |= Directions.Bits[Directions.Southwest]
                if (w && n) base.connectionBits |= Directions.Bits[Directions.Northwest]
                if (e && n) base.connectionBits |= Directions.Bits[Directions.Northeast]
                
                this.baseGrid[i][j] = base
                this.faceGrid[i][j] = []
                this.tileGrid[i][j] = null
            }
        }

        // this.faceGrid[0][0].push(new Face(
        //     FaceTypes.Back, Watermarks.Cloud, FaceRules.Beehive, Colors.Red, Directions.None, Directions.BitsNone
        // ))
        // this.faceGrid[0][0].push(new Face(
        //     FaceTypes.Front, Watermarks.Cloud, FaceRules.Beehive, Colors.Red, Directions.None, Directions.BitsNone
        // ))
    }

    load(
        baseGrid: Array<Array<Base>>,
        faceGrid: Array<Array<Array<Face>>>,
        tileGrid: Array<Array<Tile>>,
    ) {
        this.baseGrid = baseGrid
        this.faceGrid = faceGrid
        this.tileGrid = tileGrid
    }



//  #####   #######  #######  #######  
// #     #     #          #   #        
// #           #         #    #        
//  #####      #        #     ####     
//       #     #       #      #        
// #     #     #      #       #        
//  #####   #######  #######  #######  
    width() {
        return this.baseGrid.length
    }
    height() {
        return this.baseGrid[0].length
    }



//  #####   ######    #####   #     #  
// #     #  #     #  #     #  #     #  
// #        #     #  #     #  #     #  
// #        ######   #     #  #  #  #  
// #   ###  #   #    #     #  # # # #  
// #     #  #    #   #     #  ##   ##  
//  #####   #     #   #####   #     #  

    growEast() {
        const height = this.height()
        const columnEast = new Array<Base>(height)
        for (let i = 0; i < height; i++) {
            columnEast[i] = new Base()
        }
        this.baseGrid.push(columnEast)
    }
    growWest() {
        const height = this.height()
        const columnWest = new Array<Base>(height)
        for (let i = 0; i < height; i++) {
            columnWest[i] = new Base()
        }
        this.baseGrid.unshift(columnWest)
    }
    growSouth() {
        for (let i = 0; i < this.width(); i++) {
            this.baseGrid[i].push(new Base())
        }
    }
    growNorth() {
        for (let i = 0; i < this.width(); i++) {
            this.baseGrid[i].unshift(new Base())
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
        if (this.width() === 1) return false

        this.baseGrid.pop()
        const columnEast = this.baseGrid[this.width() - 1]
        for (let i = 0; i < this.height(); i++) {
            columnEast[i].connectionBits &= ~(Directions.BitsNortheast | Directions.BitsEast | Directions.BitsSoutheast)
        }
        return true
    }
    shrinkWest() {
        if (this.width() === 1) return false

        this.baseGrid.shift()
        const columnWest = this.baseGrid[0]
        for (let i = 0; i < this.height(); i++) {
            columnWest[i].connectionBits &= ~(Directions.BitsNorthwest | Directions.BitsWest | Directions.BitsSouthwest)
        }
        return true
    }
    shrinkSouth() {
        if (this.height() === 1) return false

        const rowSouthIndex = this.height() - 2
        for (let i = 0; i < this.width(); i++) {
            this.baseGrid[i].pop()
            this.baseGrid[i][rowSouthIndex].connectionBits &= ~(Directions.BitsSoutheast | Directions.BitsSouth | Directions.BitsSouthwest)
        }
        return true
    }
    shrinkNorth() {
        if (this.height() === 1) return false

        for (let i = 0; i < this.width(); i++) {
            this.baseGrid[i].shift()
            this.baseGrid[i][0].connectionBits &= ~(Directions.BitsNortheast | Directions.BitsNorth | Directions.BitsNorthwest)
        }
        return true
    }



//  #####    #####   #     #  #######     #     #######  #     #  
// #     #  #     #  ##    #     #       # #       #     ##    #  
// #        #     #  # #   #     #      #   #      #     # #   #  
// #        #     #  #  #  #     #     #######     #     #  #  #  
// #        #     #  #   # #     #     #     #     #     #   # #  
// #     #  #     #  #    ##     #     #     #     #     #    ##  
//  #####    #####   #     #     #     #     #  #######  #     #  

    containsX(gridX: number) {
        return gridX >= 0 && gridX < this.width()
    }
    containsY(gridY: number) {
        return gridY >= 0 && gridY < this.height()
    }
    contains(gridX: number, gridY: number) {
        return this.containsX(gridX) && this.containsY(gridY)
    }



























// #######  #     #   #####   #######  ######   #######  
//    #     ##    #  #     #  #        #     #     #     
//    #     # #   #  #        #        #     #     #     
//    #     #  #  #   #####   ####     ######      #     
//    #     #   # #        #  #        #   #       #     
//    #     #    ##  #     #  #        #    #      #     
// #######  #     #   #####   #######  #     #     #     

// ######      #      #####   #######  
// #     #    # #    #     #  #        
// #     #   #   #   #        #        
// ######   #######   #####   ####     
// #     #  #     #        #  #        
// #     #  #     #  #     #  #        
// ######   #     #   #####   #######  

    insertBase(base: Base, gridX: number, gridY: number) {
        if (!this.contains(gridX, gridY)) return

        for (let i = Directions.East; i < Directions.BitsNortheast; i++) {
            this.disconnectBase(gridX, gridY, i)
        }
        this.baseGrid[gridX][gridY] = base
    }



// #     #  ######   ######      #     #######  #######  
// #     #  #     #  #     #    # #       #     #        
// #     #  #     #  #     #   #   #      #     #        
// #     #  ######   #     #  #######     #     ####     
// #     #  #        #     #  #     #     #     #        
// #     #  #        #     #  #     #     #     #        
//  #####   #        ######   #     #     #     #######  

// ######      #      #####   #######  
// #     #    # #    #     #  #        
// #     #   #   #   #        #        
// ######   #######   #####   ####     
// #     #  #     #        #  #        
// #     #  #     #  #     #  #        
// ######   #     #   #####   #######  

    updateBase(gridX: number, gridY: number, newBase: Base) {
        const base      = this.baseGrid[gridX][gridY]
        base.rule       = newBase.rule
        base.color      = newBase.color
        base.count      = newBase.count
        base.axis       = newBase.axis
        base.direction  = newBase.direction
        base.spin       = newBase.spin
        base.shape      = newBase.shape
        base.visible    = newBase.visible

        this.propagateBaseUpdate(gridX, gridY, newBase)
    }

    propagateBaseUpdate(gridX: number, gridY: number, newBase: Base) {
        const base  = this.baseGrid[gridX][gridY]
        if (
            base.type === newBase.type 
            && base.power === newBase.power 
            && base.fixed === newBase.fixed
        ) return

        base.type   = newBase.type
        base.power  = newBase.power
        base.fixed  = newBase.fixed
        
        for (let i = Directions.East; i <= Directions.Northeast; i++) {
            const bit           = Directions.Bits[i]
            const connected     = (base.connectionBits & bit) === bit
            if (!connected) continue

            const connectedX    = gridX + Directions.X[i]
            const connectedY    = gridY + Directions.Y[i]
            this.propagateBaseUpdate(connectedX, connectedY, newBase)
        }
    }


//  #####    #####   #     #  #     #  #######   #####   #######  
// #     #  #     #  ##    #  ##    #  #        #     #     #     
// #        #     #  # #   #  # #   #  #        #           #     
// #        #     #  #  #  #  #  #  #  ####     #           #     
// #        #     #  #   # #  #   # #  #        #           #     
// #     #  #     #  #    ##  #    ##  #        #     #     #     
//  #####    #####   #     #  #     #  #######   #####      #     

// ######      #      #####   #######  
// #     #    # #    #     #  #        
// #     #   #   #   #        #        
// ######   #######   #####   ####     
// #     #  #     #        #  #        
// #     #  #     #  #     #  #        
// ######   #     #   #####   #######  

    canBasesConnect(base1: Base, base2: Base) {
        if (base1.type  !== base2.type)             return false
        if (!BaseTypes.Powered[base1.type])         return true
        if (base1.power !== base2.power)            return false
        if (base1.fixed !== base2.fixed)            return false

                                                    return true
    }
    baseConnected(gridX: number, gridY: number, direction: number) {
        if (!this.contains(gridX, gridY))           return false

        const base  = this.baseGrid[gridX][gridY]
        const bit   = Directions.Bits[direction]
        if ((bit & base.connectionBits) === bit)    return true
                                                    return false
    }
    canBaseConnectionToggle(gridX: number, gridY: number, direction: number) {
        if (!this.contains(gridX, gridY))               return false

        const oppositeX     = gridX + Directions.X[direction]
        const oppositeY     = gridY + Directions.Y[direction]
        if (!this.contains(oppositeX, oppositeY))       return false

        const base          = this.baseGrid[gridX][gridY]
        const oppositeBase  = this.baseGrid[oppositeX][oppositeY]
        if (!this.canBasesConnect(base, oppositeBase))  return false
        if (Directions.Orthogonal[direction])           return true
        if (!this.contains(gridX, oppositeY))           return false
        if (!this.contains(oppositeX, gridY))           return false

        const adjacentBase1 = this.baseGrid[gridX][oppositeY]
        const adjacentBase2 = this.baseGrid[oppositeX][gridY]
        if (!this.canBasesConnect(base, adjacentBase1)) return false
        if (!this.canBasesConnect(base, adjacentBase2)) return false
                                                        return true
    }
    baseConnectionToggles() {
        const baseConnectionToggles = []
        for (let i = 0; i < this.width(); i++) {
            for (let j = 0; j < this.height(); j++) {
                if (this.canBaseConnectionToggle(i, j, Directions.East)) {
                    baseConnectionToggles.push(new ConnectionToggle(i, j, Directions.East))
                }
                if (this.canBaseConnectionToggle(i, j, Directions.South)) {
                    baseConnectionToggles.push(new ConnectionToggle(i, j, Directions.South))
                }
                if (this.canBaseConnectionToggle(i, j, Directions.Southeast)) {
                    baseConnectionToggles.push(new ConnectionToggle(i, j, Directions.Southeast))
                }
            }
        }
        return baseConnectionToggles
    }
    connectBase(gridX: number, gridY: number, direction: number) {
        if (!this.canBaseConnectionToggle(gridX, gridY, direction)) return

        const base              = this.baseGrid[gridX][gridY]
        const bit               = Directions.Bits[direction]
        if ((base.connectionBits & bit) === bit) return

        base.connectionBits     |= bit
        const oppositeX         = gridX + Directions.X[direction]
        const oppositeY         = gridY + Directions.Y[direction]
        this.connectBase(oppositeX, oppositeY, Directions.Opposite[direction])

        if (Directions.Orthogonal[direction]) return

        const clockwiseDirection        = Directions.EighthClockwise[direction]
        const clockwiseX                = gridX + Directions.X[clockwiseDirection]
        const clockwiseY                = gridY + Directions.Y[clockwiseDirection]
        const counterClockwiseDirection = Directions.QuarterCounterClockwise[direction]

        this.connectBase(gridX, gridY, clockwiseDirection)
        this.connectBase(clockwiseX, clockwiseY, counterClockwiseDirection)
    }
    disconnectBase(gridX: number, gridY: number, direction: number) {
        if (!this.contains(gridX, gridY))           return

        const base  = this.baseGrid[gridX][gridY]
        const bit   = Directions.Bits[direction]
        if ((bit & base.connectionBits) !== bit)    return

        base.connectionBits         &= ~bit
        const clockwiseDirection    = Directions.EighthClockwise[direction]
        const windingDirection      = Directions.Orthogonal[direction]
                                    ? Directions.Opposite[clockwiseDirection]
                                    : Directions.QuarterCounterClockwise[direction]
        const clockwiseX            = gridX + Directions.X[clockwiseDirection]
        const clockwiseY            = gridY + Directions.Y[clockwiseDirection]
        const oppositeX             = gridX + Directions.X[direction]
        const oppositeY             = gridY + Directions.Y[direction]

        this.disconnectBase(oppositeX, oppositeY, Directions.Opposite[direction])
        this.disconnectBase(clockwiseX, clockwiseY, windingDirection)
    }



//  #####   #        #######   #####   #     #  
// #     #  #           #     #     #  #    #   
// #        #           #     #        #   #    
// #        #           #     #        ####     
// #        #           #     #        #   #    
// #     #  #           #     #     #  #    #   
//  #####   #######  #######   #####   #     #  

    clickBase(gridX: number, gridY: number, strict: boolean = false) {
        if (!this.contains(gridX, gridY))   return

        const base  = this.baseGrid[gridX][gridY]
        if (strict && base.fixed)           return

        const power = (base.power + 1) % BaseTypes.StateCount[base.type]
        this.propagateClickBase(gridX, gridY, power)
    }
    propagateClickBase(gridX: number, gridY: number, power: number) {
        const base = this.baseGrid[gridX][gridY]
        if (base.power === power) return

        base.power = power
        for (let i = Directions.East; i <= Directions.Northeast; i++) {
            const bit           = Directions.Bits[i]
            const connected     = (base.connectionBits & bit) === bit
            if (!connected) continue

            const connectedX    = gridX + Directions.X[i]
            const connectedY    = gridY + Directions.Y[i]
            this.propagateClickBase(connectedX, connectedY, power)
        }
    }




























//  #####      #     ######   ######   
// #     #    # #    #     #  #     #  
// #         #   #   #     #  #     #  
// #        #######  ######   #     #  
// #        #     #  #   #    #     #  
// #     #  #     #  #    #   #     #  
//  #####   #     #  #     #  ######   

// #     #  #######  #######  #        #######  #######  #     #  
// #     #     #        #     #           #        #      #   #   
// #     #     #        #     #           #        #       # #    
// #     #     #        #     #           #        #        #     
// #     #     #        #     #           #        #        #     
// #     #     #        #     #           #        #        #     
//  #####      #     #######  #######  #######     #        #     

    topCardTopFace(gridX: number, gridY: number) {
        const faceStack = this.faceGrid[gridX][gridY]
        return faceStack[faceStack.length - 1]
    }
    topCardBottomFace(gridX: number, gridY: number) {
        const faceStack = this.faceGrid[gridX][gridY]
        return faceStack[faceStack.length - 2]
    }
    updateFacePositions() {
        for (let i = 0; i < this.faceGrid.length; i++) {
            for (let j = 0; j < this.faceGrid[i].length; j++) {
                for (let k = 0; k < this.faceGrid[i][j].length; k++) {
                    const face = this.faceGrid[i][j][k]
                    face.x = i
                    face.y = j
                    face.z = k
                }
            }
        }
    }



// #######  #     #   #####   #######  ######   #######  
//    #     ##    #  #     #  #        #     #     #     
//    #     # #   #  #        #        #     #     #     
//    #     #  #  #   #####   ####     ######      #     
//    #     #   # #        #  #        #   #       #     
//    #     #    ##  #     #  #        #    #      #     
// #######  #     #   #####   #######  #     #     #     

//  #####      #     ######   ######   
// #     #    # #    #     #  #     #  
// #         #   #   #     #  #     #  
// #        #######  ######   #     #  
// #        #     #  #   #    #     #  
// #     #  #     #  #    #   #     #  
//  #####   #     #  #     #  ######   

    insertFace(face: Face, gridX: number, gridY: number) {
        if (!this.contains(gridX, gridY)) return

        this.faceGrid[gridX][gridY].push(face)
        this.updateFacePositions()
    }



// #     #  ######   ######      #     #######  #######  
// #     #  #     #  #     #    # #       #     #        
// #     #  #     #  #     #   #   #      #     #        
// #     #  ######   #     #  #######     #     ####     
// #     #  #        #     #  #     #     #     #        
// #     #  #        #     #  #     #     #     #        
//  #####   #        ######   #     #     #     #######  

//  #####      #     ######   ######   
// #     #    # #    #     #  #     #  
// #         #   #   #     #  #     #  
// #        #######  ######   #     #  
// #        #     #  #   #    #     #  
// #     #  #     #  #    #   #     #  
//  #####   #     #  #     #  ######   

    updateCard(gridX: number, gridY: number, newTopFace: Face, newBottomFace: Face) {
        if (!this.contains(gridX, gridY))               return
        if (this.faceGrid[gridX][gridY].length === 0)   return

        const topFace           = this.topCardTopFace(gridX, gridY)
        const bottomFace        = this.topCardBottomFace(gridX, gridY)

        topFace.rule            = newTopFace.rule
        topFace.color           = newTopFace.color
        topFace.direction       = newTopFace.direction

        bottomFace.rule         = newBottomFace.rule
        bottomFace.color        = newBottomFace.color
        bottomFace.direction    = newBottomFace.direction

        this.propagateFaceUpdate(topFace, newTopFace)
        this.propagateFaceUpdate(bottomFace, newBottomFace)
    }
    propagateFaceUpdate(face: Face, newFace: Face) {
        if (face.type === newFace.type && face.watermark === newFace.watermark) return

        face.type       = newFace.type
        face.watermark  = newFace.watermark
        for (const connectedFace of face.connections) {
            if (connectedFace === null) continue

            this.propagateFaceUpdate(connectedFace, newFace)
        }
    }



//  #####    #####   #     #  #     #  #######   #####   #######  
// #     #  #     #  ##    #  ##    #  #        #     #     #     
// #        #     #  # #   #  # #   #  #        #           #     
// #        #     #  #  #  #  #  #  #  ####     #           #     
// #        #     #  #   # #  #   # #  #        #           #     
// #     #  #     #  #    ##  #    ##  #        #     #     #     
//  #####    #####   #     #  #     #  #######   #####      #     

//  #####      #     ######   ######   
// #     #    # #    #     #  #     #  
// #         #   #   #     #  #     #  
// #        #######  ######   #     #  
// #        #     #  #   #    #     #  
// #     #  #     #  #    #   #     #  
//  #####   #     #  #     #  ######   

    updateFaceConnectionBits() {
        // Upon connecting faces, update connection bits for all faces
        // Establish initial connections
        for (let i = 0; i < this.faceGrid.length; i++) {
            for (let j = 0; j < this.faceGrid[i].length; j++) {
                for (let k = 0; k < this.faceGrid[i][j].length; k++) {
                    const face = this.faceGrid[i][j][k]
                    face.connectionBits = Directions.BitsNone
                    for (let l = 0; l < face.connections.length; l++) {
                        if (face.connections[l] !== null) {
                            face.connectionBits |= Directions.Bits[l + 1]
                        }
                    }
                }
            }
        }
        // Remove holes
        for (let i = 0; i < this.faceGrid.length; i++) {
            for (let j = 0; j < this.faceGrid[i].length; j++) {
                for (let k = 0; k < this.faceGrid[i][j].length; k++) {
                    const face = this.faceGrid[i][j][k]
                    this.removeHoles(face)
                }
            }
        }   
    }
    removeHoles(face: Face) {
        const faceEast      = face.connections[Directions.East  - 1]
        const faceSouth     = face.connections[Directions.South - 1]
        const faceWest      = face.connections[Directions.West  - 1]
        const faceNorth     = face.connections[Directions.North - 1]

        const isFaceEast    = faceEast  !== null
        const isFaceSouth   = faceSouth !== null
        const isFaceWest    = faceWest  !== null
        const isFaceNorth   = faceNorth !== null

        const parity        = face.z % 2
        const evenParity    = parity === 0

        if (isFaceEast && isFaceSouth) {
            if (evenParity) {
                if (this.isConnectedCycle(Directions.East, parity, faceEast, face)) {
                    face.connectionBits |= Directions.BitsSoutheast
                }
            } else {
                if (this.isConnectedCycle(Directions.South, parity, faceSouth, face)) {
                    face.connectionBits |= Directions.BitsSoutheast
                }
            }
        }
        if (isFaceWest && isFaceSouth) {
            if (evenParity) {
                if (this.isConnectedCycle(Directions.South, parity, faceSouth, face)) {
                    face.connectionBits |= Directions.BitsSouthwest
                }
            } else {
                if (this.isConnectedCycle(Directions.West, parity, faceWest, face)) {
                    face.connectionBits |= Directions.BitsSouthwest
                }
            }
        }
        if (isFaceWest && isFaceNorth) {
            if (evenParity) {
                if (this.isConnectedCycle(Directions.West, parity, faceWest, face)) {
                    face.connectionBits |= Directions.BitsNorthwest
                }
            } else {
                if (this.isConnectedCycle(Directions.North, parity, faceNorth, face)) {
                    face.connectionBits |= Directions.BitsNorthwest
                }
            }
        }
        if (isFaceEast && isFaceNorth) {
            if (evenParity) {
                if (this.isConnectedCycle(Directions.North, parity, faceNorth, face)) {
                    face.connectionBits |= Directions.BitsNortheast
                }
            } else {
                if (this.isConnectedCycle(Directions.East, parity, faceEast, face)) {
                    face.connectionBits |= Directions.BitsNortheast
                }
            }
        }
    }
    isConnectedCycle(directionIn: number, parityIn: number, currentFace: Face, startFace: Face): boolean {
        if (currentFace === startFace) return true

        const parity = currentFace.z % 2
        if (parity === parityIn) {
            directionIn = Directions.Opposite[directionIn]
        }

        const evenParity        = parity === 0
        const direction         = evenParity 
                                    ? Directions.QuarterCounterClockwise[directionIn] 
                                    : Directions.QuarterClockwise[directionIn]
        const connectionIndex   = direction - 1
        const connectedFace     = currentFace.connections[connectionIndex]
        if (connectedFace === null) {
            return false
        }

        return this.isConnectedCycle(direction, parity, connectedFace, startFace)
    }
    canFacesConnect(face1: Face, face2: Face) {
        if (face1.type !== face2.type)              return false
        if (face1.watermark !== face2.watermark)    return false

        return true
    }
    canFaceConnect(gridX: number, gridY: number, dx: number, dy: number, depth: number) {
        const faceStack         = this.faceGrid[gridX][gridY]
        if (faceStack.length < depth) return false

        const faceStackOther    = this.faceGrid[gridX + dx][gridY + dy]
        if (faceStackOther.length < depth) return false

        const face              = faceStack[faceStack.length - depth]
        const faceOther         = faceStackOther[faceStackOther.length - depth]
        if (!this.canFacesConnect(face, faceOther)) return false

        return true
    }
    canCardConnect(gridX: number, gridY: number, dx: number, dy: number) {
        if (!this.contains(gridX, gridY))                   return false
        if (!this.contains(gridX + dx, gridY + dy))         return false
        if (!this.canFaceConnect(gridX, gridY, dx, dy, 1))  return false
        if (!this.canFaceConnect(gridX, gridY, dx, dy, 2))  return false

        return true
    }
    connectCard(gridX: number, gridY: number, dx: number, dy: number) {
        if (!this.canCardConnect(gridX, gridY, dx, dy)) return false

        const direction                                     = Directions.getDirection(dx, dy)
        const oppositeDirection                             = Directions.Opposite[direction]

        const directionIndex                                = direction - 1
        const oppositeDirectionIndex                        = oppositeDirection - 1

        const topFace                                       = this.topCardTopFace(gridX, gridY)
        const bottomFace                                    = this.topCardBottomFace(gridX, gridY)
        const otherTopFace                                  = this.topCardTopFace(gridX + dx, gridY + dy)
        const otherBottomFace                               = this.topCardBottomFace(gridX + dx, gridY + dy)

        topFace.connections[directionIndex]                 = otherTopFace
        bottomFace.connections[directionIndex]              = otherBottomFace
        otherTopFace.connections[oppositeDirectionIndex]    = topFace
        otherBottomFace.connections[oppositeDirectionIndex] = bottomFace

        this.updateFaceConnectionBits()
    }



//  #####   ######   #######     #      #####   #######  
// #     #  #     #  #          # #    #     #  #        
// #        #     #  #         #   #   #        #        
// #        ######   ####     #######   #####   ####     
// #        #   #    #        #     #        #  #        
// #     #  #    #   #        #     #  #     #  #        
//  #####   #     #  #######  #     #   #####   #######  

//  #####      #     ######   ######   
// #     #    # #    #     #  #     #  
// #         #   #   #     #  #     #  
// #        #######  ######   #     #  
// #        #     #  #   #    #     #  
// #     #  #     #  #    #   #     #  
//  #####   #     #  #     #  ######   

    creaseCard(gridX: number, gridY: number, dx: number, dy: number) {
        if (!this.contains(gridX, gridY))           return
        if (!this.contains(gridX + dx, gridY + dy)) return
        
        const stack = this.faceGrid[gridX][gridY]
        if (stack.length === 0)                     return

        const topFace                       = this.topCardTopFace(gridX, gridY)
        const direction                     = Directions.getDirection(dx, dy)
        const connectionIndex               = direction - 1
        const topConnectedFace              = topFace.connections[connectionIndex]

        if (topConnectedFace === null)              return

        const bottomFace                    = this.topCardBottomFace(gridX, gridY)
        const bottomConnectedFace           = bottomFace.connections[connectionIndex]!
        const creaseDirectionBit            = Directions.Bits[direction]

        topFace.creaseBits                  |= creaseDirectionBit
        bottomFace.creaseBits               |= creaseDirectionBit

        const topConnectedFaceParity        = topConnectedFace.z % 2
        const bottomConnectedFaceParity     = bottomConnectedFace.z % 2
        const oppositeCreaseDirectionBit    = Directions.Bits[Directions.Opposite[direction]]

        topConnectedFace.creaseBits         |= topConnectedFaceParity === 1 ? oppositeCreaseDirectionBit : creaseDirectionBit
        bottomConnectedFace.creaseBits      |= bottomConnectedFaceParity === 0 ? oppositeCreaseDirectionBit : creaseDirectionBit
    }



// #######  #        #######  ######   
// #        #           #     #     #  
// #        #           #     #     #  
// ####     #           #     ######   
// #        #           #     #        
// #        #           #     #        
// #        #######  #######  #        

//  #####      #     ######   ######   
// #     #    # #    #     #  #     #  
// #         #   #   #     #  #     #  
// #        #######  ######   #     #  
// #        #     #  #   #    #     #  
// #     #  #     #  #    #   #     #  
//  #####   #     #  #     #  ######   

    flipFoldCard(gridX: number, gridY: number, dx: number, dy: number, strict: boolean = false) {
        if (!this.contains(gridX, gridY))           return
        if (!this.contains(gridX + dx, gridY + dy)) return
        
        const stack = this.faceGrid[gridX][gridY]
        if (stack.length === 0)                     return

        const flipFoldSet   = new Set<Face>()
        const topFace       = this.topCardTopFace(gridX, gridY)
        const direction     = Directions.getDirection(dx, dy)
        const directionBits = Directions.Bits[direction]
        this.populateFlipFoldSet(topFace, flipFoldSet, gridX, gridY, direction, directionBits)

        for (const face of flipFoldSet) {
            if (strict && this.tileGrid[face.x][face.y] !== null)               return

            switch (direction) {
                case Directions.East: {
                    if (face.x > gridX)                                         return

                    const reflectedX = gridX + (gridX - face.x) + 1
                    if (reflectedX > this.width() - 1)                          return
                    if (strict && this.tileGrid[reflectedX][face.y] !== null)   return
                    break
                }
                case Directions.South: {
                    if (face.y > gridY)                                         return

                    const reflectedY = gridY + (gridY - face.y) + 1
                    if (reflectedY > this.height() - 1)                         return
                    if (strict && this.tileGrid[face.x][reflectedY] !== null)   return
                    break
                }
                case Directions.West: {
                    if (face.x < gridX)                                         return

                    const reflectedX = gridX - (face.x - gridX) - 1
                    if (reflectedX < 0)                                         return
                    if (strict && this.tileGrid[reflectedX][face.y] !== null)   return
                    break
                }
                case Directions.North: {
                    if (face.y < gridY)                                         return

                    const reflectedY = gridY - (face.y - gridY) - 1
                    if (reflectedY < 0)                                         return
                    if (strict && this.tileGrid[face.x][reflectedY] !== null)   return
                    break
                }
            }
        }

        for (let i = 0; i < this.width(); i++) {
            for (let j = 0; j < this.height(); j++) {
                const faceStack = this.faceGrid[i][j]
                for (let k = faceStack.length - 1; k >= 0; k--) {
                    const face = faceStack[k]
                    if (!flipFoldSet.has(face)) break

                    faceStack.pop()
                    flipFoldSet.delete(face)

                    switch (direction) {
                        case Directions.East: {
                            const reflectedX = gridX + (gridX - i) + 1
                            face.flipX()
                            this.faceGrid[reflectedX][j].push(face)
                            break
                        }
                        case Directions.South: {
                            const reflectedY = gridY + (gridY - j) + 1
                            face.flipY()
                            this.faceGrid[i][reflectedY].push(face)
                            break
                        }
                        case Directions.West: {
                            const reflectedX = gridX - (i - gridX) - 1
                            face.flipX()
                            this.faceGrid[reflectedX][j].push(face)
                            break
                        }
                        case Directions.North: {
                            const reflectedY = gridY - (j - gridY) - 1
                            face.flipY()
                            this.faceGrid[i][reflectedY].push(face)
                            break
                        }
                    }
                }
            }
        }
        this.updateFacePositions()
        this.updateFaceConnectionBits()
    }
    populateFlipFoldSet(
        face: Face, 
        faces: Set<Face>, 
        foldGridX: number, 
        foldGridY: number, 
        direction: number, 
        directionBits: number
    ) {
        if (faces.has(face)) return

        faces.add(face)

        const pairedFace = face.z % 2 === 0 
            ? this.faceGrid[face.x][face.y][face.z + 1] 
            : this.faceGrid[face.x][face.y][face.z - 1]
        this.populateFlipFoldSet(pairedFace, faces, foldGridX, foldGridY, direction, directionBits)

        const stack = this.faceGrid[face.x][face.y]
        if (face.z < stack.length - 1) {
            const carriedFace = this.faceGrid[face.x][face.y][face.z + 1] 
            this.populateFlipFoldSet(carriedFace, faces, foldGridX, foldGridY, direction, directionBits)
        }

        for (let i = Directions.East; i <= Directions.North; i++) {
            const connectedFace = face.connections[i - 1]
            if (connectedFace === null) continue

            if (i === direction) {
                switch (direction) {
                    case Directions.East:
                    case Directions.West:
                        if (face.x === foldGridX 
                            && (face.creaseBits & directionBits) === directionBits
                        ) continue
                    break
                    case Directions.South:
                    case Directions.North:
                        if (face.y === foldGridY 
                            && (face.creaseBits & directionBits) === directionBits
                        ) continue
                    break
                }
            }

            this.populateFlipFoldSet(connectedFace, faces, foldGridX, foldGridY, direction, directionBits)
        }
    }



// ######   #######  #        #######  #######  #######  
// #     #  #        #        #           #     #        
// #     #  #        #        #           #     #        
// #     #  ####     #        ####        #     ####     
// #     #  #        #        #           #     #        
// #     #  #        #        #           #     #        
// ######   #######  #######  #######     #     #######  

//  #####      #     ######   ######   
// #     #    # #    #     #  #     #  
// #         #   #   #     #  #     #  
// #        #######  ######   #     #  
// #        #     #  #   #    #     #  
// #     #  #     #  #    #   #     #  
//  #####   #     #  #     #  ######   

    clearFaceFlags() {
        for (let i = 0; i < this.width(); i++) {
            for (let j = 0; j < this.height(); j++) {
                for (let k = 0; k < this.faceGrid[i][j].length; k++) {
                    this.faceGrid[i][j][k].flag = false
                }
            }
        }
    }
    recursiveDeleteCard(gridX: number, gridY: number) {
        if (!this.contains(gridX, gridY))               return
        if (this.faceGrid[gridX][gridY].length === 0)   return

        this.clearFaceFlags()
        this.propagateRecursiveDeleteFace(this.topCardTopFace(gridX, gridY))
        for (let i = 0; i < this.width(); i++) {
            for (let j = 0; j < this.height(); j++) {
                const stack = this.faceGrid[i][j]
                for (let k = stack.length - 1; k >= 0; k--) {
                    const face = stack[k]
                    if (face.flag) {
                        stack.splice(k, 1)
                    }
                }
            }
        }
        this.updateFacePositions()
    }
    propagateRecursiveDeleteFace(face: Face) {
        if (face.flag) return

        face.flag           = true
        const pairedIndexZ  = face.z % 2 === 0 ? face.z + 1 : face.z - 1
        const pairedFace    = this.faceGrid[face.x][face.y][pairedIndexZ]
        this.propagateRecursiveDeleteFace(pairedFace)
        for (const connectedFace of face.connections) {
            if (connectedFace === null) continue

            this.propagateRecursiveDeleteFace(connectedFace)
        }
    }



// #     #   #####   #     #  #######  
// ##   ##  #     #  #     #  #        
// # # # #  #     #  #     #  #        
// #  #  #  #     #  #     #  ####     
// #     #  #     #   #   #   #        
// #     #  #     #    # #    #        
// #     #   #####      #     #######  

// #######  #     #  #     #  #        #######  #     #   #####    #####   
//    #     ##    #  #    #   #           #     ##    #  #     #  #     #  
//    #     # #   #  #   #    #           #     # #   #  #        #        
//    #     #  #  #  ####     #           #     #  #  #  #         #####   
//    #     #   # #  #   #    #           #     #   # #  #   ###        #  
//    #     #    ##  #    #   #           #     #    ##  #     #  #     #  
// #######  #     #  #     #  #######  #######  #     #   #####    #####   

    move(direction: number) {
        const dx                = Directions.X[direction]
        const dy                = Directions.Y[direction]
        const oppositeDirection = Directions.Opposite[direction]

        this.clearFaceFlags()

        for (let i = 0; i < this.width(); i++) {
            for (let j = 0; j < this.height(); j++) {
                const faceStack = this.faceGrid[i][j]
                if (faceStack.length === 0)         continue

                const face = this.topCardTopFace(i, j)
                if (face.rule !== FaceRules.Queen)  continue
                if (face.flag)                      continue

                this.propagateMovement(i, j, dx, dy, direction, oppositeDirection)
            }
        }
    }

    propagateMovement(
        gridX: number, 
        gridY: number, 
        dx: number, 
        dy: number, 
        direction: number, 
        oppositeDirection: number
    ): boolean {
        const tile = this.tileGrid[gridX][gridY]
        if (tile !== null 
            && tile.material !== Materials.Glass)   return false

        const face = this.topCardTopFace(gridX, gridY)
        if (face.type !== FaceTypes.Front)          return false // Spiders as exception?
        if (face.rule === FaceRules.None)           return true

        const connectedFace = face.connections[direction - 1]
        if (connectedFace === null)                 return false

        const nextX     = gridX + dx
        const nextY     = gridY + dy
        if (!this.contains(nextX, nextY))           return false

        const nextFace  = this.topCardTopFace(nextX, nextY)
        if (nextFace === null)                      return false

        const oppositeConnectedFace = nextFace.connections[oppositeDirection - 1]
        if (oppositeConnectedFace === null)         return false
        
        const canMove = this.propagateMovement(nextX, nextY, dx, dy, direction, oppositeDirection)
        if (canMove) {
            nextFace.rule       = face.rule
            nextFace.color      = face.color
            nextFace.direction  = face.direction
            nextFace.flag       = true
            face.rule           = FaceRules.None
            face.color          = Colors.None
            face.direction      = Directions.None
        }

        return canMove
    }

































// #######  #     #   #####   #######  ######   #######  
//    #     ##    #  #     #  #        #     #     #     
//    #     # #   #  #        #        #     #     #     
//    #     #  #  #   #####   ####     ######      #     
//    #     #   # #        #  #        #   #       #     
//    #     #    ##  #     #  #        #    #      #     
// #######  #     #   #####   #######  #     #     #     

// #######  #######  #        #######  
//    #        #     #        #        
//    #        #     #        #        
//    #        #     #        ####     
//    #        #     #        #        
//    #        #     #        #        
//    #     #######  #######  #######  

insertTile(tile: Tile, gridX: number, gridY: number) {
    if (!this.contains(gridX, gridY)) return

    for (let i = Directions.East; i < Directions.BitsNortheast; i++) {
        this.disconnectTile(gridX, gridY, i)
    }
    this.tileGrid[gridX][gridY] = tile
}



//  #####    #####   #     #  #     #  #######   #####   #######  
// #     #  #     #  ##    #  ##    #  #        #     #     #     
// #        #     #  # #   #  # #   #  #        #           #     
// #        #     #  #  #  #  #  #  #  ####     #           #     
// #        #     #  #   # #  #   # #  #        #           #     
// #     #  #     #  #    ##  #    ##  #        #     #     #     
//  #####    #####   #     #  #     #  #######   #####      #     

// #######  #######  #        #######  
//    #        #     #        #        
//    #        #     #        #        
//    #        #     #        ####     
//    #        #     #        #        
//    #        #     #        #        
//    #     #######  #######  #######  

    validTile(gridX: number, gridY: number) {
        if (!this.contains(gridX, gridY))           return false
        if (this.tileGrid[gridX][gridY] === null)   return false
                                                    return true
    }
    canTilesConnect(tile1: Tile, tile2: Tile) {
        if (tile1.material !== tile2.material)      return false
                                                    return true
    }
    tileConnected(gridX: number, gridY: number, direction: number) {
        if (!this.validTile(gridX, gridY))          return false

        const tile  = this.tileGrid[gridX][gridY]!
        const bit   = Directions.Bits[direction]
        if ((bit & tile.connectionBits) === bit)    return true
                                                    return false
    }
    canTileConnectionToggle(gridX: number, gridY: number, direction: number) {
        if (!this.validTile(gridX, gridY))              return false

        const oppositeX     = gridX + Directions.X[direction]
        const oppositeY     = gridY + Directions.Y[direction]
        if (!this.validTile(oppositeX, oppositeY))      return false
        const tile          = this.tileGrid[gridX][gridY]!
        const oppositeTile  = this.tileGrid[oppositeX][oppositeY]!
        if (!this.canTilesConnect(tile, oppositeTile))  return false

        if (Directions.Orthogonal[direction])           return true
        if (!this.validTile(gridX, oppositeY))          return false
        if (!this.validTile(oppositeX, gridY))          return false

        const adjacentTile1 = this.tileGrid[gridX][oppositeY]!
        const adjacentTile2 = this.tileGrid[oppositeX][gridY]!
        if (!this.canTilesConnect(tile, adjacentTile1)) return false
        if (!this.canTilesConnect(tile, adjacentTile2)) return false
                                                        return true
    }
    tileConnectionToggles() {
        const tileConnectionToggles = []
        for (let i = 0; i < this.width(); i++) {
            for (let j = 0; j < this.height(); j++) {
                if (this.canTileConnectionToggle(i, j, Directions.East)) {
                    tileConnectionToggles.push(new ConnectionToggle(i, j, Directions.East))
                }
                if (this.canTileConnectionToggle(i, j, Directions.South)) {
                    tileConnectionToggles.push(new ConnectionToggle(i, j, Directions.South))
                }
                if (this.canTileConnectionToggle(i, j, Directions.Southeast)) {
                    tileConnectionToggles.push(new ConnectionToggle(i, j, Directions.Southeast))
                }
            }
        }
        return tileConnectionToggles
    }
    connectTile(gridX: number, gridY: number, direction: number) {
        if (!this.canTileConnectionToggle(gridX, gridY, direction)) return

        const tile              = this.tileGrid[gridX][gridY]!
        const bit               = Directions.Bits[direction]
        if ((tile.connectionBits & bit) === bit) return

        tile.connectionBits     |= bit
        const oppositeX         = gridX + Directions.X[direction]
        const oppositeY         = gridY + Directions.Y[direction]
        this.connectTile(oppositeX, oppositeY, Directions.Opposite[direction])
        if (Directions.Orthogonal[direction]) return

        const clockwiseDirection        = Directions.EighthClockwise[direction]
        const clockwiseX                = gridX + Directions.X[clockwiseDirection]
        const clockwiseY                = gridY + Directions.Y[clockwiseDirection]
        const counterClockwiseDirection = Directions.QuarterCounterClockwise[direction]

        this.connectTile(gridX, gridY, clockwiseDirection)
        this.connectTile(clockwiseX, clockwiseY, counterClockwiseDirection)
    }
    disconnectTile(gridX: number, gridY: number, direction: number) {
        if (!this.validTile(gridX, gridY))          return

        const tile  = this.tileGrid[gridX][gridY]!
        const bit   = Directions.Bits[direction]
        if ((bit & tile.connectionBits) !== bit)    return

        tile.connectionBits         &= ~bit
        const clockwiseDirection    = Directions.EighthClockwise[direction]
        const windingDirection      = Directions.Orthogonal[direction]
                                    ? Directions.Opposite[clockwiseDirection]
                                    : Directions.QuarterCounterClockwise[direction]
        const clockwiseX            = gridX + Directions.X[clockwiseDirection]
        const clockwiseY            = gridY + Directions.Y[clockwiseDirection]
        const oppositeX             = gridX + Directions.X[direction]
        const oppositeY             = gridY + Directions.Y[direction]

        this.disconnectTile(oppositeX, oppositeY, Directions.Opposite[direction])
        this.disconnectTile(clockwiseX, clockwiseY, windingDirection)
    }



// #     #  ######   ######      #     #######  #######  
// #     #  #     #  #     #    # #       #     #        
// #     #  #     #  #     #   #   #      #     #        
// #     #  ######   #     #  #######     #     ####     
// #     #  #        #     #  #     #     #     #        
// #     #  #        #     #  #     #     #     #        
//  #####   #        ######   #     #     #     #######  

// #######  #######  #        #######  
//    #        #     #        #        
//    #        #     #        #        
//    #        #     #        ####     
//    #        #     #        #        
//    #        #     #        #        
//    #     #######  #######  #######  

    updateTile(gridX: number, gridY: number, newTile: Tile) {
        if (!this.validTile(gridX, gridY)) return

        this.propagateTileUpdate(gridX, gridY, newTile)
        // TODO once tiles figured out
    }

    propagateTileUpdate(gridX: number, gridY: number, newTile: Tile) {
        const tile = this.tileGrid[gridX][gridY]!
        if (tile.material === newTile.material && tile.fixed === newTile.fixed) return

        tile.fixed = newTile.fixed
        tile.material = newTile.material
        for (let i = Directions.East; i <= Directions.North; i++) {
            const bit           = Directions.Bits[i]
            const connected     = (tile.connectionBits & bit) === bit
            if (!connected) continue

            const connectedX    = gridX + Directions.X[i]
            const connectedY    = gridY + Directions.Y[i]
            this.propagateTileUpdate(connectedX, connectedY, newTile)
        }
    }




// ######   #######  #        #######  #######  #######  
// #     #  #        #        #           #     #        
// #     #  #        #        #           #     #        
// #     #  ####     #        ####        #     ####     
// #     #  #        #        #           #     #        
// #     #  #        #        #           #     #        
// ######   #######  #######  #######     #     #######  


// #######  #######  #        #######  
//    #        #     #        #        
//    #        #     #        #        
//    #        #     #        ####     
//    #        #     #        #        
//    #        #     #        #        
//    #     #######  #######  #######  

    deleteTile(gridX: number, gridY: number) {
        if (!this.contains(gridX, gridY)) return

        for (let i = Directions.East; i < Directions.BitsNortheast; i++) {
            this.disconnectTile(gridX, gridY, i)
        }
        this.tileGrid[gridX][gridY] = null
    }

    recursiveDeleteTile(gridX: number, gridY: number) {
        if (!this.validTile(gridX, gridY)) return

        this.propagateTileDelete(gridX, gridY)
    }

    propagateTileDelete(gridX: number, gridY: number) {
        const tile = this.tileGrid[gridX][gridY]
        if (tile === null) return

        this.tileGrid[gridX][gridY] = null
        for (let i = Directions.East; i <= Directions.North; i++) {
            const bit           = Directions.Bits[i]
            const fastened      = (tile.fastenerBits & bit) === bit

            if (fastened) {
                tile.fastenerBits           &= ~bit
                const fastenedX             = gridX + Directions.X[i]
                const fastenedY             = gridY + Directions.Y[i]
                const fastenedTile          = this.tileGrid[fastenedX][fastenedY]
                if (fastenedTile === null) continue

                const oppositeDirection     = Directions.Opposite[i]
                const oppositeBit           = Directions.Bits[oppositeDirection]
                fastenedTile.fastenerBits   &= ~oppositeBit
                continue
            }
            const connected = (tile.connectionBits & bit) === bit
            if (!connected) continue

            const connectedX = gridX + Directions.X[i]
            const connectedY = gridY + Directions.Y[i]
            this.propagateTileDelete(connectedX, connectedY)
        }
    }



// #######     #      #####   #######  #######  #     #  
// #          # #    #     #     #     #        ##    #  
// #         #   #   #           #     #        # #   #  
// ####     #######   #####      #     ####     #  #  #  
// #        #     #        #     #     #        #   # #  
// #        #     #  #     #     #     #        #    ##  
// #        #     #   #####      #     #######  #     #  

    toggleFasteners(gridX: number, gridY: number, dx: number, dy: number) {
        if (!this.contains(gridX, gridY))                           return

        const tile = this.tileGrid[gridX][gridY]
        if (tile === null)                                          return
        
        const oppositeX = gridX + dx
        const oppositeY = gridY + dy
        if (!this.contains(oppositeX, oppositeY))                   return

        const oppositeTile = this.tileGrid[oppositeX][oppositeY]
        if (oppositeTile === null)                                  return

        const direction         = Directions.getDirection(dx, dy)
        const directionBit      = Directions.Bits[direction]
        if ((tile.connectionBits & directionBit) === directionBit)  return

        const oppositeDirection     = Directions.Opposite[direction]
        const oppositeDirectionBit  = Directions.Bits[oppositeDirection]
        tile.fastenerBits           ^= directionBit
        oppositeTile.fastenerBits   ^= oppositeDirectionBit
    }



//  #####   #        #######  ######   #######  
// #     #  #           #     #     #  #        
// #        #           #     #     #  #        
//  #####   #           #     #     #  ####     
//       #  #           #     #     #  #        
// #     #  #           #     #     #  #        
//  #####   #######  #######  ######   #######  

    clearTileFlags() {
        for (let i = 0; i < this.width(); i++) {
            for (let j = 0; j < this.height(); j++) {
                const tile = this.tileGrid[i][j]
                if (tile === null) continue

                tile.flag = false
            }
        }
    }
    attemptSlideTiles(gridX: number, gridY: number, dx: number, dy: number) {
        this.clearTileFlags()
        if (this.canTileSlide(gridX, gridY, dx, dy)) {
            this.slideTiles(gridX, gridY, dx, dy)
        }
    }
    canTileSlide(gridX: number, gridY: number, dx: number, dy: number) {
        if (!this.contains(gridX, gridY)) return false
        
        const tile = this.tileGrid[gridX][gridY]
        if (tile === null)  return true
        if (tile.fixed)     return false
        if (tile.flag)      return true

        tile.flag = true
        if (!this.canTileSlide(gridX + dx, gridY + dy, dx, dy)) return false

        for (let i = Directions.East; i <= Directions.North; i++) {
            const bit           = Directions.Bits[i]
            const connected     = (tile.connectionBits & bit) === bit
            const fastened      = (tile.fastenerBits & bit) === bit
            if (!connected && !fastened) continue

            const connectionX   = gridX + Directions.X[i]
            const connectionY   = gridY + Directions.Y[i]
            if (!this.canTileSlide(connectionX, connectionY, dx, dy)) return false
        }

        return true
    }
    slideTiles(gridX: number, gridY: number, dx: number, dy: number) {
        if (!this.contains(gridX, gridY))   return
        
        const tile = this.tileGrid[gridX][gridY]
        if (tile === null)                  return
        if (!tile.flag)                     return

        tile.flag                   = false
        const nextX                 = gridX + dx
        const nextY                 = gridY + dy
        const nextTile              = this.tileGrid[nextX][nextY]
        if (nextTile !== null) {
            this.slideTiles(nextX, nextY, dx, dy)
        }
        this.tileGrid[gridX][gridY] = null
        this.tileGrid[nextX][nextY] = tile

        for (let i = Directions.East; i <= Directions.North; i++) {
            const adjacentX         = gridX + Directions.X[i]
            const adjacentY         = gridY + Directions.Y[i]
            this.slideTiles(adjacentX, adjacentY, dx, dy)
        }
    }



















    click(gridX: number, gridY: number) {
        if (this.tileGrid[gridX][gridY] !== null)   return
        if (this.faceGrid[gridX][gridY].length > 0) return

        this.clickBase(gridX, gridY, true)
    }
    drag(gridX: number, gridY: number, dx: number, dy: number) {
        if (!this.contains(gridX, gridY)) return

        const tile = this.tileGrid[gridX][gridY]
        if (tile !== null) {
            this.attemptSlideTiles(gridX, gridY, dx, dy)
            return
        }

        this.flipFoldCard(gridX, gridY, dx, dy, true)
    }
}