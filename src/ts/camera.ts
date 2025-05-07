const DefaultScale  = 120
const ZoomInScalar  = 5 / 4
const ZoomOutScalar = 1 / ZoomInScalar

export default class Camera {
    public centerX: number
    public centerY: number
    public scale:   number

    constructor(centerX: number, centerY: number, scale: number = DefaultScale) {
        this.centerX        = centerX
        this.centerY        = centerY
        this.scale          = scale
    }

    // Canvas position
    private canvasPosition(position: number, center: number, canvasSize: number) {
        return canvasSize / 2 + (position - center) * this.scale
    }
    public canvasX(x: number, canvasWidth: number) {
        return this.canvasPosition(x, this.centerX, canvasWidth)
    }
    public canvasY(y: number, canvasHeight: number) {
        return this.canvasPosition(y, this.centerY, canvasHeight)
    }

    // Puzzle position
    private puzzlePosition(canvasPosition: number, center: number, canvasSize: number) {
        return center + (canvasPosition - canvasSize / 2) / this.scale
    }
    public puzzleX(canvasX: number, canvasWidth: number) {
        return this.puzzlePosition(canvasX, this.centerX, canvasWidth)
    }
    public puzzleY(canvasY: number, canvasHeight: number) {
        return this.puzzlePosition(canvasY, this.centerY, canvasHeight)
    }

    // Grid position (integer)
    public gridX(canvasX: number, canvasWidth: number) {
        return Math.floor(this.puzzleX(canvasX, canvasWidth))
    }
    public gridY(canvasY: number, canvasHeight: number) {
        return Math.floor(this.puzzleY(canvasY, canvasHeight))
    }

    // Zoom
    private heightConstrainedPuzzle(puzzleWidth: number, puzzleHeight: number, canvasWidth: number, canvasHeight: number) {
        return canvasWidth * puzzleHeight > puzzleWidth * canvasHeight
    }
    private zoomCenter(canvasPosition: number, center: number, canvasSize: number, scalar: number) {
        return center + (scalar - 1) * (2 * canvasPosition - canvasSize) / (2 * scalar * this.scale)
    }
    private zoom(canvasX: number, canvasY: number, canvasWidth: number, canvasHeight: number, scalar: number) {
        this.centerX    = this.zoomCenter(canvasX, this.centerX, canvasWidth, scalar)
        this.centerY    = this.zoomCenter(canvasY, this.centerY, canvasHeight, scalar)
        this.scale      *= scalar
    }
    public zoomIn(canvasX: number, canvasY: number, canvasWidth: number, canvasHeight: number) {
        this.zoom(canvasX, canvasY, canvasWidth, canvasHeight, ZoomInScalar)
    }
    public zoomOut(canvasX: number, canvasY: number, canvasWidth: number, canvasHeight: number) {
        this.zoom(canvasX, canvasY, canvasWidth, canvasHeight, ZoomOutScalar)
    }
    public autoZoom(puzzleWidth: number, puzzleHeight: number, canvasWidth: number, canvasHeight: number) {
        this.centerX            = puzzleWidth / 2
        this.centerY            = puzzleHeight / 2
        const heightConstrained = this.heightConstrainedPuzzle(puzzleWidth, puzzleHeight, canvasWidth, canvasHeight)
        this.scale              = heightConstrained ? canvasHeight / puzzleHeight : canvasWidth / puzzleWidth
    }

    // Pan
    public pan(canvasDX: number, canvasDY: number) {
        this.centerX -= canvasDX / this.scale
        this.centerY -= canvasDY / this.scale
    }

    // Shift
    public shiftX(dx: number) {
        this.centerX += dx
    }
    public shiftY(dy: number) {
        this.centerY += dy
    }
}