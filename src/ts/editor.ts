import Camera       from './camera.js'
import Axes         from './enums/axes.js'
import BaseRules    from './enums/base_rules.js'
import BaseTypes    from './enums/base_types.js'
import FaceRules    from './enums/face_rules.js'
import Colors       from './enums/colors.js'
import Directions   from './enums/directions.js'
import Faces        from './enums/face_types.js'
import Spins        from './enums/spins.js'
import Watermarks   from './enums/watermarks.js'
import Puzzle       from './puzzle.js'
import Materials    from './enums/material.js'
import Images       from './images.js'
import Layers       from './enums/layers.js'
import Tools        from './enums/tools.js'
import Base         from './objects/base.js'
import Face         from './objects/face.js'

const ConnectionToggleRadius        = 0.125
const ConnectionToggleRadiusSquared = ConnectionToggleRadius * ConnectionToggleRadius
const Tau                           = Math.PI * 2

export default class Editor {
    public camera:                  Camera
    public canvas:                  HTMLCanvasElement
    public context:                 CanvasRenderingContext2D

    public controlGridX             = 0
    public controlGridY             = 0

    public mouseX                   = -1
    public mouseY                   = -1

    public mousePressed             = false
    public mouseDownGridX           = -1
    public mouseDownGridY           = -1
    public mouseGridX               = -1
    public mouseGridY               = -1

    public spacePressed             = false

    public puzzle                   = new Puzzle()

    constructor() {
        this.puzzle.loadDefault()

        const cameraX   = this.puzzle.width() / 2
        const cameraY   = this.puzzle.height() / 2
        this.camera     = new Camera(cameraX, cameraY)
        this.canvas     = <HTMLCanvasElement>document.getElementById('editor-canvas')
        this.context    = this.canvas.getContext('2d')!

        this.populateSelects()
        this.addEventListeners()
        
        this.resize()
        this.zoom()
        this.loop()
    }



//  #####   #######  #        #######   #####   #######   #####   
// #     #  #        #        #        #     #     #     #     #  
// #        #        #        #        #           #     #        
//  #####   ####     #        ####     #           #      #####   
//       #  #        #        #        #           #           #  
// #     #  #        #        #        #     #     #     #     #  
//  #####   #######  #######  #######   #####      #      #####   

    populateSelects() {
        this.populateCustomSelect('base-tool-select', Tools.BaseTools, Tools.Names)
        this.populateCustomSelect('card-tool-select', Tools.CardTools, Tools.Names)
        this.populateCustomSelect('tile-tool-select', Tools.TileTools, Tools.Names)

        this.populateSelect('layer-select',                 Layers.Names)

        this.populateSelect('base-type-select',             BaseTypes.Names)
        this.populateSelect('base-rule-select',             BaseRules.Names)
        this.populateSelect('base-color-select',            Colors.Names)
        this.populateSelect('base-spin-select',             Spins.Names)
        this.populateSelect('base-axis-select',             Axes.Names)
        this.populateSelect('base-direction-select',        Directions.Names)

        this.populateIntegerSelect('base-count-select',     7)
        this.populateIntegerSelect('base-power-select',     3)

        this.populateSelect('top-face-type-select',         Faces.Names)
        this.populateSelect('top-face-watermark-select',    Watermarks.Names)
        this.populateSelect('top-face-rule-select',         FaceRules.Names)
        this.populateSelect('top-face-color-select',        Colors.Names)
        this.populateSelect('top-face-direction-select',    Directions.Names)
        
        this.populateSelect('bottom-face-type-select',      Faces.Names)
        this.populateSelect('bottom-face-watermark-select', Watermarks.Names)
        this.populateSelect('bottom-face-rule-select',      FaceRules.Names)
        this.populateSelect('bottom-face-color-select',     Colors.Names)
        this.populateSelect('bottom-face-direction-select', Directions.Names)

        this.populateSelect('tile-material-select',         Materials.Names)
        this.populateSelect('tile-direction-select',        Directions.Names)
        this.populateSelect('tile-spin-select',             Spins.Names)

        this.populateIntegerSelect('tile-count-select',     4)
    }

    populateSelect(selectId: string, names: string[]) {
        const select = this.getSelect(selectId)
        for (let i = 0; i < names.length; i++) {
            const option        = document.createElement('option')
            option.value        = i + ''
            option.innerText    = names[i]
            select.appendChild(option)
        }
    }
    populateCustomSelect(selectId: string, indices: number[], names: string[]) {
        const select = this.getSelect(selectId)
        for (const index of indices) {
            const option        = document.createElement('option')
            option.value        = index + ''
            option.innerText    = names[index]
            select.appendChild(option)
        }
    }
    populateIntegerSelect(selectId: string, count: number) {
        const select = this.getSelect(selectId)
        for (let i = 0; i <= count; i++) {
            const option        = document.createElement('option')
            const value         = i + ''
            option.value        = value
            option.innerText    = value
            select.appendChild(option)
        }
    }
    getSelect(selectId: string) { return document.getElementById(selectId) as HTMLSelectElement }
    getInput(inputUId: string) { return document.getElementById(inputUId) as HTMLInputElement }
    setIntegerSelectValue(selectId: string, type: number) { this.getSelect(selectId).value = type + '' }
    getIntegerSelectValue(selectId: string) { return Number.parseInt(this.getSelect(selectId).value) }
    getCheckboxChecked(checkboxId: string) { return this.getInput(checkboxId).checked }



// #######  #     #  #######  #     #  #######   #####   
// #        #     #  #        ##    #     #     #     #  
// #        #     #  #        # #   #     #     #        
// ####     #     #  ####     #  #  #     #      #####   
// #         #   #   #        #   # #     #           #  
// #          # #    #        #    ##     #     #     #  
// #######     #     #######  #     #     #      #####   

