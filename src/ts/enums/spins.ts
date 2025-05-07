export default class Spins {
    static readonly None                = 0
    static readonly Clockwise           = 1 // Quarter
    static readonly Half                = 2
    static readonly Counterclockwise    = 3 // Quarter
    static readonly Horizontal          = 4 // Horizontal reflection
    static readonly VerticalHalf        = 5 // Vertical reflection

    static readonly Names       = [
        'None', 
        'Clockwise', 
        'Half', 
        'Counterclockwise', 
        'Horizontal', 
        'Vertical', 
    ]
}