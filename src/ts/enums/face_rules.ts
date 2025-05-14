import Images from '../images.js'

export default class FaceRules {
    static readonly None        = 0
    static readonly Visible     = 1 // Visible
    static readonly Hidden      = 2 // Hidden
    static readonly Paired      = 3 // Touching another of different card, same color
    static readonly Worker      = 4 // On a beehive
    static readonly Queen       = 5 // On a beehive
    static readonly Beehive     = 6 // At least one bee, can't be pushed
    static readonly Pointing    = 7 // Pointing (toward another of color|same direction)

    static readonly Names       = [
        'None', 
        'Visible', 
        'Hidden',
        'Paired', 
        'Worker', 
        'Queen', 
        'Beehive', 
        'Pointing', 
    ]

    static readonly Offsets = [
        0,                              // None
        Images.OffsetIconButterfly,     // Visible
        Images.OffsetIconMoth,          // Hidden
        Images.OffsetIconLadybug,       // Paired
        Images.OffsetIconWorker,        // Worker
        Images.OffsetIconQueen,         // Queen
        Images.OffsetIconBeehive,       // Beehive
        Images.OffsetIconDragonfly,     // Pointing
    ]
}