    addEventListeners() {
        window.addEventListener('resize',       () =>   { this.resize()         })
        window.addEventListener('contextmenu',  e =>    { this.contextMenu(e)   })
        window.addEventListener('keydown',      e =>    { this.keyDown(e)       })
        window.addEventListener('keyup',        e =>    { this.keyUp(e)         })

        this.canvas.addEventListener('mousedown',   e =>    { this.mouseDown(e)     })
        this.canvas.addEventListener('mousemove',   e =>    { this.mouseMove(e)     })
        this.canvas.addEventListener('mouseup',     e =>    { this.mouseUp(e)       })
        this.canvas.addEventListener('mouseleave',  () =>   { this.mouseLeave()     })
        this.canvas.addEventListener('wheel',       e =>    { this.mouseWheel(e)    })

        document.getElementById('grow-east')!.addEventListener('mousedown',     () => { this.growEast()     })
        document.getElementById('grow-south')!.addEventListener('mousedown',    () => { this.growSouth()    })
        document.getElementById('grow-west')!.addEventListener('mousedown',     () => { this.growWest()     })
        document.getElementById('grow-north')!.addEventListener('mousedown',    () => { this.growNorth()    })

        document.getElementById('shrink-east')!.addEventListener('mousedown',   () => { this.shrinkEast()   })
        document.getElementById('shrink-south')!.addEventListener('mousedown',  () => { this.shrinkSouth()  })
        document.getElementById('shrink-west')!.addEventListener('mousedown',   () => { this.shrinkWest()   })
        document.getElementById('shrink-north')!.addEventListener('mousedown',  () => { this.shrinkNorth()  })

        document.getElementById('zoom-button')!.addEventListener('mousedown',   () => { this.zoom()         })

        const baseInputs = document.getElementsByClassName('base-input')
        for (const baseInput of baseInputs) {
            baseInput.addEventListener('change', () => { this.baseChanged() })
        }

        const faceInputs = document.getElementsByClassName('face-input')
        for (const faceInput of faceInputs) {
            faceInput.addEventListener('change', () => { this.cardChanged() })
        }
    }



//  #####   ######    #####   #     #  
// #     #  #     #  #     #  #     #  
// #        #     #  #     #  #     #  
// #        ######   #     #  #  #  #  
// #   ###  #   #    #     #  # # # #  
// #     #  #    #   #     #  ##   ##  
//  #####   #     #   #####   #     #  

    growEast() {
        this.puzzle.growEast()
    }
    growSouth() {
        this.puzzle.growSouth()
    }
    growWest() {
        this.puzzle.growWest()
        this.camera.shiftX(1)
        this.controlGridX++
    }
    growNorth() {
        this.puzzle.growNorth()
        this.camera.shiftY(1)
        this.controlGridY++
    }



//  #####   #     #  ######   #######  #     #  #     #  
// #     #  #     #  #     #     #     ##    #  #    #   
// #        #     #  #     #     #     # #   #  #   #    
//  #####   #######  ######      #     #  #  #  ####     
//       #  #     #  #   #       #     #   # #  #   #    
// #     #  #     #  #    #      #     #    ##  #    #   
//  #####   #     #  #     #  #######  #     #  #     #  

// TODO: Load data into selects on control move

    shrinkEast() {
        if (!this.puzzle.shrinkEast()) return

        if (this.controlGridX > this.puzzle.width() - 1) {
            this.controlGridX--
            this.selectBase(this.controlGridX, this.controlGridY)
            this.selectCard(this.controlGridX, this.controlGridY)
        }
    }
    shrinkSouth() {
        if (!this.puzzle.shrinkSouth()) return

        if (this.controlGridY > this.puzzle.height() - 1) {
            this.controlGridY--
            this.selectBase(this.controlGridX, this.controlGridY)
            this.selectCard(this.controlGridX, this.controlGridY)
        }
    }
    shrinkWest() {
        if (!this.puzzle.shrinkWest()) return

        this.camera.shiftX(-1)
        this.controlGridX--
        if (this.controlGridX < 0) {
            this.controlGridX = 0
            this.selectBase(this.controlGridX, this.controlGridY)
            this.selectCard(this.controlGridX, this.controlGridY)
        }
    }
    shrinkNorth() {
        if (!this.puzzle.shrinkNorth()) return

        this.camera.shiftY(-1)
        this.controlGridY--
        if (this.controlGridY < 0) {
            this.controlGridY = 0
            this.selectBase(this.controlGridX, this.controlGridY)
            this.selectCard(this.controlGridX, this.controlGridY)
        }
    }



// #######   #####    #####   #         #####   
//    #     #     #  #     #  #        #     #  
//    #     #     #  #     #  #        #        
//    #     #     #  #     #  #         #####   
//    #     #     #  #     #  #              #  
//    #     #     #  #     #  #        #     #  
//    #      #####    #####   #######   #####   

