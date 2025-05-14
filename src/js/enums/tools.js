export default class Tools {
    static Create = 0;
    static CreateSnake = 1;
    static CreateRectangle = 2;
    static Edit = 3;
    static Connect = 4;
    static SandwichConnect = 5;
    static MergeConnect = 6;
    static Disconnect = 7;
    static Crease = 8;
    static FlipFold = 9;
    static Delete = 10;
    static RecursiveDelete = 11;
    static Reverse = 12;
    static RecursiveReverse = 13;
    static Flatten = 14;
    static Names = [
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
    ];
    static BaseTools = [
        Tools.Create,
        Tools.Edit,
        Tools.Connect,
        Tools.Disconnect,
    ];
    static CardTools = [
        Tools.Create,
        Tools.Edit,
        Tools.Connect,
        Tools.Crease,
        Tools.FlipFold,
        Tools.RecursiveDelete,
    ];
    static TileTools = [
        Tools.Create,
        Tools.Edit,
        Tools.Connect,
        Tools.Disconnect,
        Tools.Delete,
        Tools.RecursiveDelete,
    ];
}
