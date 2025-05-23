import Axes         from '../enums/axes.js'
import BaseRules    from '../enums/base_rules.js'
import BaseTypes    from '../enums/base_types.js'
import Colors       from '../enums/colors.js'
import Directions   from '../enums/directions.js'
import Spins        from '../enums/spins.js'

export default class Base {
    type:           number
    rule:           number  
    color:          number
    count:          number
    axis:           number
    direction:      number
    shape:          number
    spin:           number
    connectionBits: number
    power:          number
    fixed:          boolean 
    visible:        boolean

    constructor(
        type:           number  = BaseTypes.Plain,
        rule:           number  = BaseRules.None,
        color:          number  = Colors.None,
        count:          number  = 0,
        axis:           number  = Axes.None,
        direction:      number  = Directions.None,
        shape:          number  = 0,
        spin:           number  = Spins.None,
        power:          number  = 0,
        fixed:          boolean = false,
        visible:        boolean = true,
        connectionBits: number  = 0,
    ) {
        this.type           = type
        this.rule           = rule
        this.color          = color
        this.count          = count
        this.axis           = axis
        this.direction      = direction
        this.shape          = shape
        this.spin           = spin
        this.power          = power
        this.fixed          = fixed
        this.visible        = visible
        this.connectionBits = connectionBits
    }
}