    numericSelectValue(selectId: string) {
        return Number.parseInt((document.getElementById(selectId) as HTMLSelectElement).value)
    }
    layer() {
        return this.numericSelectValue('layer-select')
    }
    tool() {
        let selectId = ''
        switch (this.layer()) {
            case Layers.Base: 
                selectId = 'base-tool-select'
            break
            case Layers.Card: 
                selectId = 'card-tool-select'
            break
            case Layers.Tile: 
                selectId = 'tile-tool-select'
            break
        }
        return this.numericSelectValue(selectId)
    }


// ######      #      #####   #######  
// #     #    # #    #     #  #        
// #     #   #   #   #        #        
// ######   #######   #####   ####     
// #     #  #     #        #  #        
// #     #  #     #  #     #  #        
// ######   #     #   #####   #######  

    base(connections: number = Directions.BitsNone) {
        const type      = this.getIntegerSelectValue('base-type-select')
        const rule      = this.getIntegerSelectValue('base-rule-select')
        const color     = this.getIntegerSelectValue('base-color-select')
        const count     = this.getIntegerSelectValue('base-count-select')
        const axis      = this.getIntegerSelectValue('base-axis-select')
        const direction = this.getIntegerSelectValue('base-direction-select')
        const spin      = this.getIntegerSelectValue('base-spin-select')
        const power     = this.getIntegerSelectValue('base-power-select')
        const shape     = this.baseShape()
        const fixed     = this.getCheckboxChecked('base-fixed-checkbox')
        const visible   = this.getCheckboxChecked('base-visible-checkbox')

        return new Base(type, rule, color, count, axis, direction, shape, spin, connections, power, fixed, visible)
    }
    baseShape() {
        let shape = 0
        const checkboxes = document.getElementById('base-shape-grid')!.children
        for (let i = 0; i < checkboxes.length; i++) {
            const checkbox = checkboxes[i] as HTMLInputElement
            if (!checkbox.checked) continue

            shape |= 1 << i
        }
        return shape
    }

    createSingleBase(gridX: number, gridY: number) {
        const base = this.base()
        this.puzzle.insertSingleBase(base, gridX, gridY)
    }

    selectBase(gridX: number, gridY: number) {
        const base = this.puzzle.baseGrid[gridX][gridY]

        this.getSelect('base-type-select').value        = base.type + ''
        this.getSelect('base-rule-select').value        = base.rule + ''
        this.getSelect('base-color-select').value       = base.color + ''
        this.getSelect('base-count-select').value       = base.count + ''
        this.getSelect('base-axis-select').value        = base.axis + ''
        this.getSelect('base-direction-select').value   = base.direction + ''
        this.getSelect('base-spin-select').value        = base.spin + ''
        this.getSelect('base-power-select').value       = base.power + ''
        this.getInput('base-fixed-checkbox').checked    = base.fixed
        this.getInput('base-visible-checkbox').checked  = base.visible

        const checkboxes = document.getElementById('base-shape-grid')!.children
        for (let i = 0; i < checkboxes.length; i++) {
            const checkbox = checkboxes[i] as HTMLInputElement
            const flag = (1 << i)
            checkbox.checked = (flag & base.shape) === flag
        }
    }

    baseChanged() {
        if (this.layer() === Layers.Base && this.tool() === Tools.Edit) {
            const base      = this.puzzle.baseGrid[this.controlGridX][this.controlGridY]
            const newBase   = this.base(base.connections)
            this.puzzle.updateBase(this.controlGridX, this.controlGridY, newBase)
        }
    }



//  #####      #     ######   ######   
// #     #    # #    #     #  #     #  
// #         #   #   #     #  #     #  
// #        #######  ######   #     #  
// #        #     #  #   #    #     #  
// #     #  #     #  #    #   #     #  
//  #####   #     #  #     #  ######   

    // To connect cards, have cards numbered top to bottom, left to right
    // Specify the set of connections to make
    // A connection is denoted as A, B, cardinal direction
    // Save connections for all cards being modified
    // Make changes to connections, and test validity
    // If not valid, revert
    // A connection is invalid if
    //  - It connects to a face with a different side or material
    //  - It results in connections different from those of its opposing face
    //  - It causes cards to intersect
    //      A card intersection occurs when
    //      - In the case of a flat connection
    //          An existing connection is neither above or below the connection
    //      - In the case of a fold connection
    //          An existing connection is neither inside or outside the connection


    topFace() {
        const type      = this.getIntegerSelectValue('top-face-type-select')
        const watermark = this.getIntegerSelectValue('top-face-watermark-select')
        const rule      = this.getIntegerSelectValue('top-face-rule-select')
        const color     = this.getIntegerSelectValue('top-face-color-select')
        const direction = this.getIntegerSelectValue('top-face-direction-select')
        return new Face(type, watermark, rule, color, direction)
    }
    bottomFace() {
        const type      = this.getIntegerSelectValue('bottom-face-type-select')
        const watermark = this.getIntegerSelectValue('bottom-face-watermark-select')
        const rule      = this.getIntegerSelectValue('bottom-face-rule-select')
        const color     = this.getIntegerSelectValue('bottom-face-color-select')
        const direction = this.getIntegerSelectValue('bottom-face-direction-select')
        return new Face(type, watermark, rule, color, direction)
    }

    createSingleCard(gridX: number, gridY: number) {
        const bottomFace    = this.bottomFace()
        const topFace       = this.topFace()
        this.puzzle.insertSingleFace(bottomFace, gridX, gridY)
        this.puzzle.insertSingleFace(topFace, gridX, gridY)
    }

