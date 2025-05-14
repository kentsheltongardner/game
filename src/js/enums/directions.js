import Vector from '../geometry/vector.js';
export default class Directions {
    static None = 0;
    static East = 1; // Iteration start index
    static South = 2;
    static West = 3;
    static North = 4;
    static Southeast = 5;
    static Southwest = 6;
    static Northwest = 7;
    static Northeast = 8; // Iteration end index
    static BitsNone = 0b00000000;
    static BitsEast = 0b00000001;
    static BitsSouth = 0b00000010;
    static BitsWest = 0b00000100;
    static BitsNorth = 0b00001000;
    static BitsSoutheast = 0b00010000;
    static BitsSouthwest = 0b00100000;
    static BitsNorthwest = 0b01000000;
    static BitsNortheast = 0b10000000;
    static Names = [
        'None',
        'East',
        'South',
        'West',
        'North',
        'Southeast',
        'Southwest',
        'Northwest',
        'Northeast',
    ];
    static Bits = [
        0b00000000,
        0b00000001,
        0b00000010,
        0b00000100,
        0b00001000,
        0b00010000,
        0b00100000,
        0b01000000,
        0b10000000,
    ];
    static Opposite = [
        Directions.None,
        Directions.West,
        Directions.North,
        Directions.East,
        Directions.South,
        Directions.Northwest,
        Directions.Northeast,
        Directions.Southeast,
        Directions.Southwest
    ];
    static Clockwise = [
        Directions.None,
        Directions.South,
        Directions.West,
        Directions.North,
        Directions.East,
        Directions.Southwest,
        Directions.Northwest,
        Directions.Northeast,
        Directions.Southeast
    ];
    static CounterClockwise = [
        Directions.None,
        Directions.North,
        Directions.East,
        Directions.South,
        Directions.West,
        Directions.Northeast,
        Directions.Southeast,
        Directions.Southwest,
        Directions.Northwest
    ];
    static HorizontalReflection = [
        Directions.None,
        Directions.West,
        Directions.South,
        Directions.East,
        Directions.North,
        Directions.Southwest,
        Directions.Southeast,
        Directions.Northeast,
        Directions.Northwest
    ];
    static VerticalReflection = [
        Directions.None,
        Directions.East,
        Directions.North,
        Directions.West,
        Directions.South,
        Directions.Northeast,
        Directions.Northwest,
        Directions.Southwest,
        Directions.Southeast
    ];
    static Vectors = [
        new Vector(0, 0),
        new Vector(1, 0),
        new Vector(0, 1),
        new Vector(-1, 0),
        new Vector(0, -1),
        new Vector(1, 1),
        new Vector(-1, 1),
        new Vector(-1, -1),
        new Vector(1, -1)
    ];
    static X = [0, 1, 0, -1, 0, 1, -1, -1, 1];
    static Y = [0, 0, 1, 0, -1, 1, 1, -1, -1];
    static Diagonal = [false, false, false, false, false, true, true, true, true];
    static Orthogonal = [false, true, true, true, true, false, false, false, false];
    static VectorDirections = [
        [Directions.Northwest, Directions.North, Directions.Northeast],
        [Directions.West, Directions.None, Directions.East],
        [Directions.Southwest, Directions.South, Directions.Southeast],
    ];
    static getDirection(dx, dy) {
        return Directions.VectorDirections[dy + 1][dx + 1];
    }
}
