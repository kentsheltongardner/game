const DefaultScale = 120;
const ZoomInScalar = 5 / 4;
const ZoomOutScalar = 1 / ZoomInScalar;
export default class Camera {
    centerX;
    centerY;
    scale;
    constructor(centerX, centerY, scale = DefaultScale) {
        this.centerX = centerX;
        this.centerY = centerY;
        this.scale = scale;
    }
    // Canvas position
    canvasPosition(position, center, canvasSize) {
        return canvasSize / 2 + (position - center) * this.scale;
    }
    canvasX(x, canvasWidth) {
        return this.canvasPosition(x, this.centerX, canvasWidth);
    }
    canvasY(y, canvasHeight) {
        return this.canvasPosition(y, this.centerY, canvasHeight);
    }
    // Puzzle position
    puzzlePosition(canvasPosition, center, canvasSize) {
        return center + (canvasPosition - canvasSize / 2) / this.scale;
    }
    puzzleX(canvasX, canvasWidth) {
        return this.puzzlePosition(canvasX, this.centerX, canvasWidth);
    }
    puzzleY(canvasY, canvasHeight) {
        return this.puzzlePosition(canvasY, this.centerY, canvasHeight);
    }
    // Grid position (integer)
    gridX(canvasX, canvasWidth) {
        return Math.floor(this.puzzleX(canvasX, canvasWidth));
    }
    gridY(canvasY, canvasHeight) {
        return Math.floor(this.puzzleY(canvasY, canvasHeight));
    }
    // Zoom
    heightConstrainedPuzzle(puzzleWidth, puzzleHeight, canvasWidth, canvasHeight) {
        return canvasWidth * puzzleHeight > puzzleWidth * canvasHeight;
    }
    zoomCenter(canvasPosition, center, canvasSize, scalar) {
        return center + (scalar - 1) * (2 * canvasPosition - canvasSize) / (2 * scalar * this.scale);
    }
    zoom(canvasX, canvasY, canvasWidth, canvasHeight, scalar) {
        this.centerX = this.zoomCenter(canvasX, this.centerX, canvasWidth, scalar);
        this.centerY = this.zoomCenter(canvasY, this.centerY, canvasHeight, scalar);
        this.scale *= scalar;
    }
    zoomIn(canvasX, canvasY, canvasWidth, canvasHeight) {
        this.zoom(canvasX, canvasY, canvasWidth, canvasHeight, ZoomInScalar);
    }
    zoomOut(canvasX, canvasY, canvasWidth, canvasHeight) {
        this.zoom(canvasX, canvasY, canvasWidth, canvasHeight, ZoomOutScalar);
    }
    autoZoom(puzzleWidth, puzzleHeight, canvasWidth, canvasHeight) {
        this.centerX = puzzleWidth / 2;
        this.centerY = puzzleHeight / 2;
        const heightConstrained = this.heightConstrainedPuzzle(puzzleWidth, puzzleHeight, canvasWidth, canvasHeight);
        this.scale = heightConstrained ? canvasHeight / puzzleHeight : canvasWidth / puzzleWidth;
    }
    // Pan
    pan(canvasDX, canvasDY) {
        this.centerX -= canvasDX / this.scale;
        this.centerY -= canvasDY / this.scale;
    }
    // Shift
    shiftX(dx) {
        this.centerX += dx;
    }
    shiftY(dy) {
        this.centerY += dy;
    }
}