    selectCard(gridX: number, gridY: number) {
        if (this.puzzle.faceGrid[gridX][gridY].length === 0) {
            this.getSelect('top-face-type-select').value            = Faces.Front + ''
            this.getSelect('top-face-watermark-select').value       = Watermarks.None + ''
            this.getSelect('top-face-rule-select').value            = FaceRules.None + ''
            this.getSelect('top-face-color-select').value           = Colors.None + ''
            this.getSelect('top-face-direction-select').value       = Directions.None + ''
    
            this.getSelect('bottom-face-type-select').value         = Faces.Front + ''
            this.getSelect('bottom-face-watermark-select').value    = Watermarks.None + ''
            this.getSelect('bottom-face-rule-select').value         = FaceRules.None + ''
            this.getSelect('bottom-face-color-select').value        = Colors.None + ''
            this.getSelect('bottom-face-direction-select').value    = Directions.None + ''

            return
        }
        const faceStack     = this.puzzle.faceGrid[gridX][gridY]
        const stackHeight   = faceStack.length
        const topFace       = faceStack[stackHeight - 1]
        const bottomFace    = faceStack[stackHeight - 2]

        this.getSelect('top-face-type-select').value            = topFace.type + ''
        this.getSelect('top-face-watermark-select').value       = topFace.watermark + ''
        this.getSelect('top-face-rule-select').value            = topFace.rule + ''
        this.getSelect('top-face-color-select').value           = topFace.color + ''
        this.getSelect('top-face-direction-select').value       = topFace.direction + ''

        this.getSelect('bottom-face-type-select').value         = bottomFace.type + ''
        this.getSelect('bottom-face-watermark-select').value    = bottomFace.watermark + ''
        this.getSelect('bottom-face-rule-select').value         = bottomFace.rule + ''
        this.getSelect('bottom-face-color-select').value        = bottomFace.color + ''
        this.getSelect('bottom-face-direction-select').value    = bottomFace.direction + ''
    }

    cardChanged() {
        if (this.layer() === Layers.Card && this.tool() === Tools.Edit) {
            const faceStack     = this.puzzle.faceGrid[this.controlGridX][this.controlGridY]
            const stackHeight   = faceStack.length
            if (stackHeight === 0) return

            // const zTop          = stackHeight - 1
            // const zBottom       = stackHeight - 2
            // const topFace       = this.topFace(this.controlGridX, this.controlGridY, faceStack[zTop].connections, faceStack[zTop].creases)
            // const bottomFace    = this.bottomFace(this.controlGridX, this.controlGridY, faceStack[zBottom].connections, faceStack[zBottom].creases)

            // this.puzzle.updateFace(this.controlGridX, this.controlGridY, zTop, topFace)
            // this.puzzle.updateFace(this.controlGridX, this.controlGridY, zBottom, bottomFace)
        }
    }




//  #####    #####   #     #  #     #  #######   #####   #######  
// #     #  #     #  ##    #  ##    #  #        #     #     #     
// #        #     #  # #   #  # #   #  #        #           #     
// #        #     #  #  #  #  #  #  #  ####     #           #     
// #        #     #  #   # #  #   # #  #        #           #     
// #     #  #     #  #    ##  #    ##  #        #     #     #     
//  #####    #####   #     #  #     #  #######   #####      #     

    connectGridX(puzzleX: number)   { return Math.floor(puzzleX - 0.5 + ConnectionToggleRadius) }
    connectGridY(puzzleY: number)   { return Math.floor(puzzleY - 0.5 + ConnectionToggleRadius) }

    distanceSquared(x1: number, y1: number, x2: number, y2: number) {
        const dx = x2 - x1
        const dy = y2 - y1
        return dx * dx + dy * dy
    }

    connectDirection(puzzleX: number, puzzleY: number, gridX: number, gridY: number) {
        const centerX   = gridX + 0.5
        const centerY   = gridY + 0.5
        const outerX    = gridX + 1
        const outerY    = gridY + 1

        if (this.distanceSquared(outerX, centerY, puzzleX, puzzleY) < ConnectionToggleRadiusSquared) {
            return Directions.East
        } else if (this.distanceSquared(centerX, outerY, puzzleX, puzzleY) < ConnectionToggleRadiusSquared) {
            return Directions.South
        } else if (this.distanceSquared(outerX, outerY, puzzleX, puzzleY) < ConnectionToggleRadiusSquared) {
            return Directions.Southeast
        }
        return Directions.None
    }

    editBaseConnection(connect: boolean) {
        const puzzleX   = this.camera.puzzleX(this.mouseX, this.canvas.width)
        const puzzleY   = this.camera.puzzleY(this.mouseY, this.canvas.height)
        const gridX     = this.connectGridX(puzzleX)
        const gridY     = this.connectGridY(puzzleY)
        const direction = this.connectDirection(puzzleX, puzzleY, gridX, gridY)
        if (direction === Directions.None) return

        switch (direction) {
            case Directions.East:
                if (!this.puzzle.canBaseConnectEast(gridX, gridY)) break

                if (connect) {
                    this.puzzle.connectBaseEast(gridX, gridY)
                } else {
                    this.puzzle.disconnectBaseEast(gridX, gridY)
                }
                
            break
            case Directions.South:
                if (!this.puzzle.canBaseConnectSouth(gridX, gridY)) break

                if (connect) {
                    this.puzzle.connectBaseSouth(gridX, gridY)
                } else {
                    this.puzzle.disconnectBaseSouth(gridX, gridY)
                }
            break
            case Directions.Southeast:
                if (!this.puzzle.canBaseConnectSoutheast(gridX, gridY)) break

                if (connect) {
                    this.puzzle.connectBaseSoutheast(gridX, gridY)
                } else {
                    this.puzzle.disconnectBaseSoutheast(gridX, gridY)
                }
            break
        }
    }

