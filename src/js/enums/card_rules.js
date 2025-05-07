export default class CardRules {
    static None = 0;
    static Visible = 1;
    static Paired = 2;
    static Queen = 3;
    static Worker = 4;
    static Hive = 5;
    static Point = 6; // All of color must point in same direction
    static Names = [
        'None',
        'Visible',
        'Paired',
        'Queen',
        'Worker',
        'Hive',
        'Point',
    ];
}
