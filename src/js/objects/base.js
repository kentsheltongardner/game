import Axes from '../enums/axes.js';
import BaseRules from '../enums/base_rules.js';
import BaseTypes from '../enums/base_types.js';
import Colors from '../enums/colors.js';
import Directions from '../enums/directions.js';
import Spins from '../enums/spins.js';
export default class Base {
    type;
    rule;
    color;
    count;
    axis;
    direction;
    shape;
    spin;
    connectionBits;
    power;
    fixed;
    visible;
    constructor(type = BaseTypes.Plain, rule = BaseRules.None, color = Colors.None, count = 0, axis = Axes.None, direction = Directions.None, shape = 0, spin = Spins.None, power = 0, fixed = false, visible = true, connectionBits = 0) {
        this.type = type;
        this.rule = rule;
        this.color = color;
        this.count = count;
        this.axis = axis;
        this.direction = direction;
        this.shape = shape;
        this.spin = spin;
        this.power = power;
        this.fixed = fixed;
        this.visible = visible;
        this.connectionBits = connectionBits;
    }
}