    // editCardConnection(connect: boolean) {
    //     const puzzleX   = this.camera.puzzleX(this.mouseX, this.canvas.width)
    //     const puzzleY   = this.camera.puzzleY(this.mouseY, this.canvas.height)
    //     const gridX     = this.connectGridX(puzzleX)
    //     const gridY     = this.connectGridY(puzzleY)
    //     const direction = this.connectDirection(puzzleX, puzzleY, gridX, gridY)
    //     if (direction === Directions.None) return

    //     switch (direction) {
    //         case Directions.East:
    //             if (!this.puzzle.canCardConnect(gridX, gridY, 1, 0)) break

    //             if (connect) {
    //                 this.puzzle.connectCardEast(gridX, gridY)
    //             } else {
    //                 this.puzzle.disconnectCardEast(gridX, gridY)
    //             }
                
    //         break
    //         case Directions.South:
    //             if (!this.puzzle.canCardConnect(gridX, gridY, 0, 1)) break

    //             if (connect) {
    //                 this.puzzle.connectCardSouth(gridX, gridY)
    //             } else {
    //                 this.puzzle.disconnectCardSouth(gridX, gridY)
    //             }
    //         break
    //     }
    // }



// #     #   #####   #     #   #####   #######  
// ##   ##  #     #  #     #  #     #  #        
// # # # #  #     #  #     #  #        #        
// #  #  #  #     #  #     #   #####   ####     
// #     #  #     #  #     #        #  #        
// #     #  #     #  #     #  #     #  #        
// #     #   #####    #####    #####   #######  

    contextMenu(e: MouseEvent) {
        e.stopPropagation()
        e.preventDefault()
    }
    mouseDown(e: MouseEvent) {
        if (e.button !== 0) return

        this.mousePressed   = true
        this.mouseDownGridX = this.camera.gridX(e.offsetX, this.canvas.width)
        this.mouseDownGridY = this.camera.gridY(e.offsetY, this.canvas.height)

        if (!this.puzzle.contains(this.mouseDownGridX, this.mouseDownGridY)) return

        this.controlGridX = this.mouseDownGridX
        this.controlGridY = this.mouseDownGridY

        switch (this.layer()) {
            case Layers.Base: {
                switch (this.tool()) {
                    case Tools.Create:
                        this.createSingleBase(this.controlGridX, this.controlGridY)
                    break
                    case Tools.Edit:
                    break
                    case Tools.Connect:
                        this.editBaseConnection(true)
                    break
                    case Tools.Disconnect:
                        this.editBaseConnection(false)
                    break
                }
                break
            }
            case Layers.Card: {
                switch (this.tool()) {
                    case Tools.Create:
                        this.createSingleCard(this.controlGridX, this.controlGridY)
                    break
                    case Tools.RecursiveDelete:
                        this.puzzle.recursiveDelete(this.controlGridX, this.controlGridY)
                    break
                }
                break
            }
            case Layers.Tile: {

                break
            }
        }

        // update selected cell
        this.selectBase(this.controlGridX, this.controlGridY)
        this.selectCard(this.controlGridX, this.controlGridY)
    }
    mouseMove(e: MouseEvent) {
        if (this.mousePressed) {
            if (this.spacePressed) {
                const dx = e.offsetX - this.mouseX
                const dy = e.offsetY - this.mouseY
                this.camera.pan(dx, dy)
            } else {
                this.mouseDrag(e)
            }
        }

        this.mouseX = e.offsetX
        this.mouseY = e.offsetY
    }
    mouseDrag(e: MouseEvent) {
        const newControlGridX = this.camera.gridX(e.offsetX, this.canvas.width)
        const newControlGridY = this.camera.gridY(e.offsetY, this.canvas.height)

        if (!this.puzzle.contains(newControlGridX, newControlGridY)) return
        
        const dx = newControlGridX - this.controlGridX
        const dy = newControlGridY - this.controlGridY
        if (Math.abs(dx) + Math.abs(dy) !== 1) return

        switch (this.layer()) {
            case Layers.Base: {
                switch (this.tool()) {
                    case Tools.Create:
                        this.createSingleBase(newControlGridX, newControlGridY)
                    break
                }
                break
            }
            case Layers.Card: {
                switch (this.tool()) {
                    case Tools.Create:
                        this.createSingleCard(newControlGridX, newControlGridY)
                    break
                    case Tools.Delete:
                        
                    break
                    case Tools.Reverse:
                        
                    break
                    case Tools.Connect:
                        this.puzzle.connectCard(this.controlGridX, this.controlGridY, dx, dy)
                    break
                    case Tools.Disconnect:
                        
                    break
                    case Tools.Crease:
                        this.puzzle.creaseCard(this.controlGridX, this.controlGridY, dx, dy)
                    break
                    case Tools.FlipFold:
                        this.puzzle.flipFoldCard(this.controlGridX, this.controlGridY, dx, dy)
                    break
                }
                break
            }
            case Layers.Tile: {

                break
            }
        }

        this.controlGridX = newControlGridX
        this.controlGridY = newControlGridY

        this.selectBase(this.controlGridX, this.controlGridY)
        this.selectCard(this.controlGridX, this.controlGridY)
    }

