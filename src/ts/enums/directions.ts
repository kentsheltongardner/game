import Vector from '../geometry/vector.js'

export default class Directions {

    static readonly None            = 0
    static readonly East            = 1 // Iteration start index
    static readonly Southeast       = 2
    static readonly South           = 3
    static readonly Southwest       = 4
    static readonly West            = 5
    static readonly Northwest       = 6
    static readonly North           = 7
    static readonly Northeast       = 8 // Iteration end index

    static readonly BitsNone        = 0b00000000
    static readonly BitsEast        = 0b00000001
    static readonly BitsSoutheast   = 0b00000010
    static readonly BitsSouth       = 0b00000100
    static readonly BitsSouthwest   = 0b00001000
    static readonly BitsWest        = 0b00010000
    static readonly BitsNorthwest   = 0b00100000
    static readonly BitsNorth       = 0b01000000
    static readonly BitsNortheast   = 0b10000000

    static readonly Names = [
        'None', 
        'East', 
        'Southeast', 
        'South', 
        'Southwest', 
        'West', 
        'Northwest', 
        'North', 
        'Northeast', 
    ]

    static readonly Bits = [
        0b00000000,
        0b00000001,
        0b00000010,
        0b00000100,
        0b00001000,
        0b00010000,
        0b00100000,
        0b01000000,
        0b10000000,
    ]

    static readonly Opposite = [
        Directions.None,
        Directions.West,
        Directions.Northwest,
        Directions.North,
        Directions.Northeast,
        Directions.East,
        Directions.Southeast,
        Directions.South,
        Directions.Southwest
    ]

    static readonly Clockwise = [
        Directions.None,
        Directions.South,
        Directions.Southwest,
        Directions.West,
        Directions.Northwest,
        Directions.North,
        Directions.Northeast,
        Directions.East,
        Directions.Southeast
    ]

    static readonly CounterClockwise = [
        Directions.None,
        Directions.North,
        Directions.Northeast,
        Directions.East,
        Directions.Southeast,
        Directions.South,
        Directions.Southwest,
        Directions.West,
        Directions.Northwest
    ]

    static readonly Vectors = [
        new Vector(0, 0),
        new Vector(1, 0),
        new Vector(1, 1),
        new Vector(0, 1),
        new Vector(-1, 1),
        new Vector(-1, 0),
        new Vector(-1, -1),
        new Vector(0, -1),
        new Vector(1, -1)
    ]

    static readonly X           = [ 0, 1, 1, 0, -1, -1, -1, 0, 1 ]
    static readonly Y           = [ 0, 0, 1, 1, 1, 0, -1, -1, -1 ]
    static readonly Diagonal    = [ false, false, true, false, true, false, true, false, true ]
    static readonly Orthogonal  = [ false, true, false, true, false, true, false, true, false ]
}