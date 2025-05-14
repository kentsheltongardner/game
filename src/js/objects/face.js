import FaceRules from '../enums/face_rules.js';
import Colors from '../enums/colors.js';
import Directions from '../enums/directions.js';
import FaceTypes from '../enums/face_types.js';
import Watermarks from '../enums/watermarks.js';
export default class Face {
    x = -1;
    y = -1;
    z = -1;
    type;
    watermark;
    rule;
    color;
    direction;
    connectionBits;
    creaseBits;
    connections;
    flag = false;
    constructor(type = FaceTypes.Front, watermark = Watermarks.None, rule = FaceRules.None, color = Colors.None, direction = Directions.None, connectionBits = Directions.BitsNone, creaseBits = Directions.BitsNone, connections = new Array(4).fill(null)) {
        this.type = type;
        this.watermark = watermark;
        this.rule = rule;
        this.color = color;
        this.direction = direction;
        this.connectionBits = connectionBits;
        this.creaseBits = creaseBits;
        this.connections = connections;
    }
    flipX() {
        const creaseEast = (this.creaseBits & Directions.BitsEast) === Directions.BitsEast;
        const creaseWest = (this.creaseBits & Directions.BitsWest) === Directions.BitsWest;
        this.creaseBits &= ~(Directions.BitsEast | Directions.BitsWest);
        if (creaseEast) {
            this.creaseBits |= Directions.BitsWest;
        }
        if (creaseWest) {
            this.creaseBits |= Directions.BitsEast;
        }
        this.direction = Directions.HorizontalReflection[this.direction];
        const connectionEast = this.connections[Directions.East - 1];
        const connectionWest = this.connections[Directions.West - 1];
        this.connections[Directions.East - 1] = connectionWest;
        this.connections[Directions.West - 1] = connectionEast;
    }
    flipY() {
        const creaseSouth = (this.creaseBits & Directions.BitsSouth) === Directions.BitsSouth;
        const creaseNorth = (this.creaseBits & Directions.BitsNorth) === Directions.BitsNorth;
        this.creaseBits &= ~(Directions.BitsSouth | Directions.BitsNorth);
        if (creaseSouth) {
            this.creaseBits |= Directions.BitsNorth;
        }
        if (creaseNorth) {
            this.creaseBits |= Directions.BitsSouth;
        }
        this.direction = Directions.VerticalReflection[this.direction];
        const connectionSouth = this.connections[Directions.South - 1];
        const connectionNorth = this.connections[Directions.North - 1];
        this.connections[Directions.South - 1] = connectionNorth;
        this.connections[Directions.North - 1] = connectionSouth;
    }
}