    mouseWheel(e: WheelEvent) {
        if (e.deltaY > 0) {
            this.camera.zoomOut(
                this.mouseX, 
                this.mouseY,
                this.canvas.width,
                this.canvas.height
            )
        } else {
            this.camera.zoomIn(
                this.mouseX, 
                this.mouseY,
                this.canvas.width,
                this.canvas.height
            )
        }
    }
    mouseUp(e: MouseEvent) {
        if (e.button !== 0) return

        this.mousePressed   = false
        this.mouseDownGridX = -1
        this.mouseDownGridY = -1
        this.mouseGridX     = -1
        this.mouseGridY     = -1
    }
    mouseLeave() {
        this.mousePressed   = false
        this.mouseDownGridX = -1
        this.mouseDownGridY = -1
        this.mouseGridX     = -1
        this.mouseGridY     = -1
    }



// #     #  #######  #     #   #####   
// #    #   #         #   #   #     #  
// #   #    #          # #    #        
// ####     ####        #      #####   
// #   #    #           #           #  
// #    #   #           #     #     #  
// #     #  #######     #      #####   

    keyDown(e: KeyboardEvent) {
        switch (e.code) {
            case 'Space': {
                this.spacePressed = true
                break
            }
        }
    }
    keyUp(e: KeyboardEvent) {
        switch (e.code) {
            case 'Space': {
                this.spacePressed = false
                break
            }
        }
    }









































// ######   #######  #     #  ######   #######  ######   
// #     #  #        ##    #  #     #  #        #     #  
// #     #  #        # #   #  #     #  #        #     #  
// ######   ####     #  #  #  #     #  ####     ######   
// #   #    #        #   # #  #     #  #        #   #    
// #    #   #        #    ##  #     #  #        #    #   
// #     #  #######  #     #  ######   #######  #     #  

    zoom() {
        this.camera.autoZoom(this.puzzle.width(), this.puzzle.height(), this.canvas.width, this.canvas.height)
    }

    resize() {
        const canvasBounds  = this.canvas.getBoundingClientRect()
        this.canvas.width   = canvasBounds.width
        this.canvas.height  = canvasBounds.height
    }

    loop() {
        this.render()
        requestAnimationFrame(() => { this.loop() })
    }

    render() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.context.imageSmoothingEnabled = false

        const gameCanvas    = document.createElement('canvas')
        gameCanvas.width    = Images.CellSizePixels * this.puzzle.width()
        gameCanvas.height   = Images.CellSizePixels * this.puzzle.height()
        const gameContext   = gameCanvas.getContext('2d')!
        if (this.getInput('base-layer-visible').checked) {
            this.renderBases(gameContext)
        }
        if (this.getInput('card-layer-visible').checked) {
            this.renderCardShadows(gameContext)
            this.renderFaces(gameContext)
        }

        this.renderGame(gameCanvas)
        this.renderGrid()
        this.renderInfo()
        switch (this.layer()) {
            case Layers.Base:
                switch (this.tool()) {
                    case Tools.Connect:
                        this.renderBaseConnectionToggles()
                    break
                    case Tools.Disconnect:
                        this.renderBaseConnectionToggles()
                    break
                }
            break
            case Layers.Card:
                switch (this.tool()) {
                    case Tools.Connect:
                        // this.renderCardConnectionToggles()
                    break
                    case Tools.Disconnect:
                        // this.renderCardConnectionToggles()
                    break
                }
            break
            case Layers.Tile:

            break
        }

