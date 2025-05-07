export default class Directions {
    static readonly None        = 0
    static readonly East        = 1
    static readonly Southeast   = 2
    static readonly South       = 3
    static readonly Southwest   = 4
    static readonly West        = 5
    static readonly Northwest   = 6
    static readonly North       = 7
    static readonly Northeast   = 8

    static readonly Names       = [
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
}