import CardRules from '../enums/face_rules.js';
import Colors from '../enums/colors.js';
import Directions from '../enums/directions.js';
import FaceTypes from '../enums/face_types.js';
import Watermarks from '../enums/watermarks.js';
export default class Face {
    type;
    watermark;
    rule;
    color;
    direction;
    connections;
    constructor(type = FaceTypes.Front, watermark = Watermarks.None, rule = CardRules.None, color = Colors.None, direction = Directions.None, connections = 0) {
        this.face = face;
        this.watermark = watermark;
        this.rule = rule;
        this.color = color;
        this.direction = direction;
        this.connections = connections;
    }
}