        this.renderHover()
        this.renderControlSelection()
    }
    renderGame(gameCanvas: HTMLCanvasElement) {
        const xEast     = this.camera.canvasX(this.puzzle.width(), this.canvas.width)
        const xWest     = this.camera.canvasX(0, this.canvas.width)
        const ySouth    = this.camera.canvasY(this.puzzle.height(), this.canvas.height)
        const yNorth    = this.camera.canvasY(0, this.canvas.height)
        const width     = xEast - xWest
        const height    = ySouth - yNorth
        this.context.drawImage(gameCanvas, xWest, yNorth, width, height)
    }
    
    renderGrid() {
        const xEast     = this.camera.canvasX(this.puzzle.width(), this.canvas.width)
        const xWest     = this.camera.canvasX(0, this.canvas.width)
        const ySouth    = this.camera.canvasY(this.puzzle.height(), this.canvas.height)
        const yNorth    = this.camera.canvasY(0, this.canvas.height)

        this.context.beginPath()
        for (let i = 0; i <= this.puzzle.width(); i++) {
            const canvasX = this.camera.canvasX(i, this.canvas.width)
            this.context.moveTo(canvasX, yNorth)
            this.context.lineTo(canvasX, ySouth)
        }
        for (let i = 0; i <= this.puzzle.height(); i++) {
            const canvasY = this.camera.canvasY(i, this.canvas.height)
            this.context.moveTo(xEast, canvasY)
            this.context.lineTo(xWest, canvasY)
        }
        this.context.lineWidth = 2
        this.context.strokeStyle = '#0004'
        this.context.stroke()
    }
    renderInfo() {
        const x = this.camera.gridX(this.mouseX, this.canvas.width)
        if (!this.puzzle.containsX(x)) return

        const y = this.camera.gridY(this.mouseY, this.canvas.height)
        if (!this.puzzle.containsY(y)) return

        this.context.font       = '16px sans-serif'
        this.context.fillStyle  = '#444'
        this.context.fillText(`(${x}, ${y})`, 5, this.canvas.height - 7)
    }
    renderHover() {
        const x = this.camera.gridX(this.mouseX, this.canvas.width)
        if (!this.puzzle.containsX(x)) return

        const y = this.camera.gridY(this.mouseY, this.canvas.height)
        if (!this.puzzle.containsY(y)) return

        const canvasX = this.camera.canvasX(x, this.canvas.width)
        const canvasY = this.camera.canvasY(y, this.canvas.height)

        this.context.lineWidth = 2
        this.context.strokeStyle = '#fff6'
        this.context.strokeRect(canvasX, canvasY, this.camera.scale, this.camera.scale)
    }
    renderControlSelection() {
        const canvasX = this.camera.canvasX(this.controlGridX, this.canvas.width)
        const canvasY = this.camera.canvasY(this.controlGridY, this.canvas.height)
        
        this.context.lineWidth = 3
        this.context.strokeStyle = 'white'
        this.context.strokeRect(canvasX, canvasY, this.camera.scale, this.camera.scale)
    }

    renderBases(gameContext: CanvasRenderingContext2D) {
        for (let i = 0; i < this.puzzle.width(); i++) {
            const x = i * Images.CellSizePixels
            for (let j = 0; j < this.puzzle.height(); j++) {
                const y = j * Images.CellSizePixels
                const base = this.puzzle.baseGrid[i][j]
                this.renderBase(base, gameContext, x, y)

                // this.context.fillText(base.connections.toString(2).padStart(8, '0'), x + 5, y + 20)
            }
        }
    }

    renderBase(base: Base, gameContext: CanvasRenderingContext2D, x: number, y: number) {
        this.renderBaseType(base, gameContext, x, y)
        this.renderBaseRule(base, gameContext, x, y)
        this.renderBaseScrews(base, gameContext, x, y)
    }


    renderBaseType(base: Base, gameContext: CanvasRenderingContext2D, x: number, y: number) {
        this.renderBaseBacking(base, gameContext, x, y)
        const opacity           = base.type === BaseTypes.Plain ? 1.0 : 0.5
        gameContext.globalAlpha = opacity
        gameContext.drawImage(
            Images.Tilesets, 
            Images.OffsetMap[base.connections] * Images.CellSizePixels, 
            BaseTypes.TilesetOffset[base.type] * Images.CellSizePixels, 
            Images.CellSizePixels,
            Images.CellSizePixels,
            x, 
            y, 
            Images.CellSizePixels,
            Images.CellSizePixels,
        )
    }

    renderBaseBacking(base: Base, gameContext: CanvasRenderingContext2D, x: number, y: number) {
        if (base.type === BaseTypes.Plain) return

        gameContext.globalAlpha = base.power / base.type
        gameContext.drawImage(
            Images.Tilesets, 
            Images.OffsetMap[base.connections] * Images.CellSizePixels, 
            Images.OffsetTemplateBaseBacking * Images.CellSizePixels, 
            Images.CellSizePixels,
            Images.CellSizePixels,
            x, 
            y, 
            Images.CellSizePixels,
            Images.CellSizePixels,
        )
    }

    renderBaseRule(base: Base, gameContext: CanvasRenderingContext2D, x: number, y: number) {
        let offset = BaseRules.Offsets[base.rule]
        switch (base.rule) {
            case BaseRules.Area:
            case BaseRules.Groups:
            case BaseRules.Neighbors:
            case BaseRules.Orthogonal:
            case BaseRules.Order:
            case BaseRules.Relative:
            case BaseRules.Rules:
            case BaseRules.States:
                offset += (base.count - 1)
            break
            case BaseRules.Adjacent:
                offset += base.count
            break
            case BaseRules.Symmetric:
                offset += (base.axis - 1)
            break
            case BaseRules.Length:
                offset += (base.count - 1) + (base.axis - 1) * 5
            break
        }
        gameContext.globalAlpha = 0.75
        gameContext.drawImage(
            Images.Icons, 
            offset * Images.CellSizePixels, 
            (base.color - 1) * Images.CellSizePixels, 
            Images.CellSizePixels,
            Images.CellSizePixels,
            x, 
            y, 
            Images.CellSizePixels,
            Images.CellSizePixels,
        )
    }


    renderBaseScrews(base: Base, gameContext: CanvasRenderingContext2D, x: number, y: number) {
        gameContext.globalAlpha = 1
        if (base.type !== BaseTypes.Plain && base.fixed) {
            gameContext.drawImage(
                Images.Tilesets, 
                Images.OffsetMap[base.connections] * Images.CellSizePixels, 
                Images.OffsetTemplateScrews * Images.CellSizePixels, 
                Images.CellSizePixels,
                Images.CellSizePixels,
                x, 
                y, 
                Images.CellSizePixels,
                Images.CellSizePixels,
            )
        }
    }

    renderBaseConnectionToggles() {
        const potentialBaseConnections  = this.puzzle.potentialBaseConnections()
        const radius                    = this.camera.scale * ConnectionToggleRadius
        this.context.beginPath()
        for (const connection of potentialBaseConnections) {
            const vector = Directions.Vectors[connection.direction]
            const x = this.camera.canvasX(connection.gridX + 0.5 * (1 + vector.dx), this.canvas.width)
            const y = this.camera.canvasY(connection.gridY + 0.5 * (1 + vector.dy), this.canvas.height)

            this.context.moveTo(x, y)
            this.context.arc(x, y, radius, 0, Tau)
        }
        this.context.fillStyle = '#ffffff20'
        this.context.fill()
    }

    renderFaces(gameContext: CanvasRenderingContext2D) {
        for (let i = 0; i < this.puzzle.width(); i++) {
            const x = i * Images.CellSizePixels
            for (let j = 0; j < this.puzzle.height(); j++) {
                const y = j * Images.CellSizePixels
                const stack = this.puzzle.faceGrid[i][j]
                for (let k = 0; k < stack.length; k++) {
                    const face = stack[k]
                    this.renderFace(face, gameContext, x, y)
                }
            }
        }
    }
    renderFace(face: Face, gameContext: CanvasRenderingContext2D, x: number, y: number) {
        this.renderCardstock(face, gameContext, x, y)
        this.renderWatermark(face, gameContext, x, y)
        this.renderFaceRule(face, gameContext, x, y)
        this.renderCreases(face, gameContext, x, y)
        this.renderFaceBorder(face, gameContext, x, y)
    }

    renderCardShadows(gameContext: CanvasRenderingContext2D) {
        const offset = (Images.CardShadowSizePixels - Images.CellSizePixels) / 2
        for (let i = 0; i < this.puzzle.width(); i++) {
            const x = i * Images.CellSizePixels - offset
            for (let j = 0; j < this.puzzle.height(); j++) {
                const y = j * Images.CellSizePixels - offset
                const stack = this.puzzle.faceGrid[i][j]
                for (let k = 0; k < stack.length; k++) {
                    const face = stack[k]
                    this.renderCardShadow(face, gameContext, x, y)
                }
            }
        }
    }

    // Fix shadows to show atop other cards, perhaps by cutting and rendering after 
    // Add recursive edits to card faces (back and front, watermark)
    // Have directions for all icons
    // Consider removing 'None' values for all but rules and watermark

    renderCardShadow(face: Face, gameContext: CanvasRenderingContext2D, x: number, y: number) {
        gameContext.globalAlpha = 0.125
        gameContext.drawImage(
            Images.CardShadowTileset, 
            Images.OffsetMap[face.connectionBits] * Images.CardShadowSizePixels, 
            0, 
            Images.CardShadowSizePixels,
            Images.CardShadowSizePixels,
            x, 
            y, 
            Images.CardShadowSizePixels,
            Images.CardShadowSizePixels,
        )
    }
    renderCardstock(face: Face, gameContext: CanvasRenderingContext2D, x: number, y: number) {
        gameContext.globalAlpha = 1.0
        gameContext.drawImage(
            Images.Tilesets, 
            Images.OffsetMap[face.connectionBits] * Images.CellSizePixels, 
            Images.OffsetTemplateCardstock * Images.CellSizePixels, 
            Images.CellSizePixels,
            Images.CellSizePixels,
            x, 
            y, 
            Images.CellSizePixels,
            Images.CellSizePixels,
        )
    }
    renderWatermark(face: Face, gameContext: CanvasRenderingContext2D, x: number, y: number) {
        if (face.watermark === Watermarks.None) return

        gameContext.globalAlpha = 0.5
        gameContext.drawImage(
            Images.Tilesets, 
            Images.OffsetMap[face.connectionBits] * Images.CellSizePixels, 
            Watermarks.TilesetOffset[face.watermark] * Images.CellSizePixels, 
            Images.CellSizePixels,
            Images.CellSizePixels,
            x, 
            y, 
            Images.CellSizePixels,
            Images.CellSizePixels,
        )
    }
    renderFaceRule(face: Face, gameContext: CanvasRenderingContext2D, x: number, y: number) {
        let offset = FaceRules.Offsets[face.rule]
        switch (face.rule) {
            case FaceRules.Pointing:
                offset += (face.direction - 1)
            break
        }

        gameContext.globalAlpha = 0.75
        gameContext.drawImage(
            Images.Icons, 
            offset * Images.CellSizePixels, 
            (face.color - 1) * Images.CellSizePixels, 
            Images.CellSizePixels,
            Images.CellSizePixels,
            x, 
            y, 
            Images.CellSizePixels,
            Images.CellSizePixels,
        )
    }
    renderCreases(face: Face, gameContext: CanvasRenderingContext2D, x: number, y: number) {
        gameContext.globalAlpha = 1.0
        gameContext.drawImage(
            Images.Tilesets, 
            Images.OffsetMap[face.creaseBits] * Images.CellSizePixels, 
            Images.OffsetTemplateCrease * Images.CellSizePixels, 
            Images.CellSizePixels,
            Images.CellSizePixels,
            x, 
            y, 
            Images.CellSizePixels,
            Images.CellSizePixels,
        )
    }
    renderFaceBorder(face: Face, gameContext: CanvasRenderingContext2D, x: number, y: number) {
        const offset = face.type === Faces.Front ? Images.OffsetTemplateFront : Images.OffsetTemplateBack
        gameContext.globalAlpha = 1.0
        gameContext.drawImage(
            Images.Tilesets, 
            Images.OffsetMap[face.connectionBits] * Images.CellSizePixels, 
            offset * Images.CellSizePixels, 
            Images.CellSizePixels,
            Images.CellSizePixels,
            x, 
            y, 
            Images.CellSizePixels,
            Images.CellSizePixels,
        )
    }


    renderTiles() {

    }
}