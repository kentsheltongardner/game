export default class Tools {
    static readonly CreateSingle        = 0
    static readonly CreateSnake         = 1
    static readonly CreateRectangle     = 2
    static readonly Edit                = 3
    static readonly Connect             = 4
    static readonly SandwichConnect     = 5
    static readonly Disconnect      = 6
    static readonly Crease              = 7
    static readonly FlipFold            = 8
    static readonly DeleteSingle        = 9
    static readonly DeleteRecursive     = 10

    static readonly Names = [
        'Create single', 
        'Create snake', 
        'Create rectangle', 
        'Edit', 
        'Connect', 
        'Sandwich connect', 
        'Disconnect', 
        'Crease', 
        'Flip/fold', 
        'Delete single', 
        'Delete recursive', 
    ]

    static readonly BaseTools = [
        Tools.CreateSingle,
        Tools.CreateSnake,
        Tools.CreateRectangle,
        Tools.Edit,
        Tools.Connect,
        Tools.Disconnect,
    ]

    static readonly CardTools = [
        Tools.CreateSingle,
        Tools.CreateSnake,
        Tools.CreateRectangle,
        Tools.Connect,
        Tools.SandwichConnect,
        Tools.Disconnect,
        Tools.Crease,
        Tools.FlipFold,
        Tools.DeleteSingle,
        Tools.DeleteRecursive,
        Tools.Edit,
    ]

    static readonly TileTools = [
        Tools.CreateSingle,
        Tools.CreateSnake,
        Tools.CreateRectangle,
        Tools.Edit,
        Tools.Connect,
        Tools.Disconnect,
        Tools.DeleteSingle,
        Tools.DeleteRecursive,
    ]
}