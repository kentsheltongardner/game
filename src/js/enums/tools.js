export default class Tools {
    static CreateSingle = 0;
    static CreateSnake = 1;
    static CreateRectangle = 2;
    static Edit = 3;
    static Connect = 4;
    static SandwichConnect = 5;
    static Disconnect = 6;
    static Crease = 7;
    static FlipFold = 8;
    static DeleteSingle = 9;
    static DeleteRecursive = 10;
    static Names = [
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
    ];
    static BaseTools = [
        Tools.CreateSingle,
        Tools.CreateSnake,
        Tools.CreateRectangle,
        Tools.Edit,
        Tools.Connect,
        Tools.Disconnect,
    ];
    static CardTools = [
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
    ];
    static TileTools = [
        Tools.CreateSingle,
        Tools.CreateSnake,
        Tools.CreateRectangle,
        Tools.Edit,
        Tools.Connect,
        Tools.Disconnect,
        Tools.DeleteSingle,
        Tools.DeleteRecursive,
    ];
}
