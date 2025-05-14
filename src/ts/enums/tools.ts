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
        'Flatten' ,
    ]

    static readonly BaseTools = [
        Tools.Create,
        Tools.Edit,
        Tools.Connect,
        Tools.Disconnect,
    ]

    static readonly CardTools = [
        Tools.Create, 
        Tools.Edit, 
        Tools.Connect, 
        Tools.Crease, 
        Tools.FlipFold, 
        Tools.RecursiveDelete, 
    ]

    static readonly TileTools = [
        Tools.Create,
        Tools.Edit,
        Tools.Connect,
        Tools.Disconnect,
        Tools.Delete,
        Tools.RecursiveDelete,
    ]
}