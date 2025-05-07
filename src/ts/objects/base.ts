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
    connections:    number
    state:          number
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
        connections:    number  = 0,
        state:          number  = 0,
        fixed:          boolean = false,
        visible:        boolean = true,

    ) {
        this.type           = type
        this.rule           = rule
        this.color          = color
        this.count          = count
        this.axis           = axis
        this.direction      = direction
        this.shape          = shape
        this.spin           = spin
        this.connections    = connections
        this.state          = state
        this.fixed          = fixed
        this.visible        = visible
    }
}