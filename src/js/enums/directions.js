export default class Directions {
    static None = 0;
    static East = 1;
    static Southeast = 2;
    static South = 3;
    static Southwest = 4;
    static West = 5;
    static Northwest = 6;
    static North = 7;
    static Northeast = 8;
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
}
