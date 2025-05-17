export default class Tools {

    static readonly Create              = 0
    static readonly CreateSnake         = 1
    static readonly CreateRectangle     = 2
    static readonly Edit                = 3
    static readonly Connect             = 4
    static readonly SandwichConnect     = 5
    static readonly MergeConnect        = 6
    static readonly Disconnect          = 7
    static readonly Crease              = 8
    static readonly FlipFold            = 9
    static readonly Delete              = 10
    static readonly RecursiveDelete     = 11
    static readonly Reverse             = 12
    static readonly RecursiveReverse    = 13
    static readonly Flatten             = 14
    static readonly Slide               = 15
    static readonly Fasten              = 16
    static readonly Click               = 17
    static readonly Move                = 18

    static readonly Names = [
        'Create', 
        'Create snake', 
        'Create rectangle', 
        'Edit', 
        'Connect', 
        'Sandwich connect', 
        'Merge connect', 
        'Disconnect', 
        'Crease', 
        'Flip/fold', 
        'Delete', 
        'Recursive delete', 
        'Reverse', 
        'Recursive reverse', 
        'Flatten',
        'Slide',
        'Fasten',
        'Click',
        'Move',
    ]

    static readonly BaseTools = [
        Tools.Create,
        Tools.Edit,
        Tools.Connect,
        Tools.Click,
    ]

    static readonly CardTools = [
        Tools.Create, 
        Tools.Edit, 
        Tools.Connect, 
        Tools.Crease, 
        Tools.FlipFold, 
        Tools.Move,
        Tools.RecursiveDelete, 
    ]

    static readonly TileTools = [
        Tools.Create,
        Tools.Edit,
        Tools.Connect,
        Tools.Fasten,
        Tools.Slide,
        Tools.Delete,
        Tools.RecursiveDelete,
    ]
}