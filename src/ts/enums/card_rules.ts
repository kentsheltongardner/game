export default class CardRules {
    static readonly None        = 0
    static readonly Visible     = 1
    static readonly Paired      = 2
    static readonly Queen       = 3
    static readonly Worker      = 4
    static readonly Hive        = 5
    static readonly Point       = 6 // All of color must point in same direction

    static readonly Names       = [
        'None', 
        'Visible', 
        'Paired', 
        'Queen', 
        'Worker', 
        'Hive', 
        'Point', 
    ]
}