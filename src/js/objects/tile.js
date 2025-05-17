import Colors from '../enums/colors.js';
import Directions from '../enums/directions.js';
import Materials from '../enums/material.js';
import Spins from '../enums/spins.js';
export default class Tile {
    material;
    color;
    count;
    direction;
    spin;
    fixed;
    connectionBits;
    fastenerBits;
    flag = false;
    constructor(material = Materials.Wood, color = Colors.None, count = 0, direction = Directions.None, spin = Spins.None, fixed = false, connectionBits = Directions.BitsNone, fastenerBits = Directions.BitsNone) {
        this.material = material;
        this.color = color;
        this.count = count;
        this.direction = direction;
        this.spin = spin;
        this.fixed = fixed;
        this.connectionBits = connectionBits;
        this.fastenerBits = fastenerBits;
    }
}
