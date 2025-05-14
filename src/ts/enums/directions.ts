import Vector from '../geometry/vector.js'

export default class Directions {

    static readonly None            = 0
    static readonly East            = 1 // Iteration start index
    static readonly South           = 2
    static readonly West            = 3
    static readonly North           = 4
    static readonly Southeast       = 5
    static readonly Southwest       = 6
    static readonly Northwest       = 7
    static readonly Northeast       = 8 // Iteration end index

    static readonly BitsNone        = 0b00000000
    static readonly BitsEast        = 0b00000001
    static readonly BitsSouth       = 0b00000010
    static readonly BitsWest        = 0b00000100
    static readonly BitsNorth       = 0b00001000
    static readonly BitsSoutheast   = 0b00010000
    static readonly BitsSouthwest   = 0b00100000
    static readonly BitsNorthwest   = 0b01000000
    static readonly BitsNortheast   = 0b10000000

    static readonly Names = [
        'None', 
        'East', 
        'South', 
        'West', 
        'North', 
        'Southeast', 
        'Southwest', 
        'Northwest', 
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
        Directions.North,
        Directions.East,
        Directions.South,
        Directions.Northwest,
        Directions.Northeast,
        Directions.Southeast,
        Directions.Southwest
    ]

    static readonly Clockwise = [
        Directions.None,
        Directions.South,
        Directions.West,
        Directions.North,
        Directions.East,
        Directions.Southwest,
        Directions.Northwest,
        Directions.Northeast,
        Directions.Southeast
    ]

    static readonly CounterClockwise = [
        Directions.None,
        Directions.North,
        Directions.East,
        Directions.South,
        Directions.West,
        Directions.Northeast,
        Directions.Southeast,
        Directions.Southwest,
        Directions.Northwest
    ]

    static readonly HorizontalReflection = [
        Directions.None,
        Directions.West,
        Directions.South,
        Directions.East,
        Directions.North,
        Directions.Southwest,
        Directions.Southeast,
        Directions.Northeast,
        Directions.Northwest
    ]

    static readonly VerticalReflection = [
        Directions.None,
        Directions.East,
        Directions.North,
        Directions.West,
        Directions.South,
        Directions.Northeast,
        Directions.Northwest,
        Directions.Southwest,
        Directions.Southeast
    ]

    static readonly Vectors = [
        new Vector(0, 0),
        new Vector(1, 0),
        new Vector(0, 1),
        new Vector(-1, 0),
        new Vector(0, -1),
        new Vector(1, 1),
        new Vector(-1, 1),
        new Vector(-1, -1),
        new Vector(1, -1)
    ]

    static readonly X           = [ 0, 1, 0, -1, 0, 1, -1, -1, 1 ]
    static readonly Y           = [ 0, 0, 1, 0, -1, 1, 1, -1, -1 ]
    static readonly Diagonal    = [ false, false, false, false, false, true, true, true, true ]
    static readonly Orthogonal  = [ false, true, true, true, true, false, false, false, false ]

    static VectorDirections = [
        [Directions.Northwest,  Directions.North,   Directions.Northeast],
        [Directions.West,       Directions.None,    Directions.East],
        [Directions.Southwest,  Directions.South,   Directions.Southeast],
    ]

    static getDirection(dx: number, dy: number) {
        return Directions.VectorDirections[dy + 1][dx + 1]
    }

    
}