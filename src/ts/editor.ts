import Camera       from './camera.js'
import Axes         from './enums/axes.js'
import BaseRules    from './enums/base_rules.js'
import BaseTypes    from './enums/base_types.js'
import CardRules    from './enums/card_rules.js'
import Colors       from './enums/colors.js'
import Directions   from './enums/directions.js'
import Faces        from './enums/faces.js'
import Spins        from './enums/spins.js'
import Watermarks   from './enums/watermarks.js'
import Puzzle       from './puzzle.js'
import Materials    from './enums/material.js'
import Images       from './images.js'
import Layers       from './enums/layers.js'
import Tools        from './enums/tools.js'
import Base from './objects/base.js'

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

        this.populateSelect('top-card-face-select',         Faces.Names)
        this.populateSelect('top-card-watermark-select',    Watermarks.Names)
        this.populateSelect('top-card-rule-select',         CardRules.Names)
        this.populateSelect('top-card-color-select',        Colors.Names)
        this.populateSelect('top-card-direction-select',    Colors.Names)
        
        this.populateSelect('bottom-card-face-select',      Faces.Names)
        this.populateSelect('bottom-card-watermark-select', Watermarks.Names)
        this.populateSelect('bottom-card-rule-select',      CardRules.Names)
        this.populateSelect('bottom-card-color-select',     Colors.Names)
        this.populateSelect('bottom-card-direction-select', Directions.Names)

        this.populateSelect('bottom-card-face-select',      Faces.Names)
        this.populateSelect('bottom-card-watermark-select', Watermarks.Names)
        this.populateSelect('bottom-card-rule-select',      CardRules.Names)
        this.populateSelect('bottom-card-color-select',     Colors.Names)
        this.populateSelect('bottom-card-direction-select', Directions.Names)

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
    getSelect(selectId: string) {
        return document.getElementById(selectId) as HTMLSelectElement
    }
    getInput(checkboxId: string) {
        return document.getElementById(checkboxId) as HTMLInputElement
    }




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
        }
    }
    shrinkSouth() {
        if (!this.puzzle.shrinkSouth()) return

        if (this.controlGridY > this.puzzle.height() - 1) {
            this.controlGridY--
        }
    }
    shrinkWest() {
        if (!this.puzzle.shrinkWest()) return

        this.camera.shiftX(-1)
        this.controlGridX--
        if (this.controlGridX < 0) {
            this.controlGridX = 0
        }
    }
    shrinkNorth() {
        if (!this.puzzle.shrinkNorth()) return

        this.camera.shiftY(-1)
        this.controlGridY--
        if (this.controlGridY < 0) {
            this.controlGridY = 0
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

    setIntegerSelectValue(selectId: string, type: number) { this.getSelect(selectId).value = type + '' }
    getIntegerSelectValue(selectId: string) { return Number.parseInt(this.getSelect(selectId).value) }
    getCheckboxChecked(checkboxId: string) { return this.getInput(checkboxId).checked }

    base() {
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

        return new Base(type, rule, color, count, axis, direction, shape, spin, 0, power, fixed, visible)
    }
    baseShape() {
        let shape = 0
        let checkboxes = document.getElementById('base-shape-grid')!.children
        for (let i = 0; i < checkboxes.length; i++) {
            const checkbox = checkboxes[i] as HTMLInputElement
            if (!checkbox.checked) continue

            shape |= 1 << i
        }
        return shape
    }

    createSingleBase() {
        const base = this.base()
        this.puzzle.insertSingleBase(base, this.mouseDownGridX, this.mouseDownGridY)
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

        if (this.puzzle.contains(this.mouseDownGridX, this.mouseDownGridY)) {
            this.controlGridX = this.mouseDownGridX
            this.controlGridY = this.mouseDownGridY
        }

        switch (this.layer()) {
            case Layers.Base: {
                switch (this.tool()) {
                    case Tools.CreateSingle: {
                        this.createSingleBase()
                        break
                    }
                    case Tools.Connect: {
                        this.editBaseConnection(true)
                        break
                    }
                    case Tools.Disconnect: {
                        this.editBaseConnection(false)
                        break
                    }
                }
                break
            }
            case Layers.Card: {

                break
            }
            case Layers.Tile: {

                break
            }
        }
    }
    mouseMove(e: MouseEvent) {
        if (this.mousePressed) {
            if (this.spacePressed) {
                const dx = e.offsetX - this.mouseX
                const dy = e.offsetY - this.mouseY
                this.camera.pan(dx, dy)
            }
        }

        this.mouseX = e.offsetX
        this.mouseY = e.offsetY
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
        const canvasWidth   = this.canvas.width
        const canvasHeight  = this.canvas.height
        this.context.clearRect(0, 0, canvasWidth, canvasHeight)
        this.context.imageSmoothingEnabled = false

        this.renderBase(canvasWidth, canvasHeight)

        this.renderGrid(canvasWidth, canvasHeight)
        this.renderInfo(canvasWidth, canvasHeight)

        switch (this.layer()) {
            case Layers.Base: {
                switch (this.tool()) {
                    case Tools.Connect: {
                        this.renderBaseConnectionToggles(canvasWidth, canvasHeight)
                        break
                    }
                    case Tools.Disconnect: {
                        this.renderBaseConnectionToggles(canvasWidth, canvasHeight)
                        break
                    }
                }
                break
            }
            case Layers.Card: {

                break
            }
            case Layers.Tile: {

                break
            }
        }

        this.renderHover(canvasWidth, canvasHeight)
        this.renderControlSelection(canvasWidth, canvasHeight)
    }
    renderGrid(canvasWidth: number, canvasHeight: number) {
        const xEast     = this.camera.canvasX(0, canvasWidth)
        const xWest     = this.camera.canvasX(this.puzzle.width(), canvasWidth)
        const yNorth    = this.camera.canvasY(0, canvasHeight)
        const ySouth    = this.camera.canvasY(this.puzzle.height(), canvasHeight)
        this.context.beginPath()
        for (let i = 0; i <= this.puzzle.width(); i++) {
            const canvasX = this.camera.canvasX(i, canvasWidth)
            this.context.moveTo(canvasX, yNorth)
            this.context.lineTo(canvasX, ySouth)
        }
        for (let i = 0; i <= this.puzzle.height(); i++) {
            const canvasY = this.camera.canvasY(i, canvasHeight)
            this.context.moveTo(xEast, canvasY)
            this.context.lineTo(xWest, canvasY)
        }
        this.context.lineWidth = 1
        this.context.strokeStyle = '#444'
        this.context.stroke()
    }
    renderInfo(canvasWidth: number, canvasHeight: number) {
        const x = this.camera.gridX(this.mouseX, canvasWidth)
        if (!this.puzzle.containsX(x)) return

        const y = this.camera.gridY(this.mouseY, canvasHeight)
        if (!this.puzzle.containsY(y)) return

        this.context.font       = '16px sans-serif'
        this.context.fillStyle  = '#444'
        this.context.fillText(`(${x}, ${y})`, 5, canvasHeight - 7)
    }
    renderHover(canvasWidth: number, canvasHeight: number) {
        const x = this.camera.gridX(this.mouseX, canvasWidth)
        if (!this.puzzle.containsX(x)) return

        const y = this.camera.gridY(this.mouseY, canvasHeight)
        if (!this.puzzle.containsY(y)) return

        const canvasX = this.camera.canvasX(x, canvasWidth)
        const canvasY = this.camera.canvasY(y, canvasHeight)

        this.context.lineWidth = 1
        this.context.strokeStyle = '#fff4'
        this.context.strokeRect(canvasX, canvasY, this.camera.scale, this.camera.scale)
    }
    renderControlSelection(canvasWidth: number, canvasHeight: number) {
        const canvasX = this.camera.canvasX(this.controlGridX, canvasWidth)
        const canvasY = this.camera.canvasY(this.controlGridY, canvasHeight)
        
        this.context.lineWidth = 2
        this.context.strokeStyle = 'white'
        this.context.strokeRect(canvasX, canvasY, this.camera.scale, this.camera.scale)
    }

    renderBase(canvasWidth: number, canvasHeight: number) {
        for (let i = 0; i < this.puzzle.width(); i++) {
            const x = this.camera.canvasX(i, canvasWidth)
            for (let j = 0; j < this.puzzle.height(); j++) {
                const y = this.camera.canvasY(j, canvasHeight)

                const base = this.puzzle.baseGrid[i][j]

                this.context.drawImage(
                    Images.Tilesets, 
                    Images.OffsetMap[base.connections], 
                    BaseTypes.TilesetOffset[base.type], 
                    Images.CellSizePixels,
                    Images.CellSizePixels,
                    x, 
                    y, 
                    this.camera.scale, 
                    this.camera.scale
                )

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
                        offset += (base.count - 1) * Images.CellSizePixels
                    break

                    case BaseRules.Adjacent:
                        offset += base.count * Images.CellSizePixels
                    break

                    case BaseRules.Symmetric:
                        offset += (base.axis - 1) * Images.CellSizePixels
                    break

                    case BaseRules.Length:
                        offset += (base.count - 1) * Images.CellSizePixels + (base.axis - 1) * 5 * Images.CellSizePixels
                    break
                }

                this.context.drawImage(
                    Images.Icons, 
                    offset, 
                    (base.color - 1) * Images.CellSizePixels, 
                    Images.CellSizePixels,
                    Images.CellSizePixels,
                    x, 
                    y, 
                    this.camera.scale, 
                    this.camera.scale
                )
                
                if (base.fixed) {
                    this.context.drawImage(
                        Images.Tilesets, 
                        Images.OffsetMap[base.connections], 
                        Images.OffsetTemplateScrews, 
                        Images.CellSizePixels,
                        Images.CellSizePixels,
                        x, 
                        y, 
                        this.camera.scale, 
                        this.camera.scale
                    )
                }

                // this.context.fillText(base.connections.toString(2).padStart(8, '0'), x + 5, y + 20)
            }
        }
    }

    renderBaseConnectionToggles(canvasWidth: number, canvasHeight: number) {
        const potentialBaseConnections = this.puzzle.potentialBaseConnections()

        this.context.beginPath()
        const radius = this.camera.scale * ConnectionToggleRadius

        for (const connection of potentialBaseConnections) {
            const vector = Directions.Vectors[connection.direction]
            const x = this.camera.canvasX(connection.gridX + 0.5 * (1 + vector.dx), canvasWidth)
            const y = this.camera.canvasY(connection.gridY + 0.5 * (1 + vector.dy), canvasHeight)

            this.context.moveTo(x, y)
            this.context.arc(x, y, radius, 0, Tau)
        }
        this.context.fillStyle = '#ffffff20'
        this.context.fill()
    }




    renderCards() {

    }
    renderTiles() {

    }
}

