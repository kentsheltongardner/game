import Images from '../images.js';
export default class FaceRules {
    static None = 0;
    static Visible = 1; // Visible
    static Hidden = 2; // Hidden
    static Paired = 3; // Touching another of different card, same color
    static Worker = 4; // On a beehive
    static Queen = 5; // On a beehive
    static Beehive = 6; // At least one bee, can't be pushed
    static Pointing = 7; // Pointing (toward another of color|same direction)
    static Names = [
        'None',
        'Visible',
        'Hidden',
        'Paired',
        'Worker',
        'Queen',
        'Beehive',
        'Pointing',
    ];
    static Offsets = [
        0, // None
        Images.OffsetIconButterfly, // Visible
        Images.OffsetIconMoth, // Hidden
        Images.OffsetIconLadybug, // Paired
        Images.OffsetIconWorker, // Worker
        Images.OffsetIconQueen, // Queen
        Images.OffsetIconBeehive, // Beehive
        Images.OffsetIconDragonfly, // Pointing
    ];
}
