export default class Connection {
    public gridX:       number
    public gridY:       number
    public direction:   number
    constructor(gridX: number, gridY: number, direction: number) {
        this.gridX      = gridX
        this.gridY      = gridY
        this.direction  = direction
    }
}