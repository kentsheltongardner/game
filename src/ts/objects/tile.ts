import Colors       from '../enums/colors.js'
import Directions   from '../enums/directions.js'
import Materials    from '../enums/material.js'
import Spins        from '../enums/spins.js'

export default class Tile {
    public material:        number
    public color:           number
    public count:           number
    public direction:       number
    public spin:            number
    public fixed:           boolean
    public connectionBits:  number
    public fastenerBits:    number
    public flag:            boolean = false

    constructor(
        material:       number = Materials.Wood, 
        color:          number = Colors.None, 
        count:          number = 0, 
        direction:      number = Directions.None, 
        spin:           number = Spins.None, 
        fixed:          boolean = false,
        connectionBits: number = Directions.BitsNone, 
        fastenerBits:   number = Directions.BitsNone, 
    ) {
        this.material       = material
        this.color          = color
        this.count          = count
        this.direction      = direction
        this.spin           = spin
        this.fixed          = fixed
        this.connectionBits = connectionBits
        this.fastenerBits   = fastenerBits
    }
}