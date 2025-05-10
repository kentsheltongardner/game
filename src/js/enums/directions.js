import Vector from '../geometry/vector.js';
export default class Directions {
    static None = 0;
    static East = 1; // Iteration start index
    static Southeast = 2;
    static South = 3;
    static Southwest = 4;
    static West = 5;
    static Northwest = 6;
    static North = 7;
    static Northeast = 8; // Iteration end index
    static BitsNone = 0b00000000;
    static BitsEast = 0b00000001;
    static BitsSoutheast = 0b00000010;
    static BitsSouth = 0b00000100;
    static BitsSouthwest = 0b00001000;
    static BitsWest = 0b00010000;
    static BitsNorthwest = 0b00100000;
    static BitsNorth = 0b01000000;
    static BitsNortheast = 0b10000000;
    static Names = [
        'None',
        'East',
        'Southeast',
        'South',
        'Southwest',
        'West',
        'Northwest',
        'North',
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
        Directions.Northwest,
        Directions.North,
        Directions.Northeast,
        Directions.East,
        Directions.Southeast,
        Directions.South,
        Directions.Southwest
    ];
    static Clockwise = [
        Directions.None,
        Directions.South,
        Directions.Southwest,
        Directions.West,
        Directions.Northwest,
        Directions.North,
        Directions.Northeast,
        Directions.East,
        Directions.Southeast
    ];
    static CounterClockwise = [
        Directions.None,
        Directions.North,
        Directions.Northeast,
        Directions.East,
        Directions.Southeast,
        Directions.South,
        Directions.Southwest,
        Directions.West,
        Directions.Northwest
    ];
    static Vectors = [
        new Vector(0, 0),
        new Vector(1, 0),
        new Vector(1, 1),
        new Vector(0, 1),
        new Vector(-1, 1),
        new Vector(-1, 0),
        new Vector(-1, -1),
        new Vector(0, -1),
        new Vector(1, -1)
    ];
    static X = [0, 1, 1, 0, -1, -1, -1, 0, 1];
    static Y = [0, 0, 1, 1, 1, 0, -1, -1, -1];
    static Diagonal = [false, false, true, false, true, false, true, false, true];
    static Orthogonal = [false, true, false, true, false, true, false, true, false];
